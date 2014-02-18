import logging
from werkzeug.contrib.fixers import ProxyFix
from wonder.romeo import app, init_app

init_app()

app.wsgi_app = ProxyFix(app.wsgi_app)

if 'SENTRY_DSN' in app.config:
    from raven.contrib.flask import Sentry
    Sentry(app, logging=app.config.get('SENTRY_ENABLE_LOGGING'), level=logging.WARN)

application = app
