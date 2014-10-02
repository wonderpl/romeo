from flask import request, redirect, url_for
from wonder.romeo import db
from wonder.romeo.account.forms import RegistrationForm
from wonder.romeo.featured import models
from . import AdminView, AdminModelView, admin_view, expose


@admin_view()
class ArticleAdminModelView(AdminModelView):
    model = models.ArticlesFeatured

    column_list = 'title', 'article_type', 'published_date'
    column_filters = 'title',
    column_searchable_list = 'title', 'summary', 'author'

    # form_excluded_columns = 'author_id'