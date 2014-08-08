import re
from functools import wraps
from urlparse import parse_qs
from requests_oauthlib import OAuth1, requests
import twitter
from xml.etree import cElementTree as ElementTree
from itsdangerous import URLSafeSerializer, BadSignature
from flask import (Blueprint, current_app, request, render_template, url_for,
                   session, redirect, jsonify)
from flask.ext.login import login_user, logout_user, current_user
from flask.ext.restful import abort
from flask.ext.restful.reqparse import RequestParser
from wonder.common.i18n import lazy_gettext as _
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.dolly import DollyUser
from .forms import (RegistrationForm, ExternalLoginForm, LoginForm,
                    AccountUserForm, AccountUserConnectionForm, AccountPaymentForm)
from .models import UserProxy, AccountUser, AccountUserConnection


CALLBACK_JS_FUNCTION_RE = re.compile('^[\w.]+$')


accountapp = Blueprint('account', __name__)


def get_dollyuser(account):
    if account.dolly_user:
        return DollyUser(account.dolly_user, account.dolly_token)


def dolly_account_view(f):
    @wraps(f)
    def decorator(self, account_id):
        account = current_user.account
        if account_id == current_user.account.id:
            return f(self, account, get_dollyuser(account))
        else:
            abort(403, error='access_denied')
    return decorator


@accountapp.route('/login', methods=('GET', 'POST'))
def login():
    return redirect(url_for('root.app') + '#/login')


@accountapp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('root.app'))


@accountapp.route('/_verify_account')
def verify():
    if current_user.get_id():
        return jsonify(
            id=current_user.account.id,
            username=current_user.account.name,
        )
    else:
        return jsonify(), 401


@accountapp.route('/auth/twitter')
def twitter_auth():
    return render_template('account/twitter_auth.html')


@accountapp.route('/auth/twitter_redirect')
def twitter_auth_redirect():
    callback_uri = url_for('.twitter_auth_callback', _external=True)
    callback_function = request.args.get('callback', '')
    if CALLBACK_JS_FUNCTION_RE.match(callback_function):
        callback_uri += '?callback=' + callback_function

    oauth = OAuth1(
        current_app.config['TWITTER_CONSUMER_KEY'],
        current_app.config['TWITTER_CONSUMER_SECRET'],
        callback_uri=callback_uri,
    )
    response = requests.post(twitter.REQUEST_TOKEN_URL, auth=oauth)
    token_data = parse_qs(response.content)
    assert token_data['oauth_callback_confirmed'][0] == 'true'

    # OK to store secret in session cookie??
    session['twitter_req_token'] = token_data['oauth_token'][0]
    session['twitter_req_secret'] = token_data['oauth_token_secret'][0]

    url = twitter.SIGNIN_URL + '?oauth_token=' + token_data['oauth_token'][0]
    return redirect(url)


@accountapp.route('/auth/twitter_callback')
def twitter_auth_callback():
    callback_function = request.args.get('callback', '')
    if not CALLBACK_JS_FUNCTION_RE.match(callback_function):
        callback_function = 'console.log'
    verifier = request.args.get('oauth_verifier')
    token = request.args.get('oauth_token')
    secret = session.pop('twitter_req_secret', None)

    result = dict(error=None)
    if verifier and secret and token == session.pop('twitter_req_token', 'none'):
        oauth = OAuth1(
            current_app.config['TWITTER_CONSUMER_KEY'],
            current_app.config['TWITTER_CONSUMER_SECRET'],
            token,
            secret,
            verifier=verifier,
        )
        response = requests.post(twitter.ACCESS_TOKEN_URL, auth=oauth)
        if response.ok:
            token_data = parse_qs(response.content)
            token = token_data['oauth_token'][0] + ':' + token_data['oauth_token_secret'][0]
            result['credentials'] = dict(
                external_system='twitter',
                external_token=token,
                metadata=dict(screen_name=token_data['screen_name'][0]),
            )
        else:
            try:
                result['error'] =\
                    ElementTree.fromstring(response.content).find('error').text
            except SyntaxError:
                result['error'] = _('Unknown')
    else:
        if request.args.get('denied'):
            result['error'] = _('Access not granted')
        else:
            result['error'] = _('Invalid token')

    return render_template('account/twitter_auth_callback.html',
                           result=result, callback_function=callback_function)


@api_resource('/validate_token')
class TokenValidatorResource(Resource):

    decorators = []

    def post(self):
        serializer = URLSafeSerializer(current_app.secret_key)
        data = request.json or request.form
        try:
            token = serializer.loads(data['token'])
        except BadSignature:
            return dict(error='invalid_request'), 400

        if type(token) is dict and 'collaborator' in token:
            session['collaborator_ids'] = list(
                set([token['collaborator']] + session.get('collaborator_ids', [])))
            from wonder.romeo.video.views import collaborator_record
            return collaborator_record(token['collaborator'])

        return None, 204


class BaseLoginResource(Resource):

    # disable login_required decorator
    decorators = []

    @commit_on_success
    def post(self):
        form = self.form_class(csrf_enabled=False)
        if form.validate_on_submit():
            user = form.save()
            if login_user(UserProxy(user.id, user), form.remember.data):
                return dict(
                    user=UserResource().get(current_user.id),
                    account=AccountResource().get(current_user.account.id),
                )
        logout_user()
        return dict(error='invalid_request', form_errors=form.errors), 400


@api_resource('/register')
class RegisterResource(BaseLoginResource):
    form_class = RegistrationForm


@api_resource('/login')
class LoginResource(BaseLoginResource):
    form_class = LoginForm


@api_resource('/login/external')
class ExternalLoginResource(BaseLoginResource):
    form_class = ExternalLoginForm


def _user_item(user):
    return dict(
        (k, getattr(user, k))
        for k in ('id', 'href', 'location', 'display_name',
                  'title', 'description', 'website_url',
                  'search_keywords', 'profile_cover', 'avatar', 'contactable')
    )


def user_view(current_user_only=True):
    def decorator(f):
        @wraps(f)
        def wrapper(self, user_id, *args, **kwargs):
            if current_user_only:
                if user_id == current_user.id:
                    user = current_user.user
                else:
                    abort(403, error='access_denied')
            else:
                user = AccountUser.query.filter_by(active=True, id=user_id).first_or_404()
            return f(self, user, *args, **kwargs)
        return wrapper
    return decorator


@api_resource('/user/<int:user_id>')
class UserResource(Resource):

    @user_view()
    def get(self, user):
        return _user_item(user)

    @commit_on_success
    @user_view()
    def patch(self, user):
        form = AccountUserForm(obj=user)
        # Exclude form fields that weren't specified in the request
        for field in form.data:
            if field not in (request.json or request.form or request.files):
                delattr(form, field)

        if form.validate():
            user = form.save()
            return _user_item(user)
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400


def _connection_item(connection):
    user = connection.connection
    return dict(
        id=connection.connection_id,
        href=connection.href,
        state=connection.state,
        user=dict(
            id=user.id,
            href=user.href,
            display_name=user.display_name,
            email=user.email if connection.state == 'accepted' else None,
            avatar=user.avatar,
        )
    )


@api_resource('/user/<int:user_id>/connections')
class UserConnectionsResource(Resource):

    @user_view()
    def get(self, user):
        # TODO: include video collaborators here
        items = map(_connection_item, user.connections)
        return dict(connection=dict(items=items, total=len(items)))

    @commit_on_success
    @user_view()
    def post(self, user):
        form = AccountUserConnectionForm(account_user=user)
        if form.validate():
            connection = form.save()
            if connection:
                return (dict(id=connection.connection_id, href=connection.href),
                        201, {'Location': connection.href})
            else:
                return None, 204
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400


@api_resource('/user/<int:user_id>/connections/<int:connection_id>')
class UserConnectionResource(Resource):

    @user_view()
    def get(self, user, connection_id):
        connection = AccountUserConnection.query.filter_by(
            account_user_id=user.id, connection_id=connection_id).first_or_404()
        return _connection_item(connection)


@commit_on_success
def _update_users(account_id, **kwargs):
    args_are_null = dict((k, None) for k in kwargs)
    AccountUser.query.filter_by(account_id=account_id, **args_are_null).update(kwargs)


def account_item(account, dollyuser):
    item = dict(
        id=account.id,
        href=url_for('api.account', account_id=account.id),
        account_type=account.account_type,
        name=account.name,
    )
    if dollyuser:
        # Take profile data from Dolly
        userdata = dollyuser.get_userdata()
        item.update(
            display_name=userdata['display_name'],
            description=userdata['description'],
            avatar=userdata['avatar_thumbnail_url'],
            profile_cover=userdata['profile_cover_url'],
        )
    else:
        # Use first user
        userdata = _user_item(account.users[0])
        item.update(
            display_name=userdata['display_name'],
            description=userdata['description'],
            avatar=userdata['avatar'],
            profile_cover=userdata['profile_cover'],
        )
    return item


@api_resource('/account/<int:account_id>')
class AccountResource(Resource):

    @dolly_account_view
    def get(self, account, dollyuser):
        return account_item(account, dollyuser)

    account_parser = RequestParser()
    account_parser.add_argument('display_name', dest='set_display_name')
    account_parser.add_argument('description', dest='set_description')
    account_parser.add_argument('avatar', location='files', dest='set_avatar_image')
    account_parser.add_argument('profile_cover', location='files', dest='set_profile_image')

    @dolly_account_view
    def patch(self, account, dollyuser):
        if not dollyuser:
            abort(403, error='access_denied', message='"content_owner" account required')

        args = self.account_parser.parse_args()
        for arg, value in args.items():
            if value:
                try:
                    result = getattr(dollyuser, arg)(value)
                except Exception as e:
                    if hasattr(e, 'response'):
                        return e.response.json(), e.response.status_code
                    else:
                        raise
                else:
                    if arg == 'set_avatar_image':
                        _update_users(account.id, avatar_url=result)
                    elif arg == 'set_display_name':
                        _update_users(account.id, display_name=value)
        return self.get(account.id)


@api_resource('/account/<int:account_id>/payment')
class AccountPaymentResource(Resource):

    @commit_on_success
    @dolly_account_view
    def post(self, account, dollyuser):
        request.json['payment_token'] = request.json.get('stripeToken')
        form = AccountPaymentForm(csrf_enabled=False)
        if form.validate():
            form.save()
            return None, 204
        else:
            return dict(error='invalid_request', form_errors=form.errors), 400
