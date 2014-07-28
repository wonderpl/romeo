import os

_decrypt = lambda x: x
try:
    execfile(os.environ['WONDER_SETTINGS'])
except (IOError, KeyError):
    pass


DATABASE_PASSWORD = _decrypt('O\x96\xd74\xc7')
DATABASE_URL = 'postgresql://romeo:%s@db1/romeo' % DATABASE_PASSWORD

SESSION_COOKIE_SECURE = True
ENABLE_BACKGROUND_SQS = True
