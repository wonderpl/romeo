from werkzeug.routing import RequestRedirect
from flask import request, current_app, session, url_for, redirect
from flask.ext.admin import BaseView, expose
from flask.ext.admin.contrib.sqla import ModelView
from requests_oauthlib import OAuth2Session
from wonder.romeo import db, admin_views


GOOGLE_AUTH_SCOPE = ['https://www.googleapis.com/auth/userinfo.email']
GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth'
GOOGLE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token'
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo'


class AuthRedirect(RequestRedirect):
    code = 302

    def get_response(self, environ):
        response = super(AuthRedirect, self).get_response(environ)
        response.cache_control.no_cache = True
        return response


def _oauth_session(state=None):
    return OAuth2Session(
        client_id=current_app.config['GOOGLE_CLIENT_ID'],
        redirect_uri=url_for('adminauthview.callback', _external=True),
        scope=GOOGLE_AUTH_SCOPE,
        state=state,
    )


def _get_google_auth_url(next=None):
    return _oauth_session().authorization_url(GOOGLE_AUTH_URL)[0]


def _verify_oauth_callback(code, state):
    oauth = _oauth_session(state=state)
    oauth.fetch_token(
        token_url=GOOGLE_TOKEN_URL,
        code=code,
        client_secret=current_app.config['GOOGLE_CLIENT_SECRET'],
    )
    userinfo = oauth.get(GOOGLE_USERINFO_URL).json()
    assert userinfo.get('hd') == current_app.config['ADMIN_APPS_DOMAIN'],\
        'Corporate account required'
    session['admin_user'] = userinfo['email']


class AdminAuthView(BaseView):

    is_visible = lambda self: False

    @expose('/')
    def index(self):
        return self.render('admin/auth.html')

    @expose('callback')
    def callback(self):
        try:
            _verify_oauth_callback(request.args['code'], request.args['state'])
        except Exception as e:
            if request.args.get('error') == 'access_denied':
                error = 'Access was denied'
            else:
                error = e.message or e.description or str(e) or 'unknown error'
            return self.render('admin/auth.html', error=error)
        else:
            next = session.pop('_auth_next', None) or url_for('admin.index')
            return redirect(next)


admin_views.add_view(AdminAuthView(url='/admin/oauth2'))


class AdminView(BaseView):

    def is_accessible(self):
        if 'admin_user' in session:
            return True
        else:
            session['_auth_next'] = request.full_path
            raise AuthRedirect(_get_google_auth_url())


class AdminModelView(ModelView, AdminView):

    model = None
    can_delete = False

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('endpoint', 'admin_' + self.model.__tablename__)
        kwargs.setdefault('url', self.model.__tablename__)
        super(AdminModelView, self).__init__(self.model, db.session, **kwargs)


def admin_view(**kwargs):
    def decorator(cls):
        if 'category' not in kwargs:
            kwargs['category'] = cls.__module__.rsplit('.', 1)[-1].capitalize()
        admin_views.add_view(cls(**kwargs))
        return cls
    return decorator
