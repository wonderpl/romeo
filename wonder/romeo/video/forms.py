from itertools import chain
import wtforms
from flask import request
from flask.ext.wtf import Form
from wonder.romeo import db
from wonder.romeo.core.dolly import get_categories
from .models import Video


class VideoUploadForm(Form):
    videoid = wtforms.IntegerField(validators=[wtforms.validators.Optional()])
    filename = wtforms.TextField(validators=[wtforms.validators.Optional()])
    title = wtforms.TextField()
    category = wtforms.SelectField()

    def __init__(self, *args, **kwargs):
        super(VideoUploadForm, self).__init__(*args, **kwargs)
        self.category.grouped_choices = get_categories()
        self.category.choices = [('', '')] + [
            (sc['id'], sc['name']) for sc in
            chain(*(c['sub_categories'] for c in self.category.grouped_choices))]

    def save(self, **kwargs):
        kwargs.setdefault('status', 'uploading')
        if self.videoid.data:
            video = Video.query.filter_by(id=self.videoid.data, **kwargs).one()
            self.populate_obj(video)
            return video, False
        else:
            video = Video(**kwargs)
            self.populate_obj(video)
            video.record_workflow_event('created')
            db.session.add(video)
            db.session.flush()  # Ensure we get the id before commit
            return video, True


class VideoForm(Form):
    title = wtforms.StringField()
    description = wtforms.StringField()
    category = wtforms.SelectField()
    filename = wtforms.TextField()
    public = wtforms.BooleanField()
    link_url = wtforms.StringField()
    link_title = wtforms.StringField()

    def __init__(self, *args, **kwargs):
        super(VideoForm, self).__init__(*args, **kwargs)
        self.category.choices = [
            (sc['id'], sc['name']) for sc in
            chain(*(c['sub_categories'] for c in get_categories()))]

    def save(self, **kwargs):
        if self.obj:
            self.populate_obj(self.obj)
            return self.obj, False
        else:
            kwargs.setdefault('status', 'uploading')
            video = Video(**kwargs)
            self.populate_obj(video)
            video.record_workflow_event('created')
            db.session.add(video)
            db.session.flush()  # Ensure we get the id before commit
            return video, True

    def is_submitted(self):
        # Include PATCH
        return request and request.method in ('PUT', 'POST', 'PATCH')


class VideoLocaleForm(Form):
    locale_title = wtforms.StringField()
    locale_link_url = wtforms.StringField()
    locale_link_title = wtforms.StringField()
    locale_description = wtforms.StringField()
