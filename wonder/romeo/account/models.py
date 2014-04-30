import os
from urlparse import urljoin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, CHAR, event
from sqlalchemy.orm import relationship
from werkzeug.routing import RequestRedirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, flash, current_app
from flask.ext.login import UserMixin
from wonder.romeo import db, login_manager
from wonder.romeo.core.db import genid


class Account(db.Model):
    __tablename__ = 'account'

    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    dolly_user = Column(CHAR(22))
    dolly_token = Column(String(128))
    player_logo_filename = Column(String(128))

    def get_player_logo_filepath(self, size=None):
        if self.player_logo_filename:
            return 'images/logo/' + (size or 'original') + '/' + self.player_logo_filename

    def get_player_logo_url(self, size=None):
        path = self.get_player_logo_filepath(size)
        if path:
            return urljoin(current_app.config['MEDIA_BASE_URL'], path)

    @classmethod
    def get_random_player_logo_filename(cls):
        """Return unique file name for a player logo."""
        return os.urandom(8).encode('hex')


class AccountUser(db.Model):
    __tablename__ = 'account_user'

    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False, index=True)
    username = Column(String(128), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    active = Column(Boolean, nullable=False, default=True, server_default='true')

    account = relationship(Account, backref='users')

    @classmethod
    def get_from_credentials(cls, username, password):
        user = cls.query.filter_by(active=True, username=username).first()
        if user and user.check_password(password):
            return user

    def is_active(self):
        return self.active

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class UserProxy(UserMixin):
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


@login_manager.user_loader
def load_user(userid):
    try:
        userid = int(userid)
    except ValueError:
        return
    else:
        return UserProxy(userid)


event.listen(Account, 'before_insert', genid())
event.listen(AccountUser, 'before_insert', genid())
