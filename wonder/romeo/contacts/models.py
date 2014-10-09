from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, UniqueConstraint, func
from sqlalchemy.orm import relationship
from wonder.romeo import db
from wonder.romeo.account.models import AccountUser, EXTERNAL_SYSTEMS


class AccountUserContact(db.Model):
    __table_args__ = (
        UniqueConstraint('account_user', 'external_system', 'external_uid'),
    )

    id = Column(Integer, primary_key=True)
    account_user_id = Column('account_user', ForeignKey(AccountUser.id), nullable=False)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    external_system = Column(Enum(*EXTERNAL_SYSTEMS, name='external_system'), nullable=False)
    external_uid = Column(String(1024), nullable=False)
    display_name = Column(String(256))
    email = Column(String(256))

    account_user = relationship(AccountUser, backref='contacts')
