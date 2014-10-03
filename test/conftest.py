from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url
from sqlalchemy.exc import OperationalError
from flask import json
from flask.testing import FlaskClient


class FlaskRestClient(FlaskClient):
    def open(self, *args, **kwargs):
        jsondata = kwargs.pop('json', None)
        if jsondata:
            kwargs.update(content_type='application/json', data=json.dumps(jsondata))
        response = super(FlaskRestClient, self).open(*args, **kwargs)
        response.json = lambda: json.loads(response.data)
        return response


def _db_statement(operation, uri):
    dburl = make_url(uri)
    dbname, dburl.database = dburl.database, 'postgres'
    conn = create_engine(dburl).connect()
    if operation == 'drop':
        conn.execute('''
            select pg_terminate_backend(pid)
            from pg_stat_activity where datname = %s
        ''', dbname)
    conn.execute('commit')
    conn.execute('%s database %s' % (operation, dbname))
_create_db = lambda uri: _db_statement('create', uri)
_drop_db = lambda uri: _db_statement('drop', uri)


def pytest_configure(config):
    from wonder.romeo import create_app, db
    app = create_app()
    app.test_client_class = FlaskRestClient
    app.app_context().push()

    if 'TEST_DATABASE_URL' in app.config:
        testdb_uri = app.config['SQLALCHEMY_DATABASE_URI'] = app.config['TEST_DATABASE_URL']
    else:
        testdb_base_url = app.config.get('TEST_DATABASE_BASE_URL', 'postgresql:///')
        testdb = datetime.now().strftime('test_%Y%m%d%H%M%S')
        testdb_uri = app.config['SQLALCHEMY_DATABASE_URI'] = testdb_base_url + testdb
    try:
        db.create_all()
    except OperationalError as e:
        if 'does not exist' in e.message:
            config._testdb_uri = testdb_uri
            _create_db(testdb_uri)
            db.create_all()

    from .fixtures import loaddata
    loaddata()


def pytest_unconfigure(config):
    from wonder.romeo import db
    if hasattr(config, '_testdb_uri'):
        _drop_db(config._testdb_uri)
