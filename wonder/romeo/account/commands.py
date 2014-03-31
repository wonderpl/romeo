from werkzeug import generate_password_hash
from flask import current_app
from wonder.romeo import manager, db
from wonder.romeo.core import dolly
from .models import Account, AccountUser


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
