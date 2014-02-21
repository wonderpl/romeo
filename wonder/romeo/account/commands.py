from werkzeug import generate_password_hash
from wonder.romeo import manager, db
from .models import Account, AccountUser


@manager.command
def createuser(account, email, password='changeme'):
    user = AccountUser(
        username=email,
        password_hash=generate_password_hash(password),
    )
    account = Account(name=account, users=[user])
    db.session.add(account)
    db.session.commit()
