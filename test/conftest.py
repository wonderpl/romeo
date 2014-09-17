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


def pytest_configure(config):
    from wonder.romeo import create_app, db
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config.get('TEST_DATABASE_URL', 'sqlite://')
    app.test_client_class = FlaskRestClient
    app.app_context().push()
    db.create_all()
    from .fixtures import loaddata
    loaddata()


def pytest_unconfigure(config):
    pass
