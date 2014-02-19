from sqlalchemy import Column, Integer, String, Boolean
from werkzeug.security import generate_password_hash, check_password_hash
from flask.ext.login import UserMixin
from wonder.romeo import db, login_manager


class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(128), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    active = Column(Boolean, nullable=False, default=True, server_default='true')

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
            self._user = User.query.get(self.id)
        return self._user

    def __getattr__(self, name):
        return getattr(self.user, name)


@login_manager.user_loader
def load_user(userid):
    return UserProxy(userid)
