import os
from flask import Blueprint, current_app, request, render_template, jsonify, abort, flash
from flask.ext.wtf import Form
from flask.ext.login import current_user, login_required
from sqlalchemy.orm.exc import NoResultFound
import wtforms as wtf
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import s3connection, video_bucket
from wonder.romeo.core.sqs import background_on_sqs
from wonder.romeo.core.ooyala import get_video_data, create_asset
from .models import Video, VideoTag, VideoTagVideo, VideoThumbnail
from .forms import VideoUploadForm


videoapp = Blueprint('video', __name__)


def _s3_path(filename, base='upload'):
    return '/'.join((base, str(current_user.account_id), filename))


def _move_video(path, filename_base):
    ext = os.path.splitext(path)[1]
    src = _s3_path(path)
    dst = _s3_path(filename_base + ext, base='video')
    video_bucket.copy_key(dst, video_bucket.name, src)
    video_bucket.delete_key(src)
    return dst


@videoapp.route('/upload')
@login_required
def upload():
    upload_key = _s3_path('${filename}')
    upload_args = s3connection.build_post_form_args(
        video_bucket.name, upload_key, 3600, storage_class=None)
    return render_template('video/upload.html',
                           upload_args=upload_args,
                           upload_form=VideoUploadForm())


@videoapp.route('/upload/complete', methods=('POST',))
@login_required
@commit_on_success
def upload_complete():
    form = VideoUploadForm()
    if not form.validate_on_submit():
        return jsonify(form_errors=form.errors), 400
    video, created = form.save(account_id=current_user.account_id)

    if form.filename.data:
        dst = _move_video(form.filename.data, str(video.id))
        metadata = dict(name=video.title, label=current_user.account_id, path=dst)
        create_asset_in_background(video.id, dst, metadata)
        video.record_workflow_event('uploaded')
        video.status = 'processing'
        flash('Processing "%s"...' % form.title.data)

    return jsonify(id=video.id, status=video.status), 201 if created else 200


@background_on_sqs
@commit_on_success
def create_asset_in_background(videoid, s3path, metadata):
    video = Video.query.get(videoid)
    video.external_id = create_asset(s3path, metadata)
    video.record_workflow_event('ooyala asset created')


@videoapp.route('/videos')
@login_required
def video_list():
    videos = Video.query.filter_by(deleted=False, account_id=current_user.account_id)
    return render_template('video/list.html', videos=videos)


@videoapp.route('/_ooyala/callback')
@commit_on_success
def ooyala_callback():
    assetid = request.args['embedCode']
    video = Video.query.filter_by(external_id=assetid).first_or_404()

    try:
        data = get_video_data(assetid)
    except Exception, e:
        if hasattr(e, 'response') and e.response.status_code == 404:
            abort(404)
        raise

    if data['upload_status'].get('status') == 'failed':
        reason = data['upload_status'].get('failure_reason') or 'unknown reason'
        video.status = 'error'
        video.record_workflow_event('processing failed', reason)
        current_app.logger.error('Upload failed for %s: %s', video.id, reason)
    else:
        assert data['status'] == 'live'
        if video.status == 'processing':
            video.status = 'ready'
        video.record_workflow_event('processing complete')
        video.duration = data['duration'] / 1000
        video.thumbnails = [VideoThumbnail(**t) for t in data['thumbnails']]

    # TODO: Add tag, send notification
    return '', 204


def video_item(video):
    video_fields = {
        'id': lambda x: x,
        'deleted': lambda x: x,
        'status': lambda x: x,
        'public': lambda x: x,
        'date_added': lambda x: x.strftime('%Y-%m-%d %H:%M:%S'),
        'date_updated': lambda x: x.strftime('%Y-%m-%d %H:%M:%S'),
        'title': lambda x: x,
        'description': lambda x: x,
        'duration': lambda x: x,
        'category': lambda x: x
    }

    locale_fields = ['locale', 'link_url', 'link_title', 'title', 'description']

    thumbnail_fields = ['url', 'width', 'height']

    # Add basic video data
    data = {field: func(getattr(video, field)) for field, func in video_fields.iteritems()}

    # Attach locale data
    for locale in video.locale_meta:
        locale_d = data.setdefault('locale', {})
        for field in locale_fields:
            locale_d.setdefault(locale.locale, {})[field] = getattr(locale, field)

    # Attach thumbnail data
    for thumbnail in video.thumbnails:
        data.setdefault('thumbnails', []).append({field: getattr(thumbnail, field) for f in thumbnail_fields})

    # TODO: filter(VideoTag.account_id == account_id)
    data['tags'] = [str(tag.id) for tag in VideoTag.query.all()]

    return data


@api_resource('/video')
class VideoListApi(Resource):
    def get(self):
        return dict(videos=[video_item(video) for video in Video.query.order_by('date_added').all()])


class VideoForm(Form):
    title = wtf.StringField()
    description = wtf.StringField()
    category = wtf.StringField()
    public = wtf.StringField()


class VideoLocaleForm(Form):
    locale_title = wtf.StringField()
    locale_link_url = wtf.StringField()
    locale_link_title = wtf.StringField()
    locale_description = wtf.StringField()


@api_resource('/video/<string:video_id>')
class VideoApi(Resource):
    def get(self, video_id):
        video = Video.query.get_or_404(video_id)
        return video_item(video)

    def post(self, video_id):
        video = Video.query.get_or_404(video_id)

        form = VideoForm(csrf_enabled=False)
        if not form.validate():
            abort(400, form_errors=form.errors)

        video.title = form.title.data or video.title
        video.query.session.commit()

        return 204


@api_resource('/video/<string:video_id>/tag')
class VideoTagListApi(Resource):
    def get(self, video_id):
        video = Video.query.get_or_404(video_id)
        return {tag.id: tag.label for tag in video.tags}

    def post(self, video_id):
        # TODO: add account constraint
        video = Video.query.get_or_404(video_id)
        tag = VideoTag.query.get_or_404(request.form.get('id'))
        VideoTagVideo.query.session.add(
            VideoTagVideo(video_id=video.id, tag_id=tag.id)
        )
        VideoTagVideo.query.session.commit()


@api_resource('/tag')
class VideoTagApi(Resource):
    def post(self):
        try:
            video = VideoTag.query.filter(
                VideoTag.account_id == request.form.get('account_id'),
                VideoTag.label == request.form.get('label')
            ).one()
        except NoResultFound:
            VideoTag.query.session.add(
                VideoTag(
                    label=request.form.get('label'),
                    account_id=request.form.get('account_id')
                )
            )
            VideoTag.query.session.commit()
            return 204
        else:
            abort(400)
