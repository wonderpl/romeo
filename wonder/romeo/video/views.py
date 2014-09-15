from pkg_resources import resource_string
from functools import wraps, partial
from sqlalchemy import func
from flask import Blueprint, request, Response, render_template, url_for, json
from flask.ext.login import current_user
from flask.ext.restful import abort
from flask.ext.restful.reqparse import RequestParser
from wonder.romeo import db
from wonder.romeo.core.dolly import get_categories, get_video_embed_content
from wonder.romeo.core.rest import Resource, api_resource, support_bulk_save
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import s3connection, video_bucket, media_bucket
from wonder.romeo.core.ooyala import ooyala_request, get_video_data
from wonder.romeo.core.util import gravatar_url, get_random_filename
from wonder.romeo.account.views import (
    dolly_account_view, user_view, get_dollyuser, account_item, SuggestionResource)
from wonder.romeo.account.models import AccountUser
from .models import (
    Video, VideoTag, VideoTagVideo, VideoThumbnail,
    VideoPlayerParameter, VideoComment, VideoCollaborator)
from .forms import (
    VideoTagForm, VideoForm, VideoCommentForm, VideoCollaboratorForm,
    send_comment_notifications, send_published_email)
from .commands import update_video_status


videoapp = Blueprint('video', __name__)


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
    else:
        update_video_status(video, data)

    return '', 204


@videoapp.route('/embed/<videoid>/')
@videoapp.route('/embed/<videoid>')
def video_embed(videoid):
    response = Response(get_video_embed_content(videoid))
    response.cache_control.no_cache = True
    return response


@api_resource('/categories')
class CategoriesResource(Resource):
    def get(self):
        return dict(category=dict(items=get_categories()))


@api_resource('/search_keywords')
class SearchKeywordsResource(SuggestionResource):
    label = 'search_keyword'
    default_terms = resource_string(__name__, 'search_keywords.txt').split('\n')


@api_resource('/account/<int:account_id>/tags')
class AccountTagsResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('label', type=str)
    tag_parser.add_argument('description', type=str)

    @dolly_account_view()
    def get(self, account, dollyuser):
        tags = VideoTag.query.filter_by(
            account_id=account.id
        ).outerjoin(
            VideoTagVideo, (VideoTagVideo.tag_id == VideoTag.id)
        ).outerjoin(
            Video, (Video.id == VideoTagVideo.video_id) & (Video.deleted == False)
        ).group_by(
            VideoTag.id
        ).with_entities(
            VideoTag,
            func.count(Video.id)
        )
        items = [_tag_item(*t) for t in tags]
        return dict(tag=dict(items=items, total=len(items)))

    @dolly_account_view()
    @commit_on_success
    def post(self, account, dollyuser):
        form = VideoTagForm(account_id=account.id)
        if not form.validate():
            return dict(error='invalid_request', form_errors=form.errors), 400

        tag = form.save()

        if form.public.data:
            channeldata = dict(title=tag.label, description=tag.description)
            try:
                tag.dolly_channel = dollyuser.create_channel(channeldata)['id']
            except Exception as e:
                if hasattr(e, 'response'):
                    return e.response.json(), e.response.status_code
                else:
                    raise

        return dict(id=tag.id, href=tag.href), 201, {'Location': tag.href}


def _tag_item(tag, video_count=None):
    data = dict((p, getattr(tag, p)) for p in ('id', 'href', 'label', 'description', 'public'))
    if video_count:
        data['video_count'] = video_count
    return data


def tag_view(f):
    @wraps(f)
    def decorator(self, tag_id):
        tag = VideoTag.query.filter_by(id=tag_id).first_or_404()
        if tag.account_id == current_user.account_id:
            return f(self, tag)
        else:
            abort(403, error='access_denied', message='"content_owner" account required')
    return decorator


@api_resource('/tag/<int:tag_id>')
class TagResource(Resource):

    @tag_view
    def get(self, tag):
        return _tag_item(tag)

    @commit_on_success
    @tag_view
    def put(self, tag):
        form = VideoTagForm(obj=tag)
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
class UploadArgsResource(Resource):

    @dolly_account_view()
    def get(self, account, dollyuser):
        filetype = request.args.get('type')
        if filetype in ('profile_cover', 'avatar'):
            get_filepath = partial(current_user.get_image_filepath, imagetype=filetype)
            bucket = media_bucket.name
        else:
            get_filepath = Video.get_video_filepath
            bucket = video_bucket.name
        key = get_filepath(account.id, get_random_filename())
        return s3connection.build_post_form_args(bucket, key, 3600, storage_class=None)


@api_resource('/account/<int:account_id>/videos')
class AccountVideosResource(Resource):

    @dolly_account_view()
    def get(self, account, dollyuser):
        query = Video.query.filter_by(
            account_id=account.id, deleted=False).order_by('date_added')
        items = map(_video_item, query.all())
        return dict(video=dict(items=items, total=len(items)))

    @commit_on_success
    @dolly_account_view()
    def post(self, account, dollyuser):
        if account.account_type != 'content_owner':
            abort(403, error='access_denied')

        # _copy_video is the documented property but wtforms doesn't like the leading "_"
        if isinstance(request.json, dict):
            request.json.setdefault('copy_video', request.json.get('_copy_video', 0))

        form = VideoForm(account_id=account.id)

        # category can be null
        if not form.category.data:
            delattr(form, 'category')

        if form.validate():
            video = form.save()
            return dict(id=video.id, href=video.href, status=video.status), 201,\
                {'Location': video.href}
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400


@api_resource('/user/<int:user_id>/collaborator_videos')
class UserCollaboratorVideosResource(Resource):

    @user_view()
    def get(self, user):
        query = Video.query.filter_by(deleted=False).join(
            VideoCollaborator,
            VideoCollaborator.video_id == Video.id
        ).join(
            AccountUser,
            (func.lower(AccountUser.username) == func.lower(VideoCollaborator.email)) &
            (AccountUser.id == user.id)
        ).order_by(Video.date_added)
        items = map(_video_item, query.all())
        return dict(video=dict(items=items, total=len(items)))


@api_resource('/v/<int:video_id>')
class PublicVideoResource(Resource):

    # disable login_required
    decorators = []

    def get(self, video_id):
        """Public service that returns video data in the format expected by dolly embed."""
        video = Video.query.filter_by(deleted=False, id=video_id).first_or_404()
        return video.get_dolly_data()


def _video_item(video, full=False, with_account=False, public=False):
    fields = ('id', 'status', 'date_added', 'date_updated', 'title')
    if full:
        fields += ('strapline', 'description', 'category', 'link_url', 'link_title', 'duration')
    data = {f: getattr(video, f) for f in fields}

    # Convert dates to strings:
    for f, v in data.items():
        if hasattr(v, 'isoformat'):
            data[f] = v.isoformat()

    if full:
        data['hosted_url'] = video.hosted_url
        data['search_keywords'] = video.search_keywords
        data['collaborators'] = dict(href=url_for(
            'api.videocollaborators', video_id=video.id) + '?public' if public else '')
        data['player_url'] = video.player_url
        data['player_logo_url'] = video.get_player_logo_url()
        thumbnails = sorted(video.thumbnails, key=lambda t: t.width, reverse=True)
        data['thumbnail_url'] = thumbnails[0].url if thumbnails else None
        data['thumbnails'] = dict(
            items=[
                {f: getattr(thumbnail, f) for f in ('url', 'width', 'height')}
                for thumbnail in thumbnails
            ]
        )
    else:
        data['thumbnail_url'] = video.thumbnail
        data['thumbnails'] = dict(
            items=[
                {'url': video.thumbnail, 'width': 0, 'height': 0}
            ] if video.thumbnail else []
        )

    if public:
        data['href'] = video.public_href
    else:
        data['href'] = video.href
        data['tags'] = dict(
            href=url_for('api.videotags', video_id=video.id),
            items=map(_tag_item, video.tags),
        )

    if with_account:
        data['account'] = account_item(video.account, get_dollyuser(video.account),
                                       full=False, public=public)

    return data


def video_view(with_collaborator_permission=None, public=False):
    def _valid_collaborator_permissions(user, video_id):
        return (with_collaborator_permission and
                user.has_collaborator_permission(video_id, with_collaborator_permission))

    def decorator(f):
        @wraps(f)
        def wrapper(self, video_id, *args, **kwargs):
            video = Video.query.filter_by(deleted=False, id=video_id).first_or_404()
            if (public is True or
                    (public is None and 'public' in request.args) or
                    _valid_collaborator_permissions(current_user, video_id) or
                    video.account_id == current_user.account_id):
                return f(self, video, *args, **kwargs)
            else:
                abort(403, error='access_denied')
        return wrapper
    return decorator


@api_resource('/video/<int:video_id>')
class VideoResource(Resource):

    @video_view(with_collaborator_permission=True, public=None)
    def get(self, video):
        return _video_item(
            video, full=True, with_account=True, public='public' in request.args)

    @commit_on_success
    @video_view()
    def patch(self, video):
        form = VideoForm(obj=video)
        # Exclude form fields that weren't specified in the request
        for field in form.data:
            if field not in (request.json or request.form or request.files):
                delattr(form, field)

        if form.validate():
            form.save()
            return _video_item(video, full=True), 200
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400

    @commit_on_success
    @video_view()
    def delete(self, video):
        # remove the video from published collections
        for tag in video.tags:
            if tag.dolly_channel:
                get_dollyuser(current_user.account).remove_video(
                    tag.dolly_channel, dict(source_id=video.external_id))

        video.deleted = True
        return None, 204


@api_resource('/video/<int:video_id>/preview_images')
class VideoPreviewImagesResource(Resource):

    @video_view()
    def get(self, video):
        items = ooyala_request('assets', video.external_id, 'generated_preview_images')
        return dict(image=dict(items=items))


@api_resource('/video/<int:video_id>/primary_preview_image')
class VideoPrimaryPreviewImageResource(Resource):

    preview_image_parser = RequestParser()
    preview_image_parser.add_argument('time', type=int, required=True)

    @commit_on_success
    @video_view()
    def put(self, video):
        args = self.preview_image_parser.parse_args()
        thumbnails = ooyala_request(
            'assets', video.external_id, 'primary_preview_image',
            data=json.dumps(dict(type='generated', time=args['time'])), method='put')
        video.thumbnails = [
            VideoThumbnail(url=t['url'], width=t['width'], height=t['height'])
            for t in thumbnails['sizes']
        ]
        return dict(image=dict(items=thumbnails['sizes']))


@api_resource('/video/<int:video_id>/download_url')
class VideoDownloadUrlResource(Resource):

    @video_view(with_collaborator_permission='download')
    def get(self, video):
        expires = 600
        headers = {
            'response-content-type': 'application/octet-stream',
            'response-content-disposition': 'attachment; filename="%s"' % video.download_name
        }
        key = video_bucket.get_key(video.filepath)
        url = key.generate_url(expires, force_http=True, response_headers=headers)
        return dict(url=url, expires=expires), 302, {'Location': url}


@api_resource('/video/<int:video_id>/share_url')
class VideoShareUrlResource(Resource):

    @video_view(public=True)
    def get(self, video):
        if not video.dolly_instance:
            # Not published
            return dict(error='invalid_request'), 400

        url = get_dollyuser(video.account).get_share_link(video.dolly_instance)
        if request.args.get('target') in ('facebook', 'twitter'):
            url += '?utm_source=' + request.args['target']

        return dict(url=url), 302, {'Location': url}


def _source_content_url(assetid):
    streams = ooyala_request('assets', assetid, 'streams')
    return next(s['url'] for s in streams if
                s['stream_type'] == 'single' and
                s['muxing_format'] == 'MP4' and
                s['average_video_bitrate'] > 1200)


@api_resource('/video/<int:video_id>/embed_code')
class VideoEmbedCodeResource(Resource):

    @video_view(public=True)
    def get(self, video):
        if not video.dolly_instance:
            # Not published
            return dict(error='invalid_request'), 400

        dimensions = dict(width='100%', height='100%')
        for key in dimensions.keys():
            if request.args.get(key, '').rstrip('%').isalnum():
                dimensions[key] = request.args[key]

        if request.args.get('style') == 'seo':
            template = 'video/embed_seo.html'
            # One of content_url or flash_embed is needed for Google to generate
            # search result thumbnails for a videos.
            # content_url = _source_content_url(video.external_id)
        else:
            template = 'video/embed_simple.html'

        html = render_template(template, video=video, embed_url=video.player_url, **dimensions)
        return dict(html=html)


@api_resource('/video/<int:video_id>/player_parameters')
class VideoPlayerParametersResource(Resource):

    @video_view(with_collaborator_permission=True)
    def get(self, video):
        return video.player_parameters

    @commit_on_success
    @video_view()
    def put(self, video):
        try:
            params = dict(request.json or request.form).items()
        except ValueError:
            return dict(error='invalid_request'), 400
        VideoPlayerParameter.query.filter_by(video_id=video.id).delete()
        for name, value in params:
            try:
                video._player_parameters.append(
                    VideoPlayerParameter(name=str(name), value=str(value))
                )
            except IOError:
                return dict(error='invalid_request'), 400
        return None, 204


@api_resource('/video/<int:video_id>/tags')
class VideoTagsResource(Resource):

    tag_parser = RequestParser()
    tag_parser.add_argument('id', type=int)

    @video_view()
    def get(self, video):
        return dict(tag=dict(items=map(_tag_item, video.tags)))

    @commit_on_success
    @video_view()
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
            instanceid = get_dollyuser(current_user.account).\
                publish_video(tag.dolly_channel, videodata)
            if video.status == 'ready':
                video.status = 'published'
                video.dolly_instance = instanceid
                if instanceid:
                    send_published_email(video.id, tag.dolly_channel, instanceid)

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


def collaborator_record(collaborator_id):
    collaborator = VideoCollaborator.query.get(collaborator_id)
    result = _collaborator_item(collaborator)
    result['video'] = dict(href=url_for('api.video', video_id=collaborator.video_id))
    return result


def _collaborator_user_item(user, public=False):
    return dict(
        id=user.id,
        href=user.public_href if public else user.href,
        title=user.title,
    )


def _collaborator_item(collaborator, user=None, public=False):
    data = dict(
        display_name=user and user.display_name or collaborator.name,
        avatar=user and user.avatar or gravatar_url(collaborator.email),
        user=user and _collaborator_user_item(user, public=public),
    )
    if not public:
        data.update(
            id=collaborator.id,
            href=collaborator.href,
            permissions=filter(None, [f if getattr(collaborator, f) else None
                                      for f in dir(collaborator) if f.startswith('can_')]),
            # email=collaborator.email,
        )
    return data


def collaborator_users(account_id=None, user_id=None, video_id=None):
    assert account_id or user_id or video_id
    if user_id:
        # Select all users from accounts than own the videos this user is
        # collaborating on: user -> collab -> video -> account -> user.
        username = AccountUser.query.filter_by(id=user_id).value('username')
        query = VideoCollaborator.query.join(Video).join(
            AccountUser,
            (AccountUser.account_id == Video.account_id)
        ).filter(
            func.lower(username) == func.lower(VideoCollaborator.email)
        )
    else:
        if account_id:
            # Select collaborators on all videos owned by this account:
            # account -> video -> collab (-> user)
            query = VideoCollaborator.query.join(
                Video,
                (Video.id == VideoCollaborator.video_id) &
                (Video.account_id == account_id)
            )
        else:
            # Select collaborators for a specific video:
            # video -> collab (-> user)
            query = VideoCollaborator.query.filter_by(video_id=video_id)

        query = query.outerjoin(
            AccountUser,
            func.lower(AccountUser.username) == func.lower(VideoCollaborator.email)
        )

    return query.with_entities(VideoCollaborator, AccountUser)


@api_resource('/video/<int:video_id>/collaborators')
class VideoCollaboratorsResource(Resource):

    @video_view(with_collaborator_permission=True, public=None)
    def get(self, video):
        public = 'public' in request.args
        items = [_collaborator_item(c, u, public=public)
                 for c, u in collaborator_users(video_id=video.id)]
        items.extend(
            dict(
                display_name=user.name,
                avatar=user.avatar or gravatar_url(user.email),
                user=_collaborator_user_item(user, public=public),
                owner=True,
            )
            for user in video.account.users
        )
        return dict(collaborator=dict(items=items, total=len(items)))

    @commit_on_success
    @video_view()
    @support_bulk_save
    def post(self, video):
        form = VideoCollaboratorForm(video_id=video.id)
        if not form.validate():
            return dict(error='invalid_request', form_errors=form.errors), 400

        form.obj = VideoCollaborator.query.filter_by(
            video_id=video.id, email=form.email.data).first()
        form.save()
        return None, 204


@api_resource('/video/<int:video_id>/collaborators/<int:collaborator_id>')
class VideoCollaboratorResource(Resource):

    @video_view(with_collaborator_permission=True)
    def get(self, video, collaborator_id):
        collaborator = VideoCollaborator.query.get_or_404(collaborator_id)
        return _collaborator_item(collaborator)


def video_comment_view(f):
    @wraps(f)
    def decorator(self, video, *args, **kwargs):
        collaborator = current_user.get_collaborator(video.id)
        if collaborator:
            user_type, user_id = 'collaborator', collaborator.id
        else:
            user_type, user_id = 'account_user', current_user.id
        return f(self, video, user_type, user_id, *args, **kwargs)
    return video_view(with_collaborator_permission='comment')(decorator)


def _comment_item(comment, username, email, avatar):
    return dict(
        id=comment.id,
        href=comment.href,
        comment=comment.comment,
        timestamp=comment.timestamp,
        datetime=comment.date_added.isoformat(),
        display_name=username or email,
        avatar=avatar or gravatar_url(email),
        resolved=comment.resolved,
    )


@api_resource('/video/<int:video_id>/comments')
class VideoCommentsResource(Resource):

    @video_comment_view
    def get(self, video, user_type, user_id):
        items = [_comment_item(*c) for c in VideoComment.comments_for_video(video.id)]
        return dict(comment=dict(items=items, total=len(items)))

    @commit_on_success
    @video_comment_view
    def post(self, video, user_type, user_id):
        form = VideoCommentForm(video.id, user_type, user_id)
        if not form.validate():
            return dict(error='invalid_request', form_errors=form.errors), 400

        comment = form.save()

        return dict(id=comment.id, href=comment.href), 201, {'Location': comment.href}


@api_resource('/video/<int:video_id>/comments/notification')
class VideoCommentsNotificationResource(Resource):

    @video_comment_view
    def post(self, video, user_type, user_id):
        send_comment_notifications(video.id, user_type, user_id)
        return None, 204


@api_resource('/video/<int:video_id>/comments/<int:comment_id>')
class VideoCommentResource(Resource):

    comment_parser = RequestParser()
    comment_parser.add_argument('resolved', type=bool)

    @video_comment_view
    def get(self, video, user_type, user_id, comment_id):
        try:
            comment = VideoComment.comments_for_video(video.id, [comment_id])[0]
        except IndexError:
            abort(404)
        else:
            return _comment_item(*comment)

    @commit_on_success
    @video_comment_view
    def patch(self, video, user_type, user_id, comment_id):
        if user_type != 'account_user':
            return dict(error='forbidden'), 403
        comment = VideoComment.query.filter_by(id=comment_id).first_or_404()
        args = self.comment_parser.parse_args()
        if args.resolved is not None:
            comment.resolved = args.resolved
        return _comment_item(*VideoComment.comments_for_video(video.id, [comment_id])[0])
