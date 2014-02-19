from flask import Blueprint, request, render_template, url_for, redirect
from flask.ext.login import current_user, login_user, logout_user, login_required, fresh_login_required
from .forms import LoginForm
from .models import UserProxy


userapp = Blueprint('user', __name__)


@userapp.route('/login', methods=('GET', 'POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        login_user(UserProxy(form.user.id, form.user), form.remember.data)
        return redirect(request.args.get('next') or url_for('.dashboard'))
    return render_template('user/login.html', form=form)


@userapp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('root.home'))


@userapp.route('/settings')
@fresh_login_required
def settings():
    # XXX: username requires hit on db
    return 'settings: %s' % current_user.username


@userapp.route('/protected')
@login_required
def protected():
    # XXX: get_id() should not hit db
    return 'protected: %s' % current_user.get_id()


@userapp.route('/open')
def open():
    return 'open: %s' % current_user.get_id()
