import os
from flask import Blueprint, current_app, request, render_template, url_for, jsonify, abort, flash
from flask.ext.login import current_user, login_required
from flask.ext.restful.reqparse import RequestParser
from sqlalchemy.orm.exc import NoResultFound
from wonder.romeo import db
from wonder.romeo.core.dolly import DollyUser
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import s3connection, video_bucket
from wonder.romeo.core.sqs import background_on_sqs
from wonder.romeo.core.ooyala import get_video_data, create_asset
from .models import Video, VideoTag, VideoTagVideo, VideoThumbnail
from .forms import VideoUploadForm, VideoForm


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
    data['href'] = url_for('api.video', video_id=video.id)

    # Attach locale data
    for locale in video.locale_meta:
        locale_d = data.setdefault('locale', {})
        for field in locale_fields:
            locale_d.setdefault(locale.locale, {})[field] = getattr(locale, field)

    # Attach thumbnail data
    for thumbnail in video.thumbnails:
        data.setdefault('thumbnails', []).append({field: getattr(thumbnail, field) for f in thumbnail_fields})

    video_tags = [dict(id=tag.id, label=tag.label) for tag in video.tags]
    data['tags'] = dict(items=video_tags, total=len(video_tags))

    return data


@api_resource('/account/<int:account_id>/videos')
class AccountVideosResource(Resource):
    def get(self, account_id):
        if account_id != current_user.account_id:
            abort(403)
        items = map(video_item, Video.query.filter_by(
            account_id=account_id, deleted=False).order_by('date_added'))
        return dict(video=dict(items=items, total=len(items)))


def video_view(f):
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
        return video_item(video)

    @video_view
    @commit_on_success
    def patch(self, video):
        form = VideoForm(csrf_enabled=False)
        if not form.validate():
            print form.data
            return dict(form_errors=form.errors), 400

        form.populate_obj(video)

        return None, 204

    @video_view
    @commit_on_success
    def delete(self, video):
        video.deleted = True
        return None, 204


@api_resource('/video/<string:video_id>/tag')
class VideoTagListApi(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('id', type=int)

    @video_view
    @commit_on_success
    def post(self, video):
        args = self.tag_parser.parse_args()
        tag_id = args.get('id')

        if not tag_id:
            abort(404)

        tag = VideoTag.query.filter(
            VideoTag.id == tag_id,
            VideoTag.account_id == current_user.account.id
        ).first_or_404()

        video.tags.append(
            VideoTagVideo(video_id=video.id, tag_id=tag.id)
        )


@api_resource('/video/<string:video_id>/tag/<int:tag_id>')
class VideoTagApi(Resource):

    @commit_on_success
    def delete(self, video_id, tag_id):
        """ Delete a relation between a video and a tag """

        try:
            tag_relation = VideoTagVideo.query.filter(
                VideoTagVideo.tag_id == tag_id
            ).join(
                Video,
                (Video.id == VideoTagVideo.video_id) &
                (Video.account_id == current_user.account.id)
            ).one()
        except NoResultFound:
            pass
        else:
            db.session.delete(tag_relation)

        return 204


@api_resource('/tag/<int:tag_id>')
class TagApi(Resource):

    @commit_on_success
    def delete(self, tag_id):
        try:
            tag = VideoTag.query.filter(
                VideoTag.id == tag_id,
                VideoTag.account_id == current_user.account.id).one()
        except NoResultFound:
            pass
        else:
            db.session.delete(tag)

        """
        dollyuser = DollyUser(
            current_user.account.dolly_user,
            current_user.account.dolly_token)
        dollyuser.delete(tag_id)
        """

        return 201


@api_resource('/account/<int:account_id>/tags')
class AccountTagListApi(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('label', type=str)

    @property
    def all_tags(self):
        tags = VideoTag.query.filter(VideoTag.account_id == current_user.account.id)

        return dict(
            tags=dict(
                items=[dict(id=tag.id, label=tag.label) for tag in tags],
                total=tags.count()))

    @commit_on_success
    def _add_tag(self, label):
        current_user.account.tags.append(
            VideoTag(label=label)
        )

    def get(self, account_id):
        if not account_id == current_user.account.id:
            abort(403)

        return self.all_tags

    def post(self, account_id):
        if not account_id == current_user.account.id:
            abort(403)

        args = self.tag_parser.parse_args()
        label = args.get('label', '').strip()

        if not label:
            return dict(error='empty label'), 400

        if VideoTag.query.filter(VideoTag.account_id == account_id, VideoTag.label == label).count():
            return dict(error='tag already exists'), 400

        self._add_tag(label)
        return self.all_tags, 201
