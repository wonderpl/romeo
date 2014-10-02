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


class ArticlesFeatured(db.Model):
    __tablename__ = 'article_featured'

    id = Column('id', primary_key=True)
    article_type = Column('article_type', nullable=False)
    article_url = Column('article_url', nullable=False)
    title = Column('title', nullable=False)
    author = Column('author_name', nullable=False)
    summary = Column('summary', nullable=False)
    content = Column('content', nullable=False)
    published_date = Column('published_date', nullable=False, default=func.now())
    featured_image = Column('featured_image', nullable=False)

    # should get category as well
