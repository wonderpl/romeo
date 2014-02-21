import logging
from werkzeug.utils import import_string
from werkzeug.contrib.fixers import ProxyFix
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.script import Manager
from flask.ext.login import LoginManager
from flask.ext.cache import Cache
from flask.ext.assets import Environment, ManageAssets


def _configure(app):
    app.config.from_pyfile('settings/common.py')
    app.config.from_pyfile('settings/local.py', silent=True)
    app.config.from_envvar('WONDER_SETTINGS', silent=True)
    env_settings = app.config.get('WONDER_ENV_SETTINGS')  # could be "prod" or "dev"
    if env_settings:
        app.config.from_pyfile('settings/%s.py' % env_settings)


def _setup_logging(app):
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(levelname)s: %(message)s', '%Y-%m-%dT%H:%M:%S'))
        app.logger.setLevel(app.config.get('LOG_LEVEL', logging.INFO))
        app.logger.addHandler(handler)

    # Don't duplicate query log messages
    if app.config.get('SQLALCHEMY_ECHO'):
        logging.getLogger('sqlalchemy').propagate = False


def _init_db(app):
    app.config.setdefault('SQLALCHEMY_DATABASE_URI', app.config.get('DATABASE_URL', ''))
    db.init_app(app)


def _load_extensions(app, wsgi=False):
    for ext in assetenv, cache, login_manager:
        ext.init_app(app)

    login_manager.login_view = 'account.login'

    if wsgi:
        app.wsgi_app = ProxyFix(app.wsgi_app)

    if 'SENTRY_DSN' in app.config:
        from raven.contrib.flask import Sentry
        Sentry(app, logging=app.config.get('SENTRY_ENABLE_LOGGING'), level=logging.WARN)

    if app.debug:
        try:
            from flask.ext.debugtoolbar import DebugToolbarExtension
        except ImportError:
            pass
        else:
            DebugToolbarExtension(app)


def _register_middleware(app):
    from wonder.romeo.core import sqs
    sqs.init_app(app)


def _register_blueprints(app):
    for blueprint in app.config['BLUEPRINTS']:
        app.register_blueprint(import_string(blueprint))


def create_app(wsgi=False):
    app = Flask(__name__)
    _configure(app)
    _setup_logging(app)
    _init_db(app)
    _load_extensions(app, wsgi=wsgi)
    _register_middleware(app)
    _register_blueprints(app)
    return app


db = SQLAlchemy()
login_manager = LoginManager()
assetenv = Environment()
cache = Cache()
manager = Manager(create_app, with_default_commands=True)
manager.add_command('assets', ManageAssets(assetenv))
