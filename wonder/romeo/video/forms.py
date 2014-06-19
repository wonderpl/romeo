from itertools import chain
from cStringIO import StringIO
from urlparse import urlparse
from PIL import Image
import wtforms
from flask import current_app, request
from flask.ext.wtf import Form
from wonder.romeo import db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.dolly import get_categories
from wonder.romeo.core.ooyala import create_asset, ooyala_request
from wonder.romeo.core.s3 import upload_file, download_file, media_bucket
from wonder.romeo.core.sqs import background_on_sqs
from .models import Video, VideoTag, VideoThumbnail


class BaseForm(Form):

    def __init__(self, account_id=None, *args, **kwargs):
        super(BaseForm, self).__init__(*args, **kwargs)
        self.obj = kwargs.get('obj')
        self.account_id = account_id or self.obj.account_id

    def save(self):
        if self.obj:
            obj = self.obj
            self.populate_obj(obj)
        else:
            obj = self.model()
            self.populate_obj(obj)
            obj.account_id = self.account_id
            db.session.add(obj)
            db.session.flush()  # Ensure we get the id before commit
        return obj


class VideoTagForm(BaseForm):
    model = VideoTag

    label = wtforms.StringField(validators=[wtforms.validators.Required()])
    description = wtforms.StringField()
    public = wtforms.BooleanField()

    def validate_label(self, field):
        if field.data:
            query = VideoTag.query.filter_by(account_id=self.account_id, label=field.data)
            if self.obj:
                query = query.filter(VideoTag.id != self.obj.id)
            if query.count():
                raise wtforms.ValidationError('Tag already exists')

    def validate_public(self, field):
        field.data = bool(field.raw_data[0]) if field.raw_data else False


class VideoForm(BaseForm):
    model = Video

    title = wtforms.StringField(validators=[wtforms.validators.Required()])
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
        video = super(VideoForm, self).save()

        event = 'updated' if self.obj else 'created'

        if self.filename and self.filename.data:
            create_asset_in_background(video.id)
            video.status = 'processing'
            event = 'uploaded'

        if self.cover_image and self.cover_image.data:
            video.thumbnails = [
                VideoThumbnail.from_cover_image(self.cover_image.data, self.account_id)
            ]
            create_cover_thumbnails(video.id)

        video.record_workflow_event(event)

        return video

    def is_submitted(self):
        # Include PATCH
        return request and request.method in ('PUT', 'POST', 'PATCH')

    def validate_category(self, field):
        if field.data in ('None', ''):
            field.data = None

    def validate_filename(self, field):
        # TODO: Check account id?
        if field.data:
            field.data = field.data.rsplit('/')[-1]

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
def create_asset_in_background(video_id):
    video = Video.query.get(video_id)
    metadata = dict(name=video.title, label=video.account_id, path=video.filepath)
    video.external_id = create_asset(video.filepath, metadata)
    video.record_workflow_event('ooyala asset created')


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
