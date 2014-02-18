import logging
from flask import Flask
from flask.ext.assets import Environment

app = Flask(__name__)


def configure():
    app.config.from_pyfile('settings/common.py')
    app.config.from_pyfile('settings/local.py', silent=True)
    app.config.from_envvar('WONDER_SETTINGS', silent=True)
    env_settings = app.config.get('WONDER_ENV_SETTINGS')  # could be "prod" or "dev"
    if env_settings:
        app.config.from_pyfile('settings/%s.py' % env_settings)
configure()


def init_app():
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(levelname)s: %(message)s', '%Y-%m-%dT%H:%M:%S'))
        app.logger.setLevel(app.config.get('LOG_LEVEL', logging.INFO))
        app.logger.addHandler(handler)

    # Don't duplicate query log messages
    if app.config.get('SQLALCHEMY_ECHO'):
        logging.getLogger('sqlalchemy').propagate = False

    if app.debug:
        try:
            from flask_debugtoolbar import DebugToolbarExtension
        except ImportError:
            pass
        else:
            DebugToolbarExtension(app)

    Environment(app)

    # init web views
    from wonder.romeo.web import views
    views
