import os
from base64 import b32encode
from cStringIO import StringIO
from urlparse import urljoin
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum, CHAR,
    ForeignKey, PrimaryKeyConstraint, event, func, text)
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.orm import relationship, backref, deferred
from sqlalchemy.orm.attributes import instance_state, get_history
from werkzeug.routing import RequestRedirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, flash, session, current_app
from flask.ext.login import UserMixin
from wonder.common.sqs import background_on_sqs
from wonder.romeo import db, login_manager
from wonder.romeo.core import dolly
from wonder.romeo.core.s3 import download_file, media_bucket
from wonder.romeo.core.db import genid


CONNECTION_STATE = 'pending', 'accepted'

ACCOUNT_TYPES = 'collaborator', 'content_owner'

EXTERNAL_SYSTEMS = 'email', 'facebook', 'twitter', 'google', 'yahoo', 'live', 'apns', 'dolly'
EXTERNAL_SYSTEM_CHOICES = zip(EXTERNAL_SYSTEMS, map(str.capitalize, EXTERNAL_SYSTEMS))


class Account(db.Model):
    id = Column(Integer, primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    account_type = Column(Enum(*ACCOUNT_TYPES, name='account_type'), nullable=False,
                          default=ACCOUNT_TYPES[0])
    name = Column(String(128), nullable=False)
    payment_token = Column(String(256), nullable=True)
    dolly_user = Column(CHAR(22))
    dolly_token = Column(String(128))

    def __unicode__(self):
        return self.name

    @property
    def href(self):
        return url_for('api.account', account_id=self.id)

    @property
    def public_href(self):
        return self.href + '?public'

    def set_account_type(self, account_type):
        self.account_type = account_type
        if account_type == 'content_owner' and not self.dolly_user:
            first_user = AccountUser.query.filter_by(account_id=self.id).value('id')
            dollydata = dolly.login(first_user)
            self.dolly_user = dollydata['user_id']
            self.dolly_token = dollydata['access_token']
            _push_profile_changes_to_dolly(first_user)


def _image_field_accessors(field, default_thumbnail=True):
    def getter(self, label=None):
        filename = getattr(self, '%s_filename' % field)
        if filename:
            label = default_thumbnail
            if label is True:
                label = str(current_app.config['%s_THUMBNAIL_SIZES' % field.upper()][0][0])
            path = self.get_image_filepath(self.account_id, filename, field, label)
            return urljoin(current_app.config['MEDIA_BASE_URL'], path)

    def setter(self, filename):
        setattr(self, '%s_filename' % field, filename)

    return getter, setter


class AccountUser(db.Model):
    id = Column(Integer, primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    date_updated = Column(DateTime(), nullable=False, default=func.now(), onupdate=func.now())
    account_id = Column('account', ForeignKey(Account.id), nullable=False, index=True)
    username = Column(String(128), nullable=False)
    password_hash = Column(String(128))
    active = Column(Boolean, nullable=False, default=True, server_default='true')
    display_name = Column(String(256))
    location = Column(CHAR(2))
    title = Column(String(256))
    description = Column(String(1024))
    website_url = Column(String(256))
    search_keywords = Column(String(1024))
    avatar_filename = Column(String(256))
    profile_cover_filename = Column(String(256))
    contactable = Column(Boolean, nullable=False, default=True, server_default='true')
    search_vector = deferred(Column(TSVECTOR))

    account = relationship(Account, backref=backref('users', cascade='all, delete-orphan'))

    avatar = property(*_image_field_accessors('avatar'))
    profile_cover = property(*_image_field_accessors('profile_cover'))

    def __unicode__(self):
        return self.name

    @classmethod
    def get_from_credentials(cls, username, password):
        user = cls.query.filter(
            cls.active == True, func.lower(cls.username) == username.lower()).first()
        if user and user.check_password(password):
            return user

    @classmethod
    def get_image_filepath(cls, account_id, filename, imagetype, label=None, base='i'):
        return '/'.join(filter(None, (base, str(account_id), imagetype, (label or 'original'), filename)))

    @property
    def href(self):
        return url_for('api.user', user_id=self.id)

    @property
    def public_href(self):
        return self.href + '?public'

    @property
    def name(self):
        return self.display_name or self.username

    @property
    def email(self):
        return self.username

    def is_active(self):
        return self.active

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return self.password_hash and check_password_hash(self.password_hash, password)


class AccountUserAuthToken(db.Model):
    id = Column(Integer, primary_key=True)
    account_user_id = Column('account_user', ForeignKey(AccountUser.id), nullable=False)
    external_system = Column(Enum(*EXTERNAL_SYSTEMS, name='external_system'), nullable=False)
    external_uid = Column(String(1024), nullable=False)
    external_token = Column(String(1024), nullable=False)
    permissions = Column(String(1024), nullable=True)
    meta = Column(String(1024), nullable=True)
    expires = Column(DateTime(), nullable=True)

    account_user = relationship(AccountUser, backref='auth_tokens')


class AccountUserConnection(db.Model):
    __tablename__ = 'account_user_connection'
    __table_args__ = (
        PrimaryKeyConstraint('account_user', 'connection'),
    )

    account_user_id = Column('account_user', ForeignKey(AccountUser.id), nullable=False)
    connection_id = Column('connection', ForeignKey(AccountUser.id), nullable=False)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    state = Column(Enum(*CONNECTION_STATE, name='connection_state'), nullable=False, default='pending')
    message = Column(String(1024), nullable=True)

    account_user = relationship(AccountUser, backref='connections', foreign_keys=[account_user_id])
    connection = relationship(AccountUser, foreign_keys=[connection_id])

    @property
    def href(self):
        return url_for('api.userconnection', user_id=self.account_user_id, connection_id=self.connection_id)


class RegistrationToken(db.Model):

    id = Column(String(128), primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    recipient = Column(String(256), nullable=False)
    account_user_id = Column('account_user', ForeignKey(AccountUser.id))

    account_user = relationship(AccountUser)

    @classmethod
    def new(cls, recipient):
        id = b32encode(os.urandom(5))
        token = RegistrationToken(id=id, recipient=recipient)
        db.session.add(token)
        return token


class InviteRequest(db.Model):

    id = Column(Integer, primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    email = Column(String(256), nullable=False)
    name = Column(String(256))
    message = Column(String(1024))


class AccountUserVisit(db.Model):

    id = Column(Integer, primary_key=True)
    visitor_user_id = Column('visitor', Integer(), ForeignKey(AccountUser.id), nullable=False)
    profile_user_id = Column('profile', Integer(), ForeignKey(AccountUser.id), nullable=False)
    visit_date = Column(DateTime(), nullable=False, default=func.now())
    notified = Column(Boolean, default=False)

    profile_user = relationship(AccountUser, foreign_keys=[profile_user_id])
    visitor_user = relationship(AccountUser, foreign_keys=[visitor_user_id])

    @property
    def href(self):
        return url_for('api.user', user_id=self.profile_user_id)

    @property
    def public_href(self):
        return self.href + '?public'

    @staticmethod
    def unique_visits(visits, seen=dict()):
        for visit in visits:
            userid = visit.visitor_user_id
            if userid and userid in seen:
                seen[userid] += 1
                continue
            seen[userid] = 1

            yield visit

    @staticmethod
    def visit_item(visit, date=False):
        if date:
            user = visit
        else:
            user = visit.visitor_user
            date = visit.visit_date

        return dict(
            id=user.id,
            public_href=user.public_href,
            display_name=user.display_name,
            avatar=user.avatar,
            title=user.title,
            visit_date=date.isoformat(),
        )

    @staticmethod
    def get_all_visits_in_last_7_days(profile, query_limit):
        return AccountUser.query.filter(
            AccountUserVisit.profile_user_id == profile.id,
            AccountUserVisit.visit_date > func.now() - text("interval '7 day'"),
            AccountUserVisit.notified == False,
        ).join(
            AccountUserVisit,
            AccountUserVisit.visitor_user_id == AccountUser.id
        ).with_entities(
            AccountUser,
            func.max(AccountUserVisit.visit_date)
        ).group_by(AccountUser.id).order_by(func.count().desc()).limit(query_limit)


class CollaborationMixin(object):

    def get_collaborator(self, video_id, permission=True):
        from wonder.romeo.video.models import VideoCollaborator
        collaborators = VideoCollaborator.query.filter_by(video_id=video_id)
        collaborator = None

        # check session
        if session.get('collaborator_ids'):
            collaborator = collaborators.filter(
                VideoCollaborator.id.in_(session['collaborator_ids']),
            ).first()

        # then match on user id
        if self.id and not collaborator:
            collaborator = collaborators.filter(
                VideoCollaborator.account_user_id == self.id
            ).first()

        # finally fall back on email match
        if self.id and self.email and not collaborator:
            collaborator = collaborators.filter(
                func.lower(VideoCollaborator.email) == func.lower(self.email)
            ).first()

        if collaborator and (permission is True or
                             getattr(collaborator, 'can_' + permission)):
            return collaborator

    def has_collaborator_permission(self, video_id, permission):
        return bool(self.get_collaborator(video_id, permission))


class UserProxy(UserMixin, CollaborationMixin):
    """Proxy User instance so that login_required doesn't unnecessarily hit the db."""
    __slots__ = ('id', '_user')

    def __init__(self, id, user=None):
        self.id = id
        self._user = user

    @property
    def user(self):
        if not self._user:
            self._user = AccountUser.query.filter_by(id=self.id, active=True).first()
            if not self._user:
                flash('session expired')
                raise RequestRedirect(url_for('account.logout'))
        return self._user

    def is_active(self):
        return self.user.active

    def __getattr__(self, name):
        return getattr(self.user, name)


class CollaborationUser(UserMixin, CollaborationMixin):
    id = None
    account_id = None


@login_manager.user_loader
def load_user(userid):
    try:
        userid = int(userid)
    except ValueError:
        return
    else:
        return UserProxy(userid)


@login_manager.request_loader
def load_user_or_collaborator(request):
    if 'collaborator_ids' in session:
        return CollaborationUser()


@background_on_sqs
def _push_profile_changes_to_dolly(account_user_id, changes='ALL'):
    # TODO: assert first user in account only
    user = AccountUser.query.get(account_user_id)
    account = user and user.account
    if account and account.dolly_user:
        dolly_user = dolly.DollyUser(account.dolly_user, account.dolly_token)
        changed = lambda f: getattr(user, f, None) and (changes == 'ALL' or f in changes)
        image_file = lambda filename, field: StringIO(
            download_file(media_bucket, user.get_image_filepath(account.id, filename, field)))
        if changed('display_name'):
            dolly_user.set_display_name(user.display_name)
        if changed('description'):
            dolly_user.set_description(user.description)
        if changed('avatar_filename'):
            dolly_user.set_avatar_image(image_file(user.avatar_filename, 'avatar'))
        if changed('profile_cover_filename'):
            dolly_user.set_profile_image(image_file(user.profile_cover_filename, 'profile_cover'))


@event.listens_for(AccountUser, 'after_update')
def _account_user_after_update(mapper, connection, target):
    changes = [a for a in instance_state(target).committed_state
               if get_history(target, a).has_changes()]
    _push_profile_changes_to_dolly(target.id, changes)


event.listen(Account, 'before_insert', genid())
event.listen(AccountUser, 'before_insert', genid())
