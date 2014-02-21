from datetime import timedelta
import pkg_resources

try:
    VERSION = pkg_resources.get_distribution('wonder-romeo').version
except pkg_resources.DistributionNotFound:
    VERSION = 'unknown'

BLUEPRINTS = [
    'wonder.romeo.%s.views.%sapp' % (mod, mod)
    for mod in
    'root', 'account', 'video', 'analytics', 'payments'
]

DATABASE_URL = ''

CACHE_TYPE = 'simple'

SECRET_KEY = 'kngXnbbSP3BtmsohyOTpPWkdytB1jNuNjpExgmy8HEKcAJt7HXkMbFWm6l6dxyWG'

# Flask-Login
REMEMBER_COOKIE_NAME = 'at'
REMEMBER_COOKIE_DURATION = timedelta(days=1)
REMEMBER_COOKIE_SECURE = False
#SESSION_PROTECTION = 'strong'

# Flask-Assets
ASSETS_URL = '/static'
ASSETS_MANIFEST = 'file'
ASSETS_CACHE = False
ASSETS_AUTO_BUILD = False


# Dolly services
DOLLY_WS_BASE = 'http://api.wonderpl.com/ws/'

# AWS
VIDEO_S3_BUCKET = 'video.dev.wonderpl.com'

SQS_REGION = 'eu-west-1'
SQS_DEFAULT_VISIBILITY_TIMEOUT = 600
SQS_BACKGROUND_VISIBILITY_TIMEOUT = 1200

# Ooyala
OOYALA_API_KEY = 'E5b3cxOouCVEp74z0_0PyHrU8Zl-.lNvZk'
OOYALA_SECRET = 'wI6McCpMI72GYC5Nriqt0cS6AP00V3J1-j2nJvME'
