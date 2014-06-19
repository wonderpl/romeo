import wtforms
from flask.ext.wtf import Form
from wonder.romeo.video.models import Video, VideoSeoEmbed


class VideoSeoEmbedForm(Form):
    video_id = wtforms.IntegerField(validators=[wtforms.validators.Required()])
    link_url = wtforms.StringField(
        validators=[wtforms.validators.Required(), wtforms.validators.URL()])
    title = wtforms.StringField()
    description = wtforms.StringField()

    def validate_title(self, field):
        if not field.data:
            if not self.video_id.data:
                raise wtforms.ValidationError('video_id required')
            video = Video.query.get(self.video_id.data)
            if not video:
                raise wtforms.ValidationError('Video does not exist')
            field.data = video.title

    def validate_description(self, field):
        if not field.data:
            if not self.video_id.data:
                raise wtforms.ValidationError('video_id required')
            video = Video.query.get(self.video_id.data)
            if not video:
                raise wtforms.ValidationError('Video does not exist')
            field.data = video.description
