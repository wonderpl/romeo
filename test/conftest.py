def pytest_configure(config):
    from wonder.romeo import app, init_app
    app.config['FORCE_INDEX_INSERT_REFRESH'] = True
    app.config['DATABASE_URL'] = app.config.get('TEST_DATABASE_URL', 'sqlite://')
    init_app()


def pytest_unconfigure(config):
    from wonder.romeo import app
    app
