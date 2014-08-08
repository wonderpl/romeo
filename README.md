Flask app for video management platform

Development
-----------

Development environment set up:

0. `cd romeo`
0. `virtualenv --system-site-packages env`      ([see virtualenv usage](http://www.virtualenv.org/en/latest/virtualenv.html#usage))
0. `source env/bin/activate`
0. `pip install -r requirements.txt -r requirements-dev.txt`    ([see pip usage](http://www.pip-installer.org/en/latest/usage.html#pip-install))
0. `echo "DEBUG = True" >wonder/romeo/settings/local.py`

OS X specific steps:
Get pre-compiled psycopg and pillow libraries from macports (or equivalent) before creating virtual env: `sudo port install py27-pip py27-virtualenv py27-psycopg2 py27-pillow`.
Select correct version with `sudo port select --set python python27; sudo port select --set virtualenv virtualenv27`.

Creating & using dev database tunnel:

0. `ssh -L 45432:db1:5432 -N dev.rockpack.com`
0. `echo "DATABASE_URL = 'postgresql://romeo:xxx@localhost:45432/romeo'" >>wonder/romeo/settings/local.py`

Run dev server with:

    python2.7 manage.py runserver -p 5001 --threaded

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

#### Database

To apply latest schema changes:

    alembic upgrade head

To reset auth tokens after loading a database dump:

    PYTHONPATH=path/to/dolly-web ./manage.py reset_dolly_tokens

Test
----

Run unit tests with [pytest](http://pytest.org/latest/usage.html)

    py.test -x

Build
-----

To build rpm:

    python2.7 setup.py rpm
