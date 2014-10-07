from sqlalchemy import (
    Column, String, Integer, Text, ForeignKey, DateTime, Enum, func)
from flask import url_for
from sqlalchemy.orm import relationship
from wonder.romeo import db
from wonder.romeo.account.models import AccountUser


ARTICLE_TYPES = 'Blog', 'RFP', 'Feature', 'Video'


class FeaturedUser(db.Model):
    id = Column(Integer, primary_key=True)
    account_user_id = Column('user', Integer, ForeignKey(AccountUser.id), nullable=False)
    account_user = relationship(AccountUser, foreign_keys=[account_user_id], uselist=False)

    @property
    def href(self):
        return url_for('api.user', user_id=self.account_user_id)

    @property
    def public_href(self):
        return self.href + '?public'


class FeaturedArticle(db.Model):
    id = Column(Integer, primary_key=True)
    article_type = Column(Enum(*ARTICLE_TYPES, name='article_type'), nullable=False)
    article_url = Column(String(1024), nullable=False)
    title = Column(String(1024), nullable=False)
    author = Column('author_name', String(100), nullable=False)
    summary = Column(Text(), nullable=False)
    content = Column(Text(), nullable=False)
    published_date = Column(DateTime(), nullable=False, default=func.now())
    featured_image = Column(String(1024), nullable=False)

    # should get category as well
