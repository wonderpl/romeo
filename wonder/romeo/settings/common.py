import pkg_resources
try:
    VERSION = pkg_resources.get_distribution('wonder-romeo').version
except pkg_resources.DistributionNotFound:
    VERSION = 'unknown'

DATABASE_URL = ''

SECRET_KEY = 'kngXnbbSP3BtmsohyOTpPWkdytB1jNuNjpExgmy8HEKcAJt7HXkMbFWm6l6dxyWG'

ASSETS_URL = '/static'
ASSETS_MANIFEST = 'file'
ASSETS_CACHE = False
ASSETS_AUTO_BUILD = False
