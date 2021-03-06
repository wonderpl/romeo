import re
from sqlalchemy import func
from flask.ext.restful.reqparse import RequestParser
from wonder.romeo.core.rest import Resource, api_resource, cache_control
from wonder.romeo.core.util import COUNTRY_CODES
from wonder.romeo.video.models import Video, VideoLocaleMeta, VideoCollaborator
from wonder.romeo.account.models import Account, AccountUser
from . import models    # NOQA: Ensure triggers get loaded


VIDEO_OWNER_USER_QUERY_RE = re.compile('owner_user:(\d+)')
VIDEO_COLLABORATOR_QUERY_RE = re.compile('collaborator:(\d+)')


@api_resource('/search')
class SearchResource(Resource):

    query_parser = RequestParser()
    query_parser.add_argument('q', type=str, required=True)
    query_parser.add_argument('location', type=str, choices=zip(*COUNTRY_CODES)[0])
    query_parser.add_argument('src', type=str, action='append',
                              choices=['video', 'content_owner', 'collaborator'],
                              default=['video'])
    query_parser.add_argument('size', type=int, choices=map(str, range(50)), default=10)
    query_parser.add_argument('start', type=int, default=0)

    @cache_control(max_age=3600)
    def get(self):
        args = self.query_parser.parse_args()
        result = {}

        for src in args.src:
            search = getattr(self, '_search_%s' % src)
            result[src] = search(args.q.strip(), args.location, args.size, args.start)

        return result

    def _db_match(self, dbquery, size, start, query, search_vector):
        if query:
            query = re.sub('\W+', ' ', query).strip().replace(' ', ' & ')
            dbquery = dbquery.filter(search_vector.match(query))
        total = dbquery.count()
        if query:
            dbquery = dbquery.order_by(
                func.ts_rank(search_vector, func.to_tsquery(query)).desc())
        dbquery = dbquery.offset(start).limit(size)
        return dbquery, total

    def _video_item(self, video):
        return dict(
            id=video.id,
            href=video.public_href,
            title=video.title,
            description=video.description,
            thumbnail_url=video.thumbnail,
            duration=video.duration,
        )

    def _search_video(self, query, location, size, start=0):
        videos = Video.query.filter_by(deleted=False, status='published').outerjoin(
            VideoLocaleMeta,
            (VideoLocaleMeta.video_id == Video.id) & (VideoLocaleMeta.locale == ''))

        owner_filter = VIDEO_OWNER_USER_QUERY_RE.match(query.strip())
        if owner_filter:
            videos = videos.join(
                AccountUser,
                (AccountUser.account_id == Video.account_id) &
                (AccountUser.id == owner_filter.group(1))
            ).distinct()
            query = ''

        collab_filter = VIDEO_COLLABORATOR_QUERY_RE.match(query.strip())
        if collab_filter:
            videos = videos.join(
                VideoCollaborator,
                VideoCollaborator.video_id == Video.id
            ).join(
                AccountUser,
                (func.lower(AccountUser.username) == func.lower(VideoCollaborator.email)) &
                (AccountUser.id == collab_filter.group(1))
            ).distinct()
            query = ''

        videos, total = self._db_match(videos, size, start, query, Video.search_vector)
        items = [self._video_item(v) for v in videos]
        return dict(items=items, total=total)

    def _user_item(self, user):
        return dict(
            id=user.id,
            href=user.public_href,
            display_name=user.display_name,
            description=user.description,
            title=user.title,
            avatar=user.avatar,
        )

    def _search_user(self, query, account_type, location, size, start=0):
        users = AccountUser.query.filter_by(active=True).join(
            Account,
            (Account.id == AccountUser.account_id) &
            (Account.account_type == account_type))
        if location:
            users = users.filter(AccountUser.location == location)
        users, total = self._db_match(users, size, start, query, AccountUser.search_vector)
        items = [self._user_item(u) for u in users]
        return dict(items=items, total=total)

    def _search_content_owner(self, query, location, size, start=0):
        return self._search_user(query, 'content_owner', location, size, start)

    def _search_collaborator(self, query, location, size, start=0):
        return self._search_user(query, 'collaborator', location, size, start)
