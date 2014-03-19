from flask import Blueprint, request, render_template, url_for, redirect, jsonify, abort
from flask.ext import restful
from flask.ext.login import login_user, logout_user, fresh_login_required, current_user
from sqlalchemy.orm import exc
from wonder.romeo.core import dolly
from wonder.romeo import api
from .forms import LoginForm, ChangePasswordForm
from .models import UserProxy, AccountUser


accountapp = Blueprint('account', __name__)


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


@accountapp.route('/settings')
@fresh_login_required
def settings():
    account = current_user.account
    dollyuser = dolly.get_userdata(account.dolly_user, account.dolly_token)
    change_password_form = ChangePasswordForm()
    return render_template('account/settings.html',
                           dollyuser=dollyuser,
                           change_password_form=change_password_form)


class AccountApi(restful.Resource):

    def get(self, account_id):
        try:
            user = AccountUser.query.filter(AccountUser.account_id == account_id).one()
        except exc.NoResultFound:
            abort(404)
        else:
            return dict(
                username=user.username,
                account=dict(
                    name=user.account.name,
                    wonder_user=user.account.dolly_user))


api.add_resource(AccountApi, '/account/<int:account_id>')
