from functools import wraps
from flask import Blueprint, current_app, request, render_template, abort
from flask.ext.login import current_user, login_required
from flask.ext.restful.reqparse import RequestParser
from sqlalchemy.orm.exc import NoResultFound
from wonder.romeo import db
from wonder.romeo.core.dolly import get_categories, get_video_embed_content
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import s3connection, video_bucket
from wonder.romeo.core.ooyala import get_video_data
from wonder.romeo.account.views import dolly_account_view, get_dollyuser
from .models import Video, VideoTag, VideoTagVideo, VideoThumbnail
from .forms import VideoForm


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


def format_tags(tags, total=None):
    return dict(
        items=[dict(id=tag.id, label=tag.label, description=tag.description) for tag in tags],
        total=total or tags.count())


def video_item(video):
    video_fields = {
        'id': lambda x: x,
        'href': lambda x: x,
        'status': lambda x: x,
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

    #data['tags'] = format_tags(video.tags, total=len(video.tags))

    return data


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
        items = map(video_item, Video.query.filter_by(
            account_id=account.id, deleted=False).order_by('date_added'))
        return dict(video=dict(items=items, total=len(items)))

    @dolly_account_view
    @commit_on_success
    def post(self, account, dollyuser):
        form = VideoForm(csrf_enabled=False)
        if not form.category.data:
            delattr(form, 'category')

        if form.validate():
            video = form.save(account_id=current_user.account_id)
            return dict(id=video.id, href=video.href, status=video.status), 201,\
                {'Location': video.href}
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400


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
        return video_item(video)

    @video_view
    @commit_on_success
    def patch(self, video):
        form = VideoForm(csrf_enabled=False, obj=video)
        # Exclude form fields that weren't specified in the request
        for field in form.data:
            if field not in (request.json or request.form):
                delattr(form, field)

        if form.validate():
            form.save()
            return dict(status=video.status), 200
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400

    @video_view
    @commit_on_success
    def delete(self, video):
        video.deleted = True
        return None, 204


@api_resource('/video/<string:video_id>/tags')
class VideoTagsResource(Resource):

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
            VideoTag.account_id == current_user.account_id
        ).first_or_404()

        video.tags.append(
            VideoTagVideo(video_id=video.id, tag_id=tag.id)
        )


@api_resource('/video/<string:video_id>/tag/<int:tag_id>')
class VideoTagResource(Resource):

    @commit_on_success
    def delete(self, video_id, tag_id):
        """ Delete a relation between a video and a tag """

        try:
            tag_relation = VideoTagVideo.query.filter(
                VideoTagVideo.tag_id == tag_id
            ).join(
                Video,
                (Video.id == VideoTagVideo.video_id) &
                (Video.account_id == current_user.account_id)
            ).one()
        except NoResultFound:
            pass
        else:
            db.session.delete(tag_relation)

        return 204


def _add_or_update_dolly_channel(tagdata, channelid=None):
    dollyuser = get_dollyuser(current_user.account)
    dollymethod = 'POST'
    dollymethod_map = {'POST': dollyuser.create_channel,
                       'PUT': dollyuser.update_channel}

    for field in ['label', 'description']:
        tagdata.setdefault(field, '')

    # On dolly title == label so we'll convert
    new_dict = dict(title=tagdata['label'],
                    description=tagdata['description'])

    args = [new_dict]

    if channelid:
        dollymethod = 'PUT'
        args.append(channelid)

    return dollymethod_map[dollymethod](*args)


@commit_on_success
def add_dolly_tag(**tagdata):
    # Create a new tag
    tag = VideoTag(**tagdata)
    current_user.account.tags.append(tag)

    # Create corresponding channel on dolly
    response = _add_or_update_dolly_channel(tagdata)

    # Update tag with channel id
    tag.dolly_channel = response['id']

    return tag


@commit_on_success
def update_dolly_tag(tag_id, **tagdata):
    # Fetch existing tag
    tag = VideoTag.query.get(tag_id)

    if not tag.account_id == current_user.account_id:
        abort(403)

    # Update tag
    for key, value in tagdata:
        setattr(tag, key, value)

    # Update corresponding channel on dolly
    _add_or_update_dolly_channel(tagdata, channelid=tag.dolly_channel)

    return tag


@api_resource('/tag/<int:tag_id>')
class TagResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('label', type=str)
    tag_parser.add_argument('description', type=str)

    @commit_on_success
    def put(self, tag_id):
        args = self.tag_parser.parse_args()

        try:
            tag = update_dolly_tag(tag_id, **args)
        except Exception as e:
            if hasattr(e, 'response'):
                return e.response.json(), e.response.status_code
            else:
                raise
        else:
            return dict(id=tag.id, href=tag.href)

    @commit_on_success
    def delete(self, tag_id):
        tag = VideoTag.query.filter_by(
            id=tag_id, account_id=current_user.account_id).first_or_404()
        get_dollyuser(current_user.account).delete_channel(tag.dolly_channel)
        db.session.delete(tag)
        return None, 204


@api_resource('/account/<int:account_id>/tags')
class AccountTagsResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('label', type=str)
    tag_parser.add_argument('description', type=str)

    @property
    def all_tags(self):
        tags = VideoTag.query.filter_by(account_id=current_user.account_id)
        return dict(tags=format_tags(tags))

    def get(self, account_id):
        if not account_id == current_user.account_id:
            abort(403)

        return self.all_tags

    def post(self, account_id):
        if not account_id == current_user.account_id:
            abort(403)

        args = self.tag_parser.parse_args()
        label = args.get('label') or ''
        description = args.get('description') or ''

        if VideoTag.query.filter_by(account_id=account_id, label=label.strip()).count():
            return dict(error='tag already exists'), 400

        try:
            tag = add_dolly_tag(label=label, description=description)
        except Exception as e:
            if hasattr(e, 'response'):
                return e.response.json(), e.response.status_code
            else:
                raise
        else:
            return dict(id=tag.id, href=tag.href), 201, {'Location': tag.href}


@api_resource('/categories')
class CategoriesResource(Resource):
    def get(self):
        return dict(category=dict(items=get_categories()))
