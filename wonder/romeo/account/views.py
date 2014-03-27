from flask import Blueprint, request, render_template, url_for, redirect, jsonify, abort
from flask.ext.login import login_user, logout_user, fresh_login_required, current_user
from flask.ext.restful.reqparse import RequestParser
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.dolly import DollyUser
from .forms import LoginForm, ChangePasswordForm
from .models import UserProxy


accountapp = Blueprint('account', __name__)


def _dollyuser(account):
    return DollyUser(account.dolly_user, account.dolly_token)


@accountapp.route('/login', methods=('GET', 'POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if login_user(UserProxy(form.user.id, form.user), form.remember.data):
            return redirect(request.args.get('next') or url_for('.settings'))
    return render_template('account/login.html', form=form)


@accountapp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('root.home'))


@accountapp.route('/_verify_account')
def verify():
    if current_user.get_id():
        return jsonify(
            id=current_user.account.id,
            username=current_user.account.name,
        )
    else:
        return jsonify(), 401


# TODO: Remove me?
@accountapp.route('/settings')
@fresh_login_required
def settings():
    dollyuser = _dollyuser(current_user.account).get_userdata()
    change_password_form = ChangePasswordForm()
    return render_template('account/settings.html',
                           dollyuser=dollyuser,
                           change_password_form=change_password_form)


@api_resource('/login')
class LoginResource(Resource):

    # disable login_required decorator
    decorators = []

    def post(self):
        form = LoginForm(csrf_enabled=False)
        if (form.validate_on_submit() and
                login_user(UserProxy(form.user.id, form.user), form.remember.data)):
            return UserResource().get(current_user.id)
        else:
            return dict(form_errors=form.errors), 400


@api_resource('/user/<int:user_id>')
class UserResource(Resource):
    def get(self, user_id):
        if not user_id == current_user.id:
            abort(403)
        return dict(
            href=url_for('api.user', user_id=current_user.id),
            username=current_user.username,
            account=AccountResource().get(current_user.account.id),
        )


def dolly_account_view(f):
    def decorator(self, account_id):
        account = current_user.account
        if account_id == current_user.account.id:
            return f(self, account, _dollyuser(account))
        else:
            abort(403)
    return decorator


@api_resource('/account/<int:account_id>')
class AccountResource(Resource):
    @dolly_account_view
    def get(self, account, dollyuser):
        userdata = dollyuser.get_userdata()
        return dict(
            href=url_for('api.account', account_id=account.id),
            name=account.name,
            display_name=userdata['display_name'],
            avatar=userdata['avatar_thumbnail_url'],
            profile_cover=userdata['profile_cover_url'],
            player_logo=None,
        )

    account_parser = RequestParser()
    account_parser.add_argument('display_name', dest='set_display_name')
    account_parser.add_argument('avatar', location='files', dest='set_avatar_image')
    account_parser.add_argument('profile_cover', location='files', dest='set_profile_image')

    @dolly_account_view
    def patch(self, account, dollyuser):
        args = self.account_parser.parse_args()
        for arg, value in args.items():
            if value:
                try:
                    getattr(dollyuser, arg)(value)
                except Exception as e:
                    if hasattr(e, 'response'):
                        return e.response.json(), e.response.status_code
                    else:
                        raise
        return None, 204
