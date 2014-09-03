from flask.ext.restful.reqparse import RequestParser
from wonder.romeo.core.rest import Resource, api_resource, cache_control
from wonder.romeo.core.util import COUNTRY_CODES
from wonder.romeo.video.models import Video
from wonder.romeo.account.models import Account, AccountUser


@api_resource('/search')
class SearchResource(Resource):

    query_parser = RequestParser()
    query_parser.add_argument('q', type=str, required=True)
    query_parser.add_argument('location', type=str, choices=zip(*COUNTRY_CODES)[0])
    query_parser.add_argument('src', type=str, action='append',
                              choices=['video', 'content_owner', 'collaborator'],
                              default=['video'])
    query_parser.add_argument('size', type=int, choices=range(50), default=10)
    query_parser.add_argument('start', type=int, default=0)

    @cache_control(max_age=3600)
    def get(self):
        args = self.query_parser.parse_args()
        result = {}

        for src in args.src:
            search = getattr(self, '_search_%s' % src)
            result[src] = search(args.q, args.location, args.size, args.start)

        return result

    def _db_match(self, dbquery, size, start, query, *args):
        match = lambda x: x.ilike('%' + query + '%')
        dbquery = dbquery.filter(*[match(a) for a in args])
        total = dbquery.count()
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
        videos = Video.query.filter_by(deleted=False, status='published')
        videos, total = self._db_match(videos, size, start, query, Video.title)
        items = [self._video_item(v) for v in videos]
        return dict(items=items, total=total)

    def _user_item(self, user):
        return dict(
            id=user.id,
            href=user.public_href,
            display_name=user.display_name,
            description=user.description,
            avatar=user.avatar,
        )

    def _search_content_owner(self, query, location, size, start=0):
        users = AccountUser.query.filter_by(active=True).join(
            Account, (Account.id == AccountUser.account_id) & (Account.account_type == 'content_owner'))
        users, total = self._db_match(users, size, start, query, AccountUser.display_name)
        items = [self._user_item(u) for u in users]
        return dict(items=items, total=total)

    def _search_collaborator(self, query, location, size, start=0):
        users = AccountUser.query.filter_by(active=True, contactable=True).join(
            Account, (Account.id == AccountUser.account_id) & (Account.account_type == 'collaborator'))
        users, total = self._db_match(users, size, start, query, AccountUser.display_name)
        items = [self._user_item(u) for u in users]
        return dict(items=items, total=total)
