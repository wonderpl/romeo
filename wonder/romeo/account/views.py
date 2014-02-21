from flask import Blueprint, request, render_template, url_for, redirect
from flask.ext.login import login_user, logout_user, fresh_login_required
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
    return render_template('account/settings.html')
