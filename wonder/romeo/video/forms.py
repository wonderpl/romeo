from itertools import chain
from cStringIO import StringIO
from urlparse import urlparse
from PIL import Image
from sqlalchemy import null
import wtforms
from flask import current_app, request
from flask.ext.login import current_user
from flask.ext.wtf import Form
from wonder.romeo import db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.dolly import get_categories, push_video_data
from wonder.romeo.core.ooyala import create_asset, ooyala_request, DuplicateException
from wonder.romeo.core.email import send_email, email_template_env
from wonder.romeo.core.s3 import upload_file, download_file, media_bucket, video_bucket
from wonder.romeo.core.sqs import background_on_sqs
from wonder.romeo.account.models import AccountUser
from .models import Video, VideoTag, VideoThumbnail, VideoComment, VideoCollaborator


def _json_bool(form, field):
    field.data = bool(field.raw_data[0]) if field.raw_data else False


class BaseForm(Form):

    def __init__(self, account_id=None, *args, **kwargs):
        kwargs.setdefault('csrf_enabled', False)
        super(BaseForm, self).__init__(*args, **kwargs)
        self.obj = kwargs.get('obj')
        self.account_id = account_id or getattr(self.obj, 'account_id', None)

    def populate_obj(self, obj):
        super(BaseForm, self).populate_obj(obj)
        obj.account_id = self.account_id

    def save(self):
        if self.obj:
            obj = self.obj
            self.populate_obj(obj)
        else:
            obj = self.model()
            self.populate_obj(obj)
            db.session.add(obj)
            db.session.flush()  # Ensure we get the id before commit
        return obj


class VideoTagForm(BaseForm):
    model = VideoTag

    label = wtforms.StringField(validators=[wtforms.validators.Required()])
    description = wtforms.StringField()
    public = wtforms.BooleanField(validators=[_json_bool])

    def validate_label(self, field):
        if field.data:
            query = VideoTag.query.filter_by(account_id=self.account_id, label=field.data)
            if self.obj:
                query = query.filter(VideoTag.id != self.obj.id)
            if query.count():
                raise wtforms.ValidationError('Tag already exists')


class VideoForm(BaseForm):
    model = Video

    title = wtforms.StringField(validators=[wtforms.validators.Required()])
    strapline = wtforms.StringField()
    description = wtforms.StringField()
    category = wtforms.SelectField(validators=[wtforms.validators.Optional()])
    filename = wtforms.StringField()
    player_logo = wtforms.FileField()
    cover_image = wtforms.FileField()
    link_url = wtforms.StringField(validators=[wtforms.validators.Optional(), wtforms.validators.URL()])
    link_title = wtforms.StringField()

    def __init__(self, *args, **kwargs):
        super(VideoForm, self).__init__(*args, **kwargs)
        self.category.choices = [
            (sc['id'], sc['name']) for sc in
            chain(*(c['sub_categories'] for c in get_categories()))]

    def save(self):
        if self.category and self.category.data in ('None', ''):    # XXX: Where is this coming from?
            self.category.data = None
        video = super(VideoForm, self).save()

        event = 'updated' if self.obj else 'created'

        if self.filename and self.filename.data:
            create_ooyala_asset(video.id)
            video.status = 'processing'
            event = 'uploaded'

        if self.cover_image and self.cover_image.data:
            video.thumbnails = [
                VideoThumbnail.from_cover_image(self.cover_image.data, self.account_id)
            ]
            create_cover_thumbnails(video.id)

        video.record_workflow_event(event)

        if video.status == 'published':
            publish_video_changes(video.id)

        return video

    def is_submitted(self):
        # Include PATCH
        return request and request.method in ('PUT', 'POST', 'PATCH')

    def validate_category(self, field):
        if field.data in ('None', ''):
            field.data = None

    def validate_filename(self, field):
        if field.data:
            field.data = field.data.rsplit('/')[-1]
            filepath = Video.get_video_filepath(self.account_id, field.data)
            if not video_bucket.get_key(filepath):
                raise wtforms.ValidationError('%s not found.' % filepath)

    def validate_cover_image(self, field):
        if field.data:
            assert self.obj
            self._upload_image(field, 'cover')

    def validate_player_logo(self, field):
        if field.data:
            self._upload_image(field, 'logo')
            # TODO: save thumbnails

    def _upload_image(self, field, imagetype):
        try:
            image = Image.open(field.data)
            content_type = Image.MIME[image.format]
        except Exception as e:
            raise wtforms.ValidationError(e.message)

        stream = field.data.stream
        stream.seek(0)

        field.data = Video.get_random_filename()
        filepath = Video.get_image_filepath(field.data, imagetype, self.account_id)
        upload_file(media_bucket, filepath, stream, content_type)

        return field


@background_on_sqs
@commit_on_success
def create_ooyala_asset(video_id):
    video = Video.query.get(video_id)
    metadata = dict(name=video.title, label=video.account_id, path=video.filepath)
    try:
        video.external_id = create_asset(video.filepath, metadata)
    except DuplicateException as e:
        video.external_id = e.assetid
        from .commands import update_video_status
        update_video_status(video, dict(
            upload_status={'status': 'failed', 'failure_reason': e.message}))

    video.record_workflow_event('ooyala asset created')


@background_on_sqs
def publish_video_changes(video_id):
    video = Video.query.get(video_id)
    push_video_data(video)


@background_on_sqs
@commit_on_success
def create_cover_thumbnails(video_id):
    def _thumbnail(size, dim):
        return VideoThumbnail.from_cover_image(cover_filename, video.account_id, size, dim)

    video = Video.query.get(video_id)
    assert video.external_id
    cover_filepath = urlparse(video.thumbnails[0].url).path
    cover_filename = cover_filepath.rsplit('/', 1)[-1]

    imgdata = download_file(media_bucket, cover_filepath)
    image = Image.open(StringIO(imgdata))
    content_type = Image.MIME[image.format]
    video.thumbnails = [_thumbnail(None, image.size)]

    for size in current_app.config['COVER_THUMBNAIL_SIZES']:
        if size < image.size:
            buf = StringIO()
            timage = image.copy()
            timage.thumbnail(size, Image.ANTIALIAS)
            timage.save(buf, image.format)
            thumbnail = _thumbnail(str(size[0]), timage.size)
            upload_file(media_bucket, urlparse(thumbnail.url).path, buf, content_type)
            video.thumbnails.append(thumbnail)

    ooyala_request('assets', video.external_id,
                   'preview_image_files', method='post', data=imgdata)


class VideoLocaleForm(Form):
    locale_title = wtforms.StringField()
    locale_link_url = wtforms.StringField()
    locale_link_title = wtforms.StringField()
    locale_description = wtforms.StringField()


class VideoCollaboratorForm(BaseForm):
    model = VideoCollaborator

    email = wtforms.StringField(validators=[wtforms.validators.Required(), wtforms.validators.Email()])
    name = wtforms.StringField(validators=[wtforms.validators.Required()])
    can_download = wtforms.BooleanField(validators=[_json_bool])
    can_comment = wtforms.BooleanField(validators=[_json_bool])

    def __init__(self, video_id=None, *args, **kwargs):
        super(VideoCollaboratorForm, self).__init__(*args, **kwargs)
        self.video_id = video_id or self.obj.video_id

    def populate_obj(self, obj):
        super(VideoCollaboratorForm, self).populate_obj(obj)
        obj.video_id = self.video_id

    def save(self):
        if self.obj:
            # combine permissions with existing
            collaborator = self.obj
            for field, value in self.data.items():
                if field.startswith('can_'):
                    setattr(collaborator, field, getattr(collaborator, field) or value)
        else:
            collaborator = super(VideoCollaboratorForm, self).save()

        send_collaborator_invite_email(collaborator.id,
                                       current_user.id,
                                       can_download=self.can_download.data,
                                       can_comment=self.can_comment.data)

        return collaborator


@background_on_sqs
def send_collaborator_invite_email(collaborator_id, sending_user_id, **kwargs):
    collaborator = VideoCollaborator.query.get(collaborator_id)
    sender = AccountUser.query.get(sending_user_id)

    # if the video isn't ready yet, wait 5 mins and try again
    if collaborator.video.status not in ('ready', 'published'):
        kwargs['_delay_seconds'] = 300
        send_collaborator_invite_email(collaborator_id, sending_user_id, **kwargs)
        return

    template = email_template_env.get_template('collaborator_invite.html')
    body = template.render(
        collaborator=collaborator,
        sender=sender,
        video=collaborator.video,
        **kwargs
    )
    send_email(collaborator.email, body)


@background_on_sqs
def send_processed_email(video_id, error=None):
    video = Video.query.get(video_id)

    template = email_template_env.get_template('video_processed.html')
    body = template.render(
        video=video,
        error=error
    )

    users = AccountUser.query.filter_by(account_id=video.account_id)
    for recipient, name in users.values('username', 'display_name'):
        send_email(recipient, body)


@background_on_sqs
@commit_on_success
def send_comment_notifications(video_id, user_type, user_id):
    comments = VideoComment.query.filter_by(
        video_id=video_id, user_type=user_type, user_id=user_id, notification_sent=False
    ).all()

    if not comments:
        return

    if user_type == 'collaborator':
        sender = VideoCollaborator.query.filter_by(id=user_id).value('name')
    else:
        account_user = AccountUser.query.get(user_id)
        sender = account_user.display_name or account_user.username

    video = Video.query.get(video_id)
    template = email_template_env.get_template('comment_notification.html')

    collabs = VideoCollaborator.query.filter_by(video_id=video_id, can_comment=True)
    recipients = [(c.email, c.name, c.token) for c in collabs]
    account_users = AccountUser.query.filter_by(account_id=video.account_id)
    recipients.extend(account_users.values('username', 'display_name', null()))

    for email, username, token in recipients:
        body = template.render(
            sender=sender,
            video=video,
            comments=comments,
            email=email,
            username=username or email,
            token=token,
        )
        send_email(email, body)

    VideoComment.query.filter(
        VideoComment.id.in_([c.id for c in comments])
    ).update(dict(notification_sent=True), synchronize_session=False)


class VideoCommentForm(BaseForm):
    model = VideoComment

    comment = wtforms.StringField(validators=[wtforms.validators.Required()])
    timestamp = wtforms.IntegerField()

    def __init__(self, video_id, user_type, user_id, *args, **kwargs):
        super(VideoCommentForm, self).__init__(*args, **kwargs)
        self.video_id = video_id
        self.user_type = user_type
        self.user_id = user_id

    def populate_obj(self, obj):
        super(VideoCommentForm, self).populate_obj(obj)
        obj.video_id = self.video_id
        obj.user_type = self.user_type
        obj.user_id = self.user_id
