import logging
from werkzeug.utils import import_string
from werkzeug.contrib.fixers import ProxyFix
from flask import Flask, request, json, request_finished
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.admin import Admin
from flask.ext.cache import Cache
from flask.ext.assets import Environment
from flask.ext.restful import Api
from wonder.common.commands import Manager
from wonder.romeo import settings


def _configure(app):
    app.config.from_pyfile('settings/common.py')
    app.config.from_pyfile('settings/local.py', silent=True)
    app.config.from_envvar('WONDER_SETTINGS', silent=True)
    env_settings = app.config.get('WONDER_ENV_SETTINGS')  # could be "prod" or "dev"
    if env_settings:
        app.config.from_pyfile('settings/%s.py' % env_settings)


def _setup_logging(app):
    if True:    # not app.debug:
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

    import root.models  # NOQA: needed for alembic


def _init_api(app):
    api.init_app(app)

    # monkey patch WWW-Authenticate header to change scheme to Bearer
    def _unauthorized(response):
        response.headers['WWW-Authenticate'] = 'Bearer realm="wonder"'
        return response
    api.unauthorized = _unauthorized


def _load_extensions(app, wsgi=False):
    for ext in assets_env, admin_views, cache, login_manager:
        ext.init_app(app)

    login_manager.login_view = 'account.login'

    if wsgi:
        app.wsgi_app = ProxyFix(app.wsgi_app)

    if 'SENTRY_DSN' in app.config:
        from raven.contrib.flask import Sentry
        Sentry(app, logging=True, level=logging.WARN)

    if app.debug:
        try:
            from flask.ext.debugtoolbar import DebugToolbarExtension
        except ImportError:
            pass
        else:
            DebugToolbarExtension(app)


def _dont_set_public_cookie(sender, response, **extra):
    if response.cache_control.public:
        response.headers.pop('Set-Cookie', None)


def _register_middleware(app):
    from wonder.common import sqs
    sqs.init_app(app)

    def _force_status(response):
        try:
            status_code = int(request.headers['X-HTTP-Status-Override'])
        except (KeyError, ValueError):
            pass
        else:
            response.headers['X-HTTP-Status-Override'] = response.status
            response.status_code = status_code
        return response
    app.after_request(_force_status)

    request_finished.connect(_dont_set_public_cookie, app)


def _register_blueprints(app):
    for blueprint in app.config['BLUEPRINTS']:
        app.register_blueprint(import_string(blueprint))
    from admin import account, featured     # NOQA


def _register_api_views(app):
    for view in app.config['API_VIEWS']:
        import_string(view)


def _install_monkeypatches(app):
    mock_ooyala_assetid = app.config.get('MOCK_OOYALA_ASSETID')
    if mock_ooyala_assetid:
        def _ooyala_request(*args, **kwargs):
            if args == ('assets',):     # create asset
                return dict(embed_code=mock_ooyala_assetid)
            elif args == ('labels',):
                return dict(id=1) if 'data' in kwargs else dict(items=[])
            elif 'uploading_urls' in args:
                return []
            elif 'generated_preview_images' in args:
                return [
                    dict(
                        url='http://lorempixel.com/1920/1080/technics/%d/' % (i + 1),
                        width=1920, height=1080, time=i * 10
                    )
                    for i in range(10)
                ]
            elif 'primary_preview_image' in args:
                i = json.loads(kwargs['data'])['time'] / 10
                return dict(sizes=[
                    dict(
                        url='http://lorempixel.com/%d/%d/technics/%d/' % (w, h, i + 1),
                        width=w, height=h
                    )
                    for w, h in reversed(app.config['COVER_THUMBNAIL_SIZES'])
                ])
        for modname in 'core.ooyala', 'video.views', 'video.forms':
            module = __import__('wonder.romeo.%s' % modname, fromlist=True)
            module.ooyala_request = _ooyala_request


def create_app(wsgi=False):
    app = Flask(__name__)
    _configure(app)
    _setup_logging(app)
    _install_monkeypatches(app)
    _init_db(app)
    _load_extensions(app, wsgi=wsgi)
    _register_middleware(app)
    _register_blueprints(app)
    _register_api_views(app)
    _init_api(app)
    return app


api = Api(prefix='/api', catch_all_404s=True)
db = SQLAlchemy()
login_manager = LoginManager()
admin_views = Admin()
assets_env = Environment()
cache = Cache()
manager = Manager(create_app, assets_env=assets_env, reloader_extra_files=settings)
