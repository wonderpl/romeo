from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, CHAR, event
from sqlalchemy.orm import relationship
from werkzeug.routing import RequestRedirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, flash, session
from flask.ext.login import UserMixin
from wonder.romeo import db, login_manager
from wonder.romeo.core.db import genid


class Account(db.Model):
    __tablename__ = 'account'

    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    dolly_user = Column(CHAR(22))
    dolly_token = Column(String(128))


class AccountUser(db.Model):
    __tablename__ = 'account_user'

    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False, index=True)
    username = Column(String(128), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    active = Column(Boolean, nullable=False, default=True, server_default='true')
    display_name = Column(String(256))
    avatar_url = Column(String(256))

    account = relationship(Account, backref='users')

    @classmethod
    def get_from_credentials(cls, username, password):
        user = cls.query.filter_by(active=True, username=username).first()
        if user and user.check_password(password):
            return user

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
        return check_password_hash(self.password_hash, password)


class CollaborationMixin(object):

    def get_collaborator(self, video_id, permission=True):
        if session.get('collaborator_ids'):
            from wonder.romeo.video.models import VideoCollaborator
            collaborator = VideoCollaborator.query.filter(
                VideoCollaborator.video_id == video_id,
                VideoCollaborator.id.in_(session['collaborator_ids']),
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
