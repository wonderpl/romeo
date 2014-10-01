from flask import current_app, Blueprint, render_template
from flask.ext.login import current_user
from wonder.romeo.core.rest import api_resource, Resource, cache_control
from wonder.romeo.core.util import COUNTRY_CODES
from wonder.romeo.account.views import login_items

rootapp = Blueprint('root', __name__)


@rootapp.route('/')
@cache_control(max_age=3600, view=True)
def home():
    return render_template('root/index.html')


@rootapp.route('/app')
def app():
    settings = dict(
        google_analytics_account_id=current_app.config['GOOGLE_ANALYTICS_ACCOUNT'],
        facebook_app_id=current_app.config['FACEBOOK_APP_ID'],
    )
    return render_template('root/app.html', settings=settings)


@rootapp.route('/status/')
def status():
    return 'OK', 200, [('Content-Type', 'text/plain')]


@rootapp.app_errorhandler(404)
def not_found(error):
    return _handle_error(404, error)


@rootapp.app_errorhandler(500)
def server_error(error):
    return _handle_error(500, error)


def _handle_error(code, error, template=None):
    message = str(getattr(error, 'message', error))
    return render_template(template or 'root/error.html', message=message, code=code), code


@api_resource(None)
class BaseResource(Resource):

    decorators = []

    def get(self):
        if current_user.is_authenticated():
            status = dict(auth_status='logged_in')
            if current_user.id and current_user.account_id:
                status.update(login_items(current_user))
        else:
            status = dict(auth_status='logged_out')
        return status


@api_resource('/locations')
class LocationsResource(Resource):

    decorators = []

    @cache_control(max_age=86400)
    def get(self):
        items = [dict(code=c, name=n) for c, n in COUNTRY_CODES if c not in ('A1', 'A2', 'O1', 'EU')]
        return dict(country=dict(items=items, total=len(items)))
