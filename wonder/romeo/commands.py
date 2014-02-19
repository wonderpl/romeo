import os
import sys
from flask import current_app
from . import manager


@manager.command
def test():
    """Run tests"""
    import pytest
    pytest.main()


@manager.command
def dbshell(slave=False):
    """Run psql for the configured database."""
    from sqlalchemy import create_engine
    dburl = current_app.config['SLAVE_DATABASE_URL' if slave else 'DATABASE_URL']
    engine = create_engine(dburl)
    assert engine.dialect.name == 'postgresql'
    env = os.environ
    env['PATH'] = '/usr/bin:/bin'
    args = ['psql']
    if engine.url.username:
        args += ['-U', engine.url.username]
    if engine.url.host:
        args.extend(['-h', engine.url.host])
    if engine.url.port:
        args.extend(['-p', str(engine.url.port)])
    if engine.url.password:
        env['PGPASSWORD'] = engine.url.password
    args += [engine.url.database]
    try:
        os.execvpe(args[0], args, env)
    except OSError, e:
        print >>sys.stderr, '%s: %s' % (args[0], e.args[1])


def run(*args):
    if args:
        return manager.handle(sys.argv[0], args)
    else:
        return manager.run()
