from datetime import timedelta
import pkg_resources

try:
    VERSION = pkg_resources.get_distribution('wonder-romeo').version
except pkg_resources.DistributionNotFound:
    VERSION = 'unknown'

BLUEPRINTS = [
    'wonder.romeo.%s.views.%sapp' % (mod, mod)
    for mod in
    'root', 'account', 'video', 'payments', 'seo'
]

API_VIEWS = [
    'wonder.romeo.%s.views' % mod for mod in 'analytics', 'video'
]

DATABASE_URL = ''

CACHE_TYPE = 'simple'

SECRET_KEY = 'kngXnbbSP3BtmsohyOTpPWkdytB1jNuNjpExgmy8HEKcAJt7HXkMbFWm6l6dxyWG'

# Flask-Login
REMEMBER_COOKIE_NAME = 'at'
REMEMBER_COOKIE_DURATION = timedelta(days=1)
REMEMBER_COOKIE_SECURE = False
# SESSION_PROTECTION = 'strong'

# Flask-Assets
ASSETS_URL = '/static'
ASSETS_MANIFEST = 'file'
ASSETS_CACHE = False
ASSETS_AUTO_BUILD = False

# Email config
EMAIL_TEMPLATE_PATH = 'templates/email'
DEFAULT_EMAIL_SOURCE = 'Wonder PL <noreply@dev.wonderpl.com>'

# Dolly services
DOLLY_WS_BASE = 'http://api.dev.wonderpl.com/ws/'
DOLLY_WS_SECURE_BASE = 'https://secure.dev.wonderpl.com/ws/'
DOLLY_WS_CLIENT_AUTH = 'Basic YzhmZTVmNnJvY2s4NzNkcGFjazE5UTo='
DOLLY_WEBLITE_URL_FMT = 'http://dev.wonderpl.com/channel/{slug}/{channelid}/?video={instanceid}'

DOLLY_PUBSUB_ID = 434
DOLLY_PUBSUB_SECRET = '75f1f16ca9da5250385d0510c8e2d7cc'

# AWS
VIDEO_S3_BUCKET = 'video.dev.wonderpl.com'
MEDIA_S3_BUCKET = 'media.dev.wonderpl.com'

MEDIA_BASE_URL = 'http://media.dev.wonderpl.com'

COVER_THUMBNAIL_SIZES = (
    (96, 54),
    (320, 180),
    (640, 360),
    (1280, 720),
    (1920, 1080),
)

GRAVATAR_BASE_URL = "http://www.gravatar.com/avatar/"
GRAVATAR_SIZE = 48

SQS_REGION = 'eu-west-1'
SQS_QUEUE_NAME_PREFIX = 'romeo-'
SQS_DEFAULT_DELAY_SECONDS = 10

# Ooyala
OOYALA_API_KEY = '4za3UxOvGxUX76P98NO8TKv4aX2V.j9gKk'
OOYALA_SECRET = 'yQTUFFDLwWrmgCKz7v1QnDJghaDkGRug2A4YQvgD'
