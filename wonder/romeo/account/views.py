from flask import Blueprint, request, render_template, url_for, redirect
from flask.ext.login import current_user, login_user, logout_user, login_required, fresh_login_required
from .forms import LoginForm
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


@accountapp.route('/settings')
@fresh_login_required
def settings():
    # XXX: account requires hit on db
    return 'settings: %s' % current_user.account.name


@accountapp.route('/protected')
@login_required
def protected():
    # XXX: get_id() should not hit db
    return 'protected: %s' % current_user.get_id()


@accountapp.route('/open')
def open():
    return 'open: %s' % current_user.get_id()
