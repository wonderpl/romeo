from datetime import timedelta
import pkg_resources

try:
    VERSION = pkg_resources.get_distribution('wonder-romeo').version
except pkg_resources.DistributionNotFound:
    VERSION = 'unknown'

DATABASE_URL = ''

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
