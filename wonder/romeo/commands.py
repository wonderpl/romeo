import os
import sys
from werkzeug.utils import import_string
from flask import current_app
from . import manager


@manager.command
def test():
    """Run tests"""
    import pytest
    pytest.main()


@manager.command
def send_test_email(email_type, recipient, output=None):
    from wonder.romeo import db
    from wonder.romeo.video import forms as video_forms
    from wonder.romeo.account import forms as account_forms
    from wonder.romeo.account.models import (
        Account, AccountUser, AccountUserConnection, RegistrationToken)
    from wonder.romeo.video.models import (
        Video, VideoThumbnail, VideoCollaborator, VideoComment)
    from wonder.romeo.admin import account as account_admin

    current_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'
    current_app.config['ASSETS_URL'] = 'https://romeo.dev.wonderpl.com/static'

    if output:
        def _send_email(recipient, body):
            with open(output, 'w') as f:
                f.write(body)
        video_forms.send_email = account_forms.send_email =\
            account_admin.send_email = _send_email

    def _create_test_video():
        video = Video(title='test', status='ready')
        video.thumbnails = [VideoThumbnail(url='http://lorempixel.com/640/360/technics/2/',
                                           width=640, height=360)]
        video.collaborators = [VideoCollaborator(email=recipient, name='Vidkun Quisling')]
        account = Account(id=88888888, name='test')
        user0 = AccountUser(username=recipient, password_hash='',
                            display_name='Maynard Cohen',
                            avatar='cohen')
        user1 = AccountUser(username='noreply+paulhayes@wonderpl.com', password_hash='',
                            display_name='Paul Hayes',
                            avatar='hayes')
        account.users = [user0, user1]
        account.videos = [video]
        user0.connections = [AccountUserConnection(connection=user1)]
        user1.connections = [AccountUserConnection(
            connection=user0, message="Connect, collaborate, ... profit!")]
        db.session.add(account)
        db.session.flush()
        video.comments = [VideoComment(comment='I like this!', timestamp=10,
                                       user_type='collaborator',
                                       user_id=video.collaborators[0].id)]

        reg_tokens = [RegistrationToken.new(recipient).id]

        db.session.commit()
        return video, account, reg_tokens

    with current_app.test_request_context():
        db.create_all()
        video, account, reg_tokens = _create_test_video()
        emails = dict(
            beta_invite=(account_admin.send_beta_invite_emails,
                         (reg_tokens,)),
            welcome=(account_forms.send_welcome_email,
                     (account.users[0].id,)),
            connect=(account_forms.send_connection_invite_email,
                     (account.users[1].id, account.users[0].id)),
            acceptance=(account_forms.send_connection_acceptance_email,
                        (account.users[1].id, account.users[0].id)),
            processed_error=(video_forms.send_processed_email,
                             (video.id, 'Duplicate video content')),
            processed=(video_forms.send_processed_email,
                       (video.id,)),
            published=(video_forms.send_published_email,
                       (video.id, 'ch123', 'vi123')),
            invite=(video_forms.send_collaborator_invite_email,
                    (video.collaborators[0].id, account.users[0].id)),
            comments=(video_forms.send_comment_notifications,
                      (video.id, video.comments[0].user_type, video.comments[0].user_id)),
        )
        try:
            f, args = emails[email_type]
        except KeyError:
            print >>sys.stderr, 'email_type must be one of: %s' % ', '.join(emails)
        else:
            f(*args)


@manager.command
def dbshell(slave=False):
    """Run psql for the configured database."""
    from sqlalchemy import create_engine
    dburl = current_app.config['SLAVE_DATABASE_URL' if slave else 'DATABASE_URL']
    engine = create_engine(dburl)
    assert engine.dialect.name == 'postgresql'
    env = os.environ
    env['PATH'] = '/usr/bin:/bin'
    args = ['psql']
    if engine.url.username:
        args += ['-U', engine.url.username]
    if engine.url.host:
        args.extend(['-h', engine.url.host])
    if engine.url.port:
        args.extend(['-p', str(engine.url.port)])
    if engine.url.password:
        env['PGPASSWORD'] = engine.url.password
    args += [engine.url.database]
    try:
        os.execvpe(args[0], args, env)
    except OSError, e:
        print >>sys.stderr, '%s: %s' % (args[0], e.args[1])


def run(*args):
    # XXX: Need to import here before manager is run to ensure additional
    # commands are registered
    for mod in 'account', 'video':
        import_string('wonder.romeo.%s.commands' % mod)

    if args:
        return manager.handle(sys.argv[0], args)
    else:
        return manager.run()
