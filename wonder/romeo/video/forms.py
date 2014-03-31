from itertools import chain
import wtforms
from flask import request
from flask.ext.wtf import Form
from wonder.romeo import db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.dolly import get_categories
from wonder.romeo.core.ooyala import create_asset
from wonder.romeo.core.sqs import background_on_sqs
from .models import Video


class VideoForm(Form):
    title = wtforms.StringField(validators=[wtforms.validators.Required()])
    description = wtforms.StringField()
    category = wtforms.SelectField(validators=[wtforms.validators.Optional()])
    filename = wtforms.StringField()
    link_url = wtforms.StringField()
    link_title = wtforms.StringField()

    def __init__(self, *args, **kwargs):
        super(VideoForm, self).__init__(*args, **kwargs)
        self.obj = kwargs.get('obj')
        self.category.choices = [
            (sc['id'], sc['name']) for sc in
            chain(*(c['sub_categories'] for c in get_categories()))]

    def save(self, **kwargs):
        if self.obj:
            video = self.obj
            self.populate_obj(video)
            event = 'updated'
        else:
            kwargs.setdefault('status', 'uploading')
            video = Video(**kwargs)
            self.populate_obj(video)
            db.session.add(video)
            db.session.flush()  # Ensure we get the id before commit
            event = 'created'

        if self.filename.data:
            create_asset_in_background(video.id)
            video.status = 'processing'
            event = 'uploaded'

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


@background_on_sqs
@commit_on_success
def create_asset_in_background(video_id):
    video = Video.query.get(video_id)
    metadata = dict(name=video.title, label=video.account_id, path=video.filepath)
    #video.external_id = create_asset(video.filename, metadata)
    print 'create_asset', metadata
    video.record_workflow_event('ooyala asset created')


class VideoLocaleForm(Form):
    locale_title = wtforms.StringField()
    locale_link_url = wtforms.StringField()
    locale_link_title = wtforms.StringField()
    locale_description = wtforms.StringField()
