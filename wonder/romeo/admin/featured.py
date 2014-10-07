from wonder.romeo.featured import models
from . import AdminModelView, admin_view


@admin_view()
class ArticleAdminModelView(AdminModelView):
    model = models.FeaturedArticle

    column_list = 'title', 'article_type', 'published_date'
    column_filters = 'title',
    column_searchable_list = 'title', 'summary', 'author'


@admin_view()
class UserAdminModelView(AdminModelView):
    model = models.FeaturedUser
    can_delete = True

    column_list = 'account_user',
