import os
execfile(os.environ['WONDER_SETTINGS'])

SECRET_KEY = _decrypt('.YFx\xa9\xedT\xb3\x039\xd6J\xe9\x00\xb6\xf2\xce\x15\xe9Wx0\xa9\xbaE\xd61\x86\xe4-\xc4\xfc\x82\x847&\x08\xb4\x13\xf2\xbf3<\x18h\x10\xd6*\x922\x14\xe0\xa5u{W\x91\xbb\xd9\x99~\xca\x18\x00')

DATABASE_PASSWORD = _decrypt('5\xe8X\x04\x9cc\x86Da\x8f')
DATABASE_URL = 'postgresql://romeo:%s@db1/romeo' % DATABASE_PASSWORD

SESSION_COOKIE_SECURE = True
ENABLE_BACKGROUND_SQS = True

DOLLY_WS_BASE = 'http://api.wonderpl.com/ws/'
DOLLY_WS_SECURE_BASE = 'https://secure.wonderpl.com/ws/'
DOLLY_WEBLITE_URL_FMT = 'http://wonderpl.com/channel/{slug}/{channelid}/?video={instanceid}'
DOLLY_EMBED_URL_FMT = 'http://wonderpl.com/embed/{instanceid}/'
DOLLY_PUBSUB_SECRET = _decrypt('\x15\xc4\xd6?\xe7o\x7fS\x94$\xc5<?\x83-\xaf\xac=+T\x89\x16\\C"\x8f\x07\x0f\x1f\x9d\xea\t')

DEFAULT_EMAIL_SOURCE = 'Wonder PL <noreply@wonderpl.com>'

# AWS
VIDEO_S3_BUCKET = 'video.us.wonderpl.com'
MEDIA_S3_BUCKET = 'media.us.wonderpl.com'

MEDIA_BASE_URL = 'http://media.us.wonderpl.com'

SQS_REGION = 'us-east-1'

# Ooyala
OOYALA_API_KEY = 'YzYW8xOshpVwePawyVliU0L_tBj_.yPTX2'
OOYALA_SECRET = _decrypt('!\xad\xb5\xe8\xac\xf0\xc2\xed\xa2\t\t0K\x88\xf1,\xba\x88\xe4\xbc\x1aE:2\xc0M\xd6\xd7\xa2/\xbd\xc9\x96\xef\x87\xae\xa6]\x83*')
