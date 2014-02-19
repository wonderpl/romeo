from flask import Blueprint, request, render_template, url_for, redirect
from flask.ext.login import current_user, login_user, logout_user, login_required, fresh_login_required
from wonder.romeo import login_manager
from .forms import LoginForm
from .models import AuthUser


userapp = Blueprint('user', __name__)


@login_manager.user_loader
def load_user(userid):
    return AuthUser(userid)


@userapp.route('/login', methods=('GET', 'POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        login_user(AuthUser(form.username.data), form.remember.data)
        print form.remember.data
        return redirect(request.args.get('next') or url_for('.dashboard'))
    return render_template('user/login.html', form=form)
login_manager.login_view = 'user.login'


@userapp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('root.home'))


@userapp.route('/dashboard')
@login_required
def dashboard():
    return 'dashboard: %s' % current_user.id


@userapp.route('/settings')
@fresh_login_required
def settings():
    return 'settings: %s' % current_user.id
