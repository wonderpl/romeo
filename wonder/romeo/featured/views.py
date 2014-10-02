from flask import request, jsonify
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.account.views import _user_item
from .models import AccountUserFeatured, ArticlesFeatured


@api_resource('/featured')
class FeaturedResource(Resource):
    def get(self):
        featuredUsers = AccountUserFeatured().query.limit(4)
        users = []
        for row in featuredUsers:
            users.append(_user_item(row.account_user, True))

        featuredArticles = ArticlesFeatured().query.limit(6)
        articles = []
        for row in featuredArticles:
            article = _article_item(row)
            articles.append(article)

        return dict(published_date='Mon, 29 Sep 2014 10:17:25 +0000', user=dict(items=users, total=len(users)), article=dict(items=articles, total=len(articles)))


def _article_item(article):
    fields = ('id', 'author', 'published_date',
              'title', 'summary', 'article_url',
              'article_type', 'content', 'featured_image', 'article_type')
    data = {f: getattr(article, f) for f in fields}

    # Convert dates to strings:
    for f, v in data.items():
        if hasattr(v, 'isoformat'):
            data[f] = v.isoformat()

    return data
