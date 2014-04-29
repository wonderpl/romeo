from functools import wraps
from flask import Blueprint, current_app, request, render_template, abort, url_for, json
from flask.ext.login import current_user, login_required
from flask.ext.restful.reqparse import RequestParser
from wonder.romeo import db
from wonder.romeo.core.dolly import get_categories, get_video_embed_content
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import s3connection, video_bucket
from wonder.romeo.core.ooyala import ooyala_request, get_video_data
from wonder.romeo.account.views import dolly_account_view, get_dollyuser
from .models import Video, VideoTag, VideoTagVideo, VideoThumbnail
from .forms import VideoTagForm, VideoForm


videoapp = Blueprint('video', __name__)


@videoapp.route('/upload')
@login_required
def upload():
    return render_template('video/upload.html')


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


@videoapp.route('/embed/<videoid>/')
@videoapp.route('/embed/<videoid>')
def video_embed(videoid):
    return get_video_embed_content(videoid)


@api_resource('/categories')
class CategoriesResource(Resource):
    def get(self):
        return dict(category=dict(items=get_categories()))


@api_resource('/account/<int:account_id>/tags')
class AccountTagsResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('label', type=str)
    tag_parser.add_argument('description', type=str)

    @dolly_account_view
    def get(self, account, dollyuser):
        items = map(_tag_item, account.tags)
        return dict(tag=dict(items=items, total=len(items)))

    @dolly_account_view
    @commit_on_success
    def post(self, account, dollyuser):
        form = VideoTagForm(account_id=account.id, csrf_enabled=False)
        if not form.validate():
            return dict(error='invalid_request', form_errors=form.errors), 400

        tag = form.save()

        if True:    # XXX: Make this conditional on some flag
            channeldata = dict(title=tag.label, description=tag.description)
            try:
                tag.dolly_channel = dollyuser.create_channel(channeldata)['id']
            except Exception as e:
                if hasattr(e, 'response'):
                    return e.response.json(), e.response.status_code
                else:
                    raise

        return dict(id=tag.id, href=tag.href), 201, {'Location': tag.href}


def _tag_item(tag):
    return dict((p, getattr(tag, p)) for p in ('id', 'href', 'label', 'description'))


def tag_view(f):
    @wraps(f)
    def decorator(self, tag_id):
        tag = VideoTag.query.filter_by(id=tag_id).first_or_404()
        if tag.account_id == current_user.account_id:
            return f(self, tag)
        else:
            abort(403)
    return decorator


@api_resource('/tag/<int:tag_id>')
class TagResource(Resource):

    @tag_view
    def get(self, tag):
        return _tag_item(tag)

    @commit_on_success
    @tag_view
    def put(self, tag):
        form = VideoTagForm(obj=tag, csrf_enabled=False)
        if not form.validate():
            return dict(error='invalid_request', form_errors=form.errors), 400

        tag = form.save()

        if tag.dolly_channel:
            channeldata = dict(title=tag.label, description=tag.description)
            try:
                get_dollyuser(current_user.account).update_channel(tag.dolly_channel, channeldata)
            except Exception as e:
                if hasattr(e, 'response'):
                    return e.response.json(), e.response.status_code
                else:
                    raise

        return None, 204

    @commit_on_success
    @tag_view
    def delete(self, tag):
        if tag.dolly_channel:
            get_dollyuser(current_user.account).delete_channel(tag.dolly_channel)
        db.session.delete(tag)
        return None, 204


@api_resource('/account/<int:account_id>/upload_args')
class VideoUploadArgsResource(Resource):

    @dolly_account_view
    def get(self, account, dollyuser):
        upload_args = s3connection.build_post_form_args(
            video_bucket.name, Video.get_filepath(account.id), 3600, storage_class=None)
        return upload_args


@api_resource('/account/<int:account_id>/videos')
class AccountVideosResource(Resource):

    @dolly_account_view
    def get(self, account, dollyuser):
        items = map(_video_item, Video.query.filter_by(
            account_id=account.id, deleted=False).order_by('date_added'))
        return dict(video=dict(items=items, total=len(items)))

    @commit_on_success
    @dolly_account_view
    def post(self, account, dollyuser):
        form = VideoForm(account_id=account.id, csrf_enabled=False)
        if not form.category.data:
            delattr(form, 'category')

        if form.validate():
            video = form.save()
            return dict(id=video.id, href=video.href, status=video.status), 201,\
                {'Location': video.href}
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400


def _video_item(video):
    data = {f: getattr(video, f) for f in (
        'id', 'href', 'status', 'date_added', 'date_updated',
        'title', 'description', 'duration', 'category')}

    # Convert dates to strings:
    for f, v in data.items():
        if hasattr(v, 'isoformat'):
            data[f] = v.isoformat()

    data['thumbnails'] = dict(
        items=[
            {f: getattr(thumbnail, f) for f in ('url', 'width', 'height')}
            for thumbnail in video.thumbnails
        ]
    )

    data['tags'] = dict(
        href=url_for('api.videotags', video_id=video.id),
        items=map(_tag_item, video.tags),
    )

    return data


def video_view(f):
    @wraps(f)
    def decorator(self, video_id):
        video = Video.query.filter_by(deleted=False, id=video_id).first_or_404()
        if video.account_id == current_user.account_id:
            return f(self, video)
        else:
            abort(403)
    return decorator


@api_resource('/video/<int:video_id>')
class VideoResource(Resource):
    @video_view
    def get(self, video):
        return _video_item(video)

    @commit_on_success
    @video_view
    def patch(self, video):
        form = VideoForm(obj=video, csrf_enabled=False)
        # Exclude form fields that weren't specified in the request
        for field in form.data:
            if field not in (request.json or request.form):
                delattr(form, field)

        if form.validate():
            form.save()
            return dict(status=video.status), 200
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400

    @commit_on_success
    @video_view
    def delete(self, video):
        video.deleted = True
        return None, 204


@api_resource('/video/<int:video_id>/preview_images')
class VideoPreviewImagesResource(Resource):

    @video_view
    def get(self, video):
        items = ooyala_request('assets', video.external_id, 'generated_preview_images')
        return dict(image=dict(items=items))


@api_resource('/video/<int:video_id>/primary_preview_image')
class VideoPrimaryPreviewImageResource(Resource):

    preview_image_parser = RequestParser()
    preview_image_parser.add_argument('time', type=int, required=True)

    @commit_on_success
    @video_view
    def put(self, video):
        args = self.preview_image_parser.parse_args()
        thumbnails = ooyala_request(
            'assets', video.external_id, 'primary_preview_image',
            data=json.dumps(dict(type='generated', time=args['time'])), method='put')
        for t in thumbnails['sizes']:
            del t['time']
        video.thumbnails = [VideoThumbnail(**t) for t in thumbnails['sizes']]
        return dict(image=dict(items=thumbnails['sizes']))


@api_resource('/video/<int:video_id>/tags')
class VideoTagsResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('id', type=int)

    @video_view
    def get(self, video):
        return dict(tag=dict(items=map(_tag_item, video.tags)))

    @commit_on_success
    @video_view
    def post(self, video):
        args = self.tag_parser.parse_args()
        tag_id = args['id']

        tag = VideoTag.query.filter_by(id=tag_id, account_id=video.account_id).first()
        if not tag:
            return dict(error='invalid_request', form_errors=dict(id=['Invalid tag id'])), 400

        if VideoTagVideo.query.filter_by(video_id=video.id, tag_id=tag.id).count():
            return None, 204

        if tag.dolly_channel and video.external_id:
            videodata = dict(source_id=video.external_id)
            get_dollyuser(current_user.account).publish_video(tag.dolly_channel, videodata)

        video_tag_video = VideoTagVideo(video_id=video.id, tag_id=tag.id)
        db.session.add(video_tag_video)
        db.session.flush()

        return dict(href=video_tag_video.href), 201, {'Location': video_tag_video.href}


@api_resource('/video/<int:video_id>/tags/<int:tag_id>')
class VideoTagVideoResource(Resource):

    @commit_on_success
    def delete(self, video_id, tag_id):
        video = Video.query.filter_by(id=video_id, account_id=current_user.account_id).first_or_404()
        tag = VideoTag.query.filter_by(id=tag_id, account_id=current_user.account_id).first_or_404()
        tag_relation = VideoTagVideo.query.filter_by(video_id=video_id, tag_id=tag_id).first_or_404()

        if tag.dolly_channel and video.external_id:
            videodata = dict(source_id=video.external_id)
            get_dollyuser(current_user.account).remove_video(tag.dolly_channel, videodata)

        db.session.delete(tag_relation)

        return None, 204
