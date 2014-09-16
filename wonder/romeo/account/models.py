from urlparse import urljoin
from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, PrimaryKeyConstraint, DateTime, Enum, CHAR, event, func)
from sqlalchemy.orm import relationship, backref
from werkzeug.routing import RequestRedirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, flash, session, current_app
from flask.ext.login import UserMixin
from wonder.romeo import db, login_manager
from wonder.romeo.core import dolly
from wonder.romeo.core.db import genid


CONNECTION_STATE = 'pending', 'accepted'

ACCOUNT_TYPES = 'collaborator', 'content_owner'

EXTERNAL_SYSTEMS = 'email', 'facebook', 'twitter', 'google', 'apns', 'dolly'
EXTERNAL_SYSTEM_CHOICES = zip(EXTERNAL_SYSTEMS, map(str.capitalize, EXTERNAL_SYSTEMS))


class Account(db.Model):
    __tablename__ = 'account'

    id = Column(Integer, primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    account_type = Column(Enum(*ACCOUNT_TYPES, name='account_type'), nullable=False,
                          default=ACCOUNT_TYPES[0])
    name = Column(String(128), nullable=False)
    payment_token = Column(String(256), nullable=True)
    dolly_user = Column(CHAR(22))
    dolly_token = Column(String(128))

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
    __tablename__ = 'account_user'

    id = Column(Integer, primary_key=True)
    date_added = Column(DateTime(), nullable=False, default=func.now())
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

    account = relationship(Account, backref=backref('users', cascade='all, delete-orphan'))

    avatar = property(*_image_field_accessors('avatar'))
    profile_cover = property(*_image_field_accessors('profile_cover'))

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
    __tablename__ = 'account_user_auth_token'

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


class CollaborationMixin(object):

    def get_collaborator(self, video_id, permission=True):
        from wonder.romeo.video.models import VideoCollaborator
        collaborators = VideoCollaborator.query.filter_by(video_id=video_id)
        collaborator = None

        if session.get('collaborator_ids'):
            collaborator = collaborators.filter(
                VideoCollaborator.id.in_(session['collaborator_ids']),
            ).first()

        if self.id and not collaborator:
            collaborator = collaborators.filter(
                VideoCollaborator.account_user_id == self.id
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


event.listen(Account, 'before_insert', genid())
event.listen(AccountUser, 'before_insert', genid())
