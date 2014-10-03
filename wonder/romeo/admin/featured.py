from wonder.romeo.featured import models
from . import AdminModelView, admin_view


@admin_view()
class ArticleAdminModelView(AdminModelView):
    model = models.ArticlesFeatured

    column_list = 'title', 'article_type', 'published_date'
    column_filters = 'title',
    column_searchable_list = 'title', 'summary', 'author'

    # form_excluded_columns = 'author_id'
