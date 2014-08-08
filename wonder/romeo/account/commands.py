import sys
from sqlalchemy.exc import DataError
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from wonder.romeo import manager, db
from wonder.romeo.core.db import commit_on_success
from .models import Account, AccountUser
from .views import get_dollyuser
from .forms import register_user


@manager.command
def createuser(account, username, password='changeme', account_type='content_owner'):
    try:
        register_user(account, username, password, account_type=account_type)
    except Exception as e:
        if hasattr(e, 'response'):
            print >>sys.stderr, 'Error from dolly: %s' % e.response.content[-200:]
        else:
            print >>sys.stderr, e.message
    else:
        db.session.commit()


@manager.command
def set_user_password(username, password):
    try:
        user = AccountUser.query.filter_by(username=username).one()
    except NoResultFound:
        print >>sys.stderr, 'Invalid username'
    else:
        user.set_password(password)
        db.session.commit()


@manager.command
def set_account_type(account, account_type):
    filter = dict(id=account) if account.isdigit() else dict(name=account)
    try:
        account = Account.query.filter_by(**filter).one()
    except (NoResultFound, MultipleResultsFound):
        print >>sys.stderr, 'Invalid account id or name'
    else:
        try:
            account.set_account_type(account_type)
            db.session.commit()
        except DataError as e:
            print >>sys.stderr, e.orig.message.split('\n', 1)[0]


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
