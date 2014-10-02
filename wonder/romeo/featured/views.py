from flask import request, jsonify
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.account.views import _user_item
from .models import AccountUserFeatured


@api_resource('/featured')
class FeaturedResource(Resource):
    def get(self):
        featuredUsers = AccountUserFeatured().query.limit(4)
        users = []
        for row in featuredUsers:
            users.append(_user_item(row.account_user, True))

        articles = [
            {
                'article_url': 'http://blog.wonderpl.com/2014/10/01/002-find-your-next-crew-member',
                'title': 'Find your next crew',
                "category": [
                    "Latest from the Editor"
                ],
                "author": "Channel No5",
                "summary": "article summary",
                "content": "article content",
                "published_date": "Fri, 15 Aug 2014 10:17:25 +0000",
                "featured_image": "http://path/to/article/featured_image.jpg"
            }
        ]
        return dict(published_date='Mon, 29 Sep 2014 10:17:25 +0000', user=dict(items=users, total=2), article=dict(items=articles, total=len(articles)))

