from flask import Blueprint, render_template


root = Blueprint('root', __name__)


@root.route('/')
def home():
    return render_template('web/index.html')


@root.route('/status/')
def status():
    return 'OK', 200, [('Content-Type', 'text/plain')]


@root.app_errorhandler(404)
def not_found(error):
    return _handle_error(404, error)


@root.app_errorhandler(500)
def server_error(error):
    return _handle_error(500, error)


def _handle_error(code, error, template=None):
    message = str(getattr(error, 'message', error))
    return render_template(template or 'web/error.html', message=message, code=code), code
