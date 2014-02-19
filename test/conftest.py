def pytest_configure(config):
    from wonder.romeo import create_app
    app = create_app()
    app.config['DATABASE_URL'] = app.config.get('TEST_DATABASE_URL', 'sqlite://')


def pytest_unconfigure(config):
    pass
