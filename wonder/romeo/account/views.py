from flask import Blueprint, request, render_template, url_for, redirect, jsonify
from flask.ext.login import login_user, logout_user, fresh_login_required, current_user
from wonder.romeo.core import dolly
from .forms import LoginForm, ChangePasswordForm
from .models import UserProxy


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
