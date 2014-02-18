from flask import render_template
from wonder.romeo import app


@app.route('/')
def home():
    return render_template('web/index.html')


@app.route('/status/')
def status():
    return 'OK', 200, [('Content-Type', 'text/plain')]


@app.errorhandler(404)
def not_found(error):
    return _handle_error(404, error)


@app.errorhandler(500)
def server_error(error):
    return _handle_error(500, error)


def _handle_error(code, error, template=None):
    message = str(getattr(error, 'message', error))
    return render_template(template or 'web/error.html', message=message, code=code), code
