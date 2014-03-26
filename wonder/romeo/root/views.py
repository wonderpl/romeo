from flask import Blueprint, render_template


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
