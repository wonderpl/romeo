from itertools import chain
from cStringIO import StringIO
from urlparse import urlparse
from PIL import Image
from sqlalchemy import null, func
import wtforms
from flask import current_app, request
from flask.ext.login import current_user
from flask.ext.wtf import Form
from wonder.common.sqs import background_on_sqs
from wonder.common.imaging import resize
from wonder.common.forms import email_validator
from wonder.common.i18n import lazy_gettext as _
from wonder.romeo import db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.dolly import get_categories, push_video_data
from wonder.romeo.core.ooyala import create_asset, ooyala_request, DuplicateException
from wonder.romeo.core.email import send_email, email_template_env
from wonder.romeo.core.s3 import upload_file, download_file, media_bucket, video_bucket
from wonder.romeo.core.util import gravatar_url, get_random_filename
from wonder.romeo.account.models import AccountUser, RegistrationToken
from .models import Video, VideoTag, VideoThumbnail, VideoComment, VideoCollaborator


def JsonBoolean(default=False):
    def validate(form, field):
        # ensure data is set to a boolean value
        field.data = bool(field.raw_data[0]) if field.raw_data else default
    return validate


class JsonOptional(wtforms.validators.Optional):
    def __call__(self, form, field):
        if field.raw_data == [None]:
            field.raw_data = None
        super(JsonOptional, self).__call__(form, field)


def ImageData(imagetype=None, thumbnails=[]):
    def validate(self, field):
        if field.data:
            self._process_image_field(field, imagetype or field.name, thumbnails)
    return validate


class BaseForm(Form):

    def __init__(self, account_id=None, *args, **kwargs):
        kwargs.setdefault('csrf_enabled', False)
        super(BaseForm, self).__init__(*args, **kwargs)
        self.obj = kwargs.get('obj')
        self.account_id = account_id or getattr(self.obj, 'account_id', None)

    def is_submitted(self):
        # Include PATCH
        return request and request.method in ('PUT', 'POST', 'PATCH')

    def populate_obj(self, obj):
        super(BaseForm, self).populate_obj(obj)
        obj.account_id = self.account_id

    def save(self):
        if self.obj:
            obj = self.obj
            self.populate_obj(obj)
        else:
            obj = self.Meta.model()
            self.populate_obj(obj)
            db.session.add(obj)
            db.session.flush()  # Ensure we get the id before commit
        return obj

    def _process_image_field(self, field, imagetype, thumbnails):
        filepath = lambda name, label: self.Meta.model.get_image_filepath(
            self.account_id, name, imagetype, label)

        if isinstance(field.data, basestring):
            field.data = field.data.rsplit('/')[-1]
            original_path = filepath(field.data, 'original')
            if not media_bucket.get_key(original_path):
                raise wtforms.ValidationError('%s not found.' % original_path)
        else:
            try:
                image = Image.open(field.data)
                content_type = Image.MIME[image.format]
            except Exception as e:
                raise wtforms.ValidationError(e.message)

            stream = field.data.stream
            stream.seek(0)

            field.data = get_random_filename()
            upload_file(media_bucket, filepath(field.data, 'original'),
                        stream, content_type)

            if thumbnails is True:
                thumbnails = '%s_THUMBNAIL_SIZES' % imagetype.upper()
            if isinstance(thumbnails, basestring):
                thumbnails = current_app.config[thumbnails]
            for size, buf in resize(image, thumbnails, save_to_buffer='jpeg'):
                upload_file(media_bucket, filepath(field.data, str(size[0])),
                            buf, 'image/jpeg')

        return field


class VideoTagForm(BaseForm):
    label = wtforms.StringField(validators=[wtforms.validators.Required()])
    description = wtforms.StringField()
    public = wtforms.BooleanField(validators=[JsonBoolean()])

    class Meta:
        model = VideoTag

    def validate_label(self, field):
        if field.data:
            query = VideoTag.query.filter_by(account_id=self.account_id, label=field.data)
            if self.obj:
                query = query.filter(VideoTag.id != self.obj.id)
            if query.count():
                raise wtforms.ValidationError('Tag already exists')


class VideoForm(BaseForm):
    title = wtforms.StringField(validators=[wtforms.validators.Required()])
    strapline = wtforms.StringField()
    description = wtforms.StringField()
    category = wtforms.SelectField(validators=[wtforms.validators.Optional()])
    search_keywords = wtforms.StringField()
    hosted_url = wtforms.StringField(validators=[wtforms.validators.Optional(), wtforms.validators.URL()])
    filename = wtforms.StringField()
    player_logo = wtforms.FileField(validators=[ImageData('logo')])
    cover_image = wtforms.FileField(validators=[ImageData('cover')])
    link_url = wtforms.StringField(validators=[wtforms.validators.Optional(), wtforms.validators.URL()])
    link_title = wtforms.StringField()
    copy_video = wtforms.IntegerField()

    class Meta:
        model = Video

    def __init__(self, *args, **kwargs):
        super(VideoForm, self).__init__(*args, **kwargs)
        self.category.choices = [
            (sc['id'], sc['name']) for sc in
            chain(*(c['sub_categories'] for c in get_categories()))]

    def save(self):
        if self.category and self.category.data in ('None', ''):    # XXX: Where is this coming from?
            self.category.data = None

        if self.copy_video and self.copy_video.data:
            video = self.copy_video.data.clone()
            self.populate_obj(video)
            db.session.add(video)
            db.session.flush()
        else:
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
            create_cover_thumbnails(video.id, self.cover_image.data)

        video.record_workflow_event(event, getattr(video, '_source_id', None))

        if video.status == 'published':
            publish_video_changes(video.id)

        return video

    def validate(self):
        success = super(VideoForm, self).validate()
        if not self.obj and self.copy_video.data:
            # Other fields are not required when copying
            if self.errors:
                for name, errors in self._errors.items():
                    errors = [e for e in errors if e != 'This field is required.']
                    if errors:
                        self._errors[name] = errors
                    else:
                        del self._errors[name]
            # Remove fields with empty values so they don't override the source
            for name, field in self._fields.items():
                if not field.data:
                    del self._fields[name]
            success = not self._errors
        return success

    def validate_copy_video(self, field):
        if field.data:
            field.data = Video.query.get(self.copy_video.data)
            if (not field.data or
                    field.data.status == 'uploading' or
                    (field.data.account_id != self.account_id and not
                     current_user.has_collaborator_permission(field.data.id, 'download'))):
                raise wtforms.ValidationError(_('Invalid video id.'))

    def validate_category(self, field):
        if field.data in ('None', ''):
            field.data = None

    def validate_filename(self, field):
        if field.data:
            field.data = field.data.rsplit('/')[-1]
            filepath = Video.get_video_filepath(self.account_id, field.data)
            if not video_bucket.get_key(filepath):
                raise wtforms.ValidationError('%s not found.' % filepath)


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
def create_cover_thumbnails(video_id, cover_filename=None):
    def _thumbnail(label, size):
        return VideoThumbnail.from_cover_image(cover_filename, video.account_id, label, size)

    video = Video.query.get(video_id)
    assert video.external_id
    cover_filepath = urlparse(video.thumbnails[0].url).path
    if cover_filename != cover_filepath.rsplit('/', 1)[-1]:
        current_app.logger.warning('Unexpected cover image: %d: %s: %s',
                                   video_id, cover_filename, cover_filepath)
        return

    imgdata = StringIO(download_file(media_bucket, cover_filepath))
    image = Image.open(imgdata)
    video.thumbnails = [_thumbnail(None, image.size)]

    sizes = [size for size in current_app.config['COVER_THUMBNAIL_SIZES']
             if size < image.size]
    for size, buf in resize(image, sizes, save_to_buffer='jpeg'):
        thumbnail = _thumbnail(str(size[0]), size)
        upload_file(media_bucket, urlparse(thumbnail.url).path, buf, 'image/jpeg')
        video.thumbnails.append(thumbnail)
        imgdata = buf

    try:
        ooyala_request('assets', video.external_id, 'preview_image_files',
                       method='post', data=imgdata.getvalue())
    except Exception:
        current_app.logger.exception('Unable to set preview image for %d (%s)',
                                     video.id, video.external_id)


class VideoLocaleForm(Form):
    locale_title = wtforms.StringField()
    locale_link_url = wtforms.StringField()
    locale_link_title = wtforms.StringField()
    locale_description = wtforms.StringField()


class VideoCollaboratorForm(BaseForm):
    email = wtforms.StringField(validators=[
        wtforms.validators.Required(), wtforms.validators.Email(), email_validator()])
    name = wtforms.StringField(validators=[wtforms.validators.Required()])
    can_download = wtforms.BooleanField(validators=[JsonBoolean()])
    can_comment = wtforms.BooleanField(validators=[JsonBoolean()])

    class Meta:
        model = VideoCollaborator

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
            changed = False
            for field, newvalue in self.data.items():
                if field.startswith('can_'):
                    oldvalue = getattr(collaborator, field)
                    setattr(collaborator, field, oldvalue or newvalue)
                    changed = changed or (not oldvalue and newvalue)
        else:
            collaborator = super(VideoCollaboratorForm, self).save()
            changed = True

        if changed:
            send_collaborator_invite_email(collaborator.id,
                                           current_user.id,
                                           can_download=self.can_download.data,
                                           can_comment=self.can_comment.data)

        return collaborator


@background_on_sqs
@commit_on_success
def send_collaborator_invite_email(collaborator_id, sending_user_id, **kwargs):
    collaborator = VideoCollaborator.query.get(collaborator_id)
    if not collaborator:
        return

    sender = AccountUser.query.get(sending_user_id)

    # if the video isn't ready yet, wait 5 mins and try again
    if collaborator.video.status not in ('ready', 'published') and not current_app.debug:
        kwargs['_delay_seconds'] = 300
        send_collaborator_invite_email(collaborator_id, sending_user_id, **kwargs)
        return

    if current_app.config.get('ENABLE_REGISTRATION_AUTH'):
        kwargs['reg_token'] = RegistrationToken.new(collaborator.email).id

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

    try:
        error_message = current_app.config['VIDEO_ERROR_MESSAGES'][error]
    except KeyError:
        current_app.logger.warning('Unable to map error message: %s', error)
        error_message = None

    template = email_template_env.get_template('video_processed.html')
    users = AccountUser.query.filter_by(account_id=video.account_id)
    for recipient, name in users.values('username', 'display_name'):
        body = template.render(
            username=name,
            video=video,
            error=error,
            error_message=error_message,
        )
        send_email(recipient, body)


@background_on_sqs
def send_published_email(video_id, dolly_channel, dolly_instance):
    video = Video.query.get(video_id)

    link = current_app.config['DOLLY_WEBLITE_URL_FMT'].format(
        slug='-', channelid=dolly_channel, instanceid=dolly_instance)
    template = email_template_env.get_template('video_published.html')

    users = AccountUser.query.filter_by(account_id=video.account_id)
    for recipient, name in users.values('username', 'display_name'):
        body = template.render(video=video, link=link, username=name)
        send_email(recipient, body)

    collabs = VideoCollaborator.query.filter_by(video_id=video_id)
    for recipient, name in collabs.values('email', 'name'):
        body = template.render(video=video, link=link, username=name)
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
        sender = VideoCollaborator.query.get(user_id)
    else:
        sender = AccountUser.query.get(user_id)

    video = Video.query.get(video_id)
    template = email_template_env.get_template('comment_notification.html')

    collabs = VideoCollaborator.query.filter_by(
        video_id=video_id, can_comment=True
    ).outerjoin(AccountUser).values(
        func.coalesce(AccountUser.username, VideoCollaborator.email),
        func.coalesce(AccountUser.display_name, VideoCollaborator.name),
        VideoCollaborator.id
    )
    account_users = AccountUser.query.filter_by(
        account_id=video.account_id).values('username', 'display_name', null())

    for email, username, collaborator_id in chain(collabs, account_users):
        body = template.render(
            sender=sender,
            video=video,
            comments=comments,
            email=email,
            username=username or email,
            token=collaborator_id and VideoCollaborator.get_token(collaborator_id),
            gravatar_url=gravatar_url,
        )
        send_email(email, body)

    VideoComment.query.filter(
        VideoComment.id.in_([c.id for c in comments])
    ).update(dict(notification_sent=True), synchronize_session=False)


class VideoCommentForm(BaseForm):
    comment = wtforms.StringField(validators=[wtforms.validators.Required()])
    timestamp = wtforms.IntegerField()

    class Meta:
        model = VideoComment

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
