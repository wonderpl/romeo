Flask app for video management platform

Development
-----------

Development environment set up:

0. `cd romeo`
0. `virtualenv --system-site-packages env`      ([see virtualenv usage](http://www.virtualenv.org/en/latest/virtualenv.html#usage))
0. `source env/bin/activate`
0. `pip install -r requirements.txt -r requirements-dev.txt`    ([see pip usage](http://www.pip-installer.org/en/latest/usage.html#pip-install))
0. `echo "DEBUG = True" >wonder/romeo/settings/local.py`

Creating & using dev database tunnel:

0. `ssh -L 45432:db1:5432 -N dev.rockpack.com`
0. `echo "DATABASE_URL = 'postgresql://romeo:xxx@localhost:45432/romeo'" >>wonder/romeo/settings/local.py`

Run dev server with:

    python2.7 manage.py runserver

Some local settings worth considering:

```python
# Use local database:
DATABASE_URL = 'postgresql:///romeo'
SQLALCHEMY_ECHO = True

# For front-end asset dev:
ASSETS_AUTO_BUILD = True
ASSETS_DEBUG = True

# Enable Flask debug toolbar (http://flask-debugtoolbar.rtfd.org/):
DEBUG_TB_ENABLED = True
DEBUG_TB_PROFILER_ENABLED = True
DEBUG_TB_INTERCEPT_REDIRECTS = False

# Use local dolly services:
DOLLY_WS_BASE = DOLLY_WS_SECURE_BASE = 'http://localhost:5000/ws/'
```

Test
----

Run unit tests with [pytest](http://pytest.org/latest/usage.html)

    py.test -x

Build
-----

To build rpm:

    python2.7 setup.py rpm
