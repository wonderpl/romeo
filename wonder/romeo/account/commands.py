import sys
import datetime
from sqlalchemy import extract
from sqlalchemy.exc import DataError
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from wonder.romeo import manager, db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.email import send_email, email_template_env
from .models import Account, AccountUser, AccountUserVisit, RegistrationToken
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
def create_registration_token(recipient):
    token = RegistrationToken.new(recipient)
    db.session.commit()
    print token.id


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
    from wonder.romeo.account.forms import ExternalLoginForm
    form = ExternalLoginForm()
    for user in AccountUser.query.all():
        try:
            userdata = get_dollyuser(user.account).get_userdata()
        except Exception:
            print >>sys.stderr, 'Unable to fetch dolly data for %s' % user.display_name
            continue

        if not user.location:
            user.location = 'GB'

        userdata['name'] = user.display_name or userdata['display_name']
        userdata['profile_image_url'] = userdata.get(
            'avatar_thumbnail_url', '').replace('thumbnail_large', 'original')
        userdata['profile_banner_url'] = userdata.get(
            'profile_cover_url', '').replace('ipad', 'original')
        form.user_data = userdata
        form.account_id = user.account_id
        form._update_user(user)


@manager.cron_command(3600)
def send_profile_visitor_email(**kwargs):
    current_time = datetime.datetime.now()
    current_day_of_week = current_time.weekday()
    current_hour = current_time.hour
    one_week_ago = current_time - datetime.timedelta(weeks=1)
    template = email_template_env.get_template('profile_visitors.html')
    senders = AccountUser.query.filter(extract('dow', AccountUserVisit.visit_date) == current_day_of_week, extract('hour', AccountUserVisit.visit_date) == current_hour)
    for sender in senders:
        visitors = map(AccountUserVisit.visit_item, list(
            AccountUserVisit.unique_visits(
                AccountUserVisit.query.filter(AccountUserVisit.profile_user_id == sender.id, AccountUserVisit.visit_date > one_week_ago)
            )
        ))
        if len(visitors):
            body = template.render(
                sender=sender,
                visitors=visitors,
                **kwargs
            )
            print body
        send_email(sender.username, body)
