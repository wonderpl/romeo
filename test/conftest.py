def pytest_configure(config):
    from wonder.romeo import create_app, db
    app = create_app()
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config.get('TEST_DATABASE_URL', 'sqlite://')
    app.app_context().push()
    db.create_all()
    from .fixtures import loaddata
    loaddata()


def pytest_unconfigure(config):
    pass
