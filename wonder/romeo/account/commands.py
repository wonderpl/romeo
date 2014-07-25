from werkzeug import generate_password_hash
from flask import current_app
from wonder.romeo import manager, db
from wonder.romeo.core import dolly
from wonder.romeo.core.db import commit_on_success
from .models import Account, AccountUser
from .views import get_dollyuser


@manager.command
def createuser(account, username, password='changeme'):
    user = AccountUser(
        username=username,
        password_hash=generate_password_hash(password),
    )
    account = Account(name=account, users=[user])
    db.session.add(account)
    # need to commit here so that dolly can verify the account
    try:
        db.session.commit()
    except Exception as e:
        current_app.logger.error(e.message)
        return

    dollydata = dolly.login(user.id)
    account.dolly_user = dollydata['user_id']
    account.dolly_token = dollydata['access_token']
    db.session.commit()


@manager.command
def reset_dolly_tokens():
    try:
        from rockpack.mainsite.core.token import create_access_token
    except ImportError:
        create_access_token = lambda u, c, a: 'xxx'
    for account in Account.query.all():
        account.dolly_token = create_access_token(account.dolly_user, '', 0)
    db.session.commit()


@manager.command
@commit_on_success
def fixup_user_data():
    for user in AccountUser.query.filter_by(avatar_url=None):
        userdata = get_dollyuser(user.account).get_userdata()
        if not user.avatar_url:
            user.avatar_url = userdata['avatar_thumbnail_url']
        if not user.display_name:
            user.display_name = userdata['display_name']
