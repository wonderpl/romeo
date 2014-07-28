import sys
from wonder.romeo import manager, db
from wonder.romeo.core.db import commit_on_success
from .models import Account, AccountUser
from .views import get_dollyuser
from .forms import register_user


@manager.command
def createuser(account, username, password='changeme'):
    try:
        register_user(account, username, password)
    except Exception as e:
        if hasattr(e, 'response'):
            print >>sys.stderr, 'Error from dolly: %s' % e.response.content[-200:]
        else:
            print >>sys.stderr, e.message
    else:
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
