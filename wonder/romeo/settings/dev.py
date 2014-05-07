import os
execfile(os.environ['WONDER_SETTINGS'])

DATABASE_PASSWORD = _decrypt('O\x96\xd74\xc7')
DATABASE_URL = 'postgresql://romeo:%s@db1/romeo' % DATABASE_PASSWORD

SESSION_COOKIE_SECURE = True
