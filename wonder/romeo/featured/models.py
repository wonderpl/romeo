from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, PrimaryKeyConstraint, DateTime, Enum, CHAR, event, func)
from sqlalchemy.orm import relationship
from wonder.romeo import db
from wonder.romeo.account.models import AccountUser

class AccountUserFeatured(db.Model):
    __tablename__ = 'account_user_featured'
    __table_args__ = (
        PrimaryKeyConstraint('user'),
    )

    account_user_id = Column('user', ForeignKey(AccountUser.id), nullable=False)
    account_user = relationship(AccountUser, foreign_keys=[account_user_id], uselist=False)


    @property
    def href(self):
        return url_for('api.user', user_id=self.account_user_id)

    @property
    def public_href(self):
        return self.href + '?public'
