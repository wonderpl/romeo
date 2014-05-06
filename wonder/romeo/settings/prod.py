import os
execfile(os.environ['WONDER_SETTINGS'])

SECRET_KEY = _decrypt('.YFx\xa9\xedT\xb3\x039\xd6J\xe9\x00\xb6\xf2\xce\x15\xe9Wx0\xa9\xbaE\xd61\x86\xe4-\xc4\xfc\x82\x847&\x08\xb4\x13\xf2\xbf3<\x18h\x10\xd6*\x922\x14\xe0\xa5u{W\x91\xbb\xd9\x99~\xca\x18\x00')

DATABASE_PASSWORD = _decrypt('5\xe8X\x04\x9cc\x86Da\x8f')
DATABASE_URL = 'postgresql://romeo:%s@db1/romeo' % DATABASE_PASSWORD

SESSION_COOKIE_SECURE = True

DOLLY_WS_BASE = 'http://api.wonderpl.com/ws/'
DOLLY_WS_SECURE_BASE = 'https://secure.wonderpl.com/ws/'

# AWS
VIDEO_S3_BUCKET = 'video.us.wonderpl.com'
MEDIA_S3_BUCKET = 'media.us.wonderpl.com'

MEDIA_BASE_URL = 'http://media.us.wonderpl.com'

SQS_REGION = 'us-east-1'
