from sqlalchemy import (
    Column, Integer, String, Text, Boolean, ForeignKey, PrimaryKeyConstraint, DateTime, Enum, CHAR, event, func)
from sqlalchemy.orm import relationship
from wonder.romeo import db
from wonder.romeo.account.models import AccountUser

ARTICLE_TYPES = 'Blog', 'RFP', 'Feature', 'Video'

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


class ArticlesFeatured(db.Model):
    __tablename__ = 'article_featured'

    id = Column('id', primary_key=True)
    article_type = Column(Enum(*ARTICLE_TYPES, name='account_type'), nullable=False)
    article_url = Column(String(1024), nullable=False)
    title = Column(String(1024), nullable=False)
    author = Column('author_name', String(100), nullable=False)
    summary = Column(Text(), nullable=False)
    content = Column(Text(), nullable=False)
    published_date = Column(DateTime(), nullable=False, default=func.now())
    featured_image = Column(String(1024), nullable=False)

    # should get category as well
