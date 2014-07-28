from flask import Blueprint, render_template, url_for
from flask.ext.login import current_user
from wonder.romeo.core.rest import api_resource, Resource

rootapp = Blueprint('root', __name__)


@rootapp.route('/')
def home():
    return render_template('romeo/index.html')


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
                status.update(
                    user=dict(href=url_for('api.user', user_id=current_user.id)),
                    account=dict(href=url_for('api.account', account_id=current_user.account_id)),
                )
        else:
            status = dict(auth_status='logged_out')
        return status
