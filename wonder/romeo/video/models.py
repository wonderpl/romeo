from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Enum,
    PrimaryKeyConstraint, func, event)
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.associationproxy import association_proxy
from flask import session
from wonder.romeo import db
from wonder.romeo.core.db import genid
from wonder.romeo.account.models import Account, AccountUser


VIDEO_STATUS = 'uploading', 'processing', 'error', 'ready', 'published'


class Video(db.Model):
    __tablename__ = 'video'

    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False)
    deleted = Column(Boolean(), nullable=False, server_default='false', default=False)
    status = Column(Enum(*VIDEO_STATUS, name='video_status'), nullable=False)
    public = Column(Boolean, nullable=False, default=True, server_default='true')
    date_added = Column(DateTime(), nullable=False, default=func.now())
    date_updated = Column(DateTime(), nullable=False, default=func.now(), onupdate=func.now())
    title = Column(String(256), nullable=False)
    description = Column(String(256))
    duration = Column(Integer, nullable=False, server_default='0')
    external_id = Column(String(32))
    category = Column(String(8))

    account = relationship(Account, backref='videos')

    tags = association_proxy("tags_associations", "tag")

    def record_workflow_event(self, type, value=None):
        self.workflow_events.append(VideoWorkflowEvent.create(type, value))


class VideoThumbnail(db.Model):
    __tablename__ = 'video_thumbnail'

    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id, ondelete='CASCADE'), nullable=False)
    url = Column(String(1024), nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)

    video = relationship(Video, backref=backref('thumbnails', cascade='all, delete-orphan'))


class VideoLocaleMeta(db.Model):
    __tablename__ = 'video_locale_meta'

    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    locale = Column(String(32), nullable=False)
    link_url = Column(String(2048))
    link_title = Column(String(1024))
    title = Column(String(256))
    description = Column(String(256))

    video = relationship(Video, backref='locale_meta')


class VideoTag(db.Model):
    __tablename__ = 'video_tag'

    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False)
    label = Column(String(128), nullable=False)
    dolly_channel = Column(String(128))

    account = relationship(Account, backref='tags')

    def __unicode__(self):
        return self.label

    def __repr__(self):
        return 'VideoTag(id={t.id!r}, label={t.label!r})'.format(t=self)

    @classmethod
    def create_from_dolly_channels(cls, account_id, channels):
        existing = dict(cls.query.filter_by(account_id=account_id).
                        values(cls.dolly_channel, cls.label))
        return [
            cls(
                account_id=account_id,
                dolly_channel=channel['id'],
                label=channel['title'],
            )
            for channel in channels
            if channel['id'] not in existing and not channel.get('favourites')
        ]


class VideoTagVideo(db.Model):
    __tablename__ = 'video_tag_video'
    __table_args__ = (
        PrimaryKeyConstraint('video', 'tag'),
    )

    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    tag_id = Column('tag', ForeignKey(VideoTag.id), nullable=False)

    video = relationship(Video, backref='tags_associations')
    tag = relationship(VideoTag, backref='videos_associations')


class VideoWorkflowEvent(db.Model):
    __tablename__ = 'video_workflow_event'

    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    user_id = Column(ForeignKey(AccountUser.id), nullable=True)
    event_date = Column(DateTime(), nullable=False, default=func.now())
    event_type = Column(String(32), nullable=False)
    event_value = Column(String(1024))

    video = relationship(Video, backref='workflow_events')
    user = relationship(AccountUser)

    @classmethod
    def create(cls, type, value=None):
        user_id = session.get('user_id')
        return cls(event_type=type, event_value=value, user_id=user_id)


event.listen(Video, 'before_insert', genid())
