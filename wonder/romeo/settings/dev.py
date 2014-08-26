import os

_decrypt = lambda x: x
try:
    execfile(os.environ['WONDER_SETTINGS'])
except (IOError, KeyError):
    pass


DATABASE_PASSWORD = _decrypt('O\x96\xd74\xc7')
DATABASE_URL = 'postgresql://romeo:%s@db1/romeo' % DATABASE_PASSWORD

SERVER_NAME = 'romeo.dev.wonderpl.com'
PREFERRED_URL_SCHEME = 'https'
ASSETS_URL = 'https://' + SERVER_NAME + '/static'
SESSION_COOKIE_DOMAIN = SERVER_NAME
SESSION_COOKIE_SECURE = True

ENABLE_BACKGROUND_SQS = True

SENTRY_USER = '912ecddb02504d4abf7005e1c60ae67f'
SENTRY_PASSWORD = _decrypt('^\r\x90\xa8JS\xa3Z\xa1t\xc7\x86\xc1n\xb7\xa4u\tS\xc7U_\xe51>i\xdb\x0b\x1d\x92~\xdd')
SENTRY_DSN = 'https://%s:%s@sentry.dev.rockpack.com/8' % (SENTRY_USER, SENTRY_PASSWORD)
