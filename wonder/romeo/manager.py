import os
import sys
import logging
from flask.ext.script import Manager as BaseManager
from flask.ext.assets import ManageAssets
from wonder.romeo import app, init_app


class Manager(BaseManager):
    def __init__(self, app):
        super(Manager, self).__init__(app)
        self.add_command("assets", ManageAssets())
        self.logger = app.logger.manager.getLogger('command')

    def handle(self, prog, args=None):
        logging.basicConfig(level=logging.INFO if app.debug else logging.WARN)
        return super(Manager, self).handle(prog, args)

manager = Manager(app)


@manager.command
def test():
    """Run tests"""
    import pytest
    pytest.main()


@manager.command
def dbshell(slave=False):
    """Run psql for the configured database."""
    from sqlalchemy import create_engine
    dburl = app.config['SLAVE_DATABASE_URL' if slave else 'DATABASE_URL']
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
    init_app()
    if args:
        return manager.handle(sys.argv[0], args)
    else:
        return manager.run()
