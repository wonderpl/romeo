import re
from urlparse import urljoin
from itsdangerous import URLSafeSerializer
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum,
    PrimaryKeyConstraint, UniqueConstraint, func, event, null)
from sqlalchemy.orm import relationship, backref
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.ext.associationproxy import association_proxy
from flask import session, url_for, current_app, json
from wonder.romeo import db
from wonder.romeo.core.db import genid
from wonder.romeo.account.models import Account, AccountUser


VIDEO_STATUS = 'uploading', 'processing', 'error', 'ready', 'published'
USER_TYPE = 'account_user', 'collaborator'


def _clone_model_instance(src, cls=None, exclude=()):
    cls = cls or src.__class__
    new = cls()
    new._source_id = src.id
    for col in cls.__table__.c:
        if col.primary_key or col.foreign_keys or col.name in exclude:
            continue
        setattr(new, col.name, getattr(src, col.name))
    return new


class Video(db.Model):
    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False)
    deleted = Column(Boolean(), nullable=False, server_default='false', default=False)
    status = Column(Enum(*VIDEO_STATUS, name='video_status'), nullable=False, default=VIDEO_STATUS[0])
    public = Column(Boolean, nullable=False, default=True, server_default='true')
    date_added = Column(DateTime(), nullable=False, default=func.now())
    date_updated = Column(DateTime(), nullable=False, default=func.now(), onupdate=func.now())
    title = Column(String(256), nullable=False)
    duration = Column(Integer, nullable=False, server_default='0')
    filename = Column(String(16))
    external_id = Column(String(32))
    category = Column(String(8))
    search_keywords = Column(String(1024))
    hosted_url = Column(String(1024))
    player_logo_filename = Column(String(128))
    dolly_instance = Column(String(128))

    account = relationship(Account, backref=backref('videos', cascade='all, delete-orphan'))

    tags = association_proxy('tags_associations', 'tag')

    @property
    def href(self):
        return url_for('api.video', video_id=self.id)

    @property
    def public_href(self):
        return self.href + '?public'

    @property
    def player_url(self):
        if self.dolly_instance:
            return current_app.config['DOLLY_EMBED_URL_FMT'].format(
                instanceid=self.dolly_instance)
        else:
            return url_for('video.video_embed', videoid=self.id, _external=True)

    @property
    def web_url(self):
        """Link to angular view for this video."""
        return url_for('root.app', _external=True) + '#/video/' + str(self.id)

    @property
    def filepath(self):
        return self.get_video_filepath(self.account_id, self.filename)

    @property
    def thumbnail(self):
        return self.get_thumbnail_url()

    @property
    def player_parameters(self):
        params = VideoPlayerParameter.query.filter_by(video_id=self.id)
        return dict(params.values('name', 'value'))

    @property
    def download_name(self):
        name = re.sub(r'\W+', '', self.title.replace(' ', '_'))
        name = re.sub('_+', '_', name).strip('_')
        # TODO: check file type
        return name + '.mp4'

    @classmethod
    def get_video_filepath(cls, account_id, filename, base='video'):
        """Return unique video file name."""
        return '/'.join((base, str(account_id), filename))

    @classmethod
    def get_cover_image_filepath(cls, filename, base='images/cover', label=None):
        return '/'.join((base, (label or 'original'), filename))

    @classmethod
    def get_image_filepath(cls, account_id, filename, imagetype, label=None, base='i'):
        return '/'.join(filter(None, (base, str(account_id), imagetype, (label or 'original'), filename)))

    def get_thumbnail_url(self):
        thumbnails = list(self.thumbnails)
        if thumbnails:
            if len(thumbnails) == 1:
                return thumbnails[0].url
            else:
                thumbnails = sorted(self.thumbnails, key=lambda t: t.width, reverse=True)
                return next(t.url for t in thumbnails[1:]
                            if t.width <= current_app.config['COVER_THUMBNAIL_DEFAULT'])

    def get_player_logo_url(self, label=None):
        if self.player_logo_filename:
            path = self.get_image_filepath(self.account_id, self.player_logo_filename, 'logo', label=label)
            return urljoin(current_app.config['MEDIA_BASE_URL'], path)

    def set_player_logo(self, filename):
        self.player_logo_filename = filename

    player_logo = property(get_player_logo_url, set_player_logo)

    @property
    def default_locale_meta(self):
        if not hasattr(self, '_default_locale_meta'):
            try:
                self._default_locale_meta =\
                    VideoLocaleMeta.query.filter_by(video_id=self.id, locale='').one()
            except NoResultFound:
                self._default_locale_meta = VideoLocaleMeta(locale='', title=self.title)
                self.locale_meta.append(self._default_locale_meta)
        return self._default_locale_meta

    def _default_locale_meta_property(property):
        return (
            lambda self: getattr(self.default_locale_meta, property),
            lambda self, value: setattr(self.default_locale_meta, property, value),
        )

    strapline = property(*_default_locale_meta_property('strapline'))
    description = property(*_default_locale_meta_property('description'))
    link_url = property(*_default_locale_meta_property('link_url'))
    link_title = property(*_default_locale_meta_property('link_title'))

    def record_workflow_event(self, type, value=None):
        self.workflow_events.append(VideoWorkflowEvent.create(type, value))

    def get_dolly_data(self, with_thumbnails=False, description_extra=False):
        data = dict(
            id=self.id,
            title=self.title,
            public=self.public,
            status=self.status,
            category=self.category,
            player_logo_url=self.player_logo,
            video=dict(
                source='ooyala',
                source_id=self.external_id,
                source_username=self.account.name,
                source_date_uploaded=self.date_added.isoformat(),
                source_player_parameters=self.player_parameters,
                thumbnail_url=self.thumbnail,
                duration=self.duration,
                description=self.description,
                link_url=self.link_url,
                link_title=self.link_title,
            ),
        )
        if with_thumbnails:
            data['thumbnails'] = [
                {f: getattr(thumbnail, f) for f in ('url', 'width', 'height')}
                for thumbnail in self.thumbnails
            ]
        # hack to include extra properties in data stored on dolly
        if description_extra:
            extra = 'EXTRA_META\n' + json.dumps(dict(
                source_player_parameters=self.player_parameters
            ))
            data['video']['description'] = (data['video']['description'] or '') + extra
        return data

    def clone(self):
        new = _clone_model_instance(self, exclude=(
            'date_added', 'date_updated', 'dolly_instance', 'hosted_url'))
        for rel in 'thumbnails', 'locale_meta', '_player_parameters':
            setattr(new, rel, [i.clone() for i in getattr(self, rel)])
        return new


class VideoThumbnail(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id, ondelete='CASCADE'), nullable=False)
    url = Column(String(1024), nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)

    video = relationship(Video, backref=backref('thumbnails', cascade='all, delete-orphan'))

    @classmethod
    def from_cover_image(cls, cover_image, account_id, label=None, size=None):
        width, height = size if size else (0, 0)
        path = Video.get_image_filepath(account_id, cover_image, 'cover', label)
        url = urljoin(current_app.config['MEDIA_BASE_URL'], path)
        return cls(url=url, width=width, height=height)

    def clone(self):
        return _clone_model_instance(self)


class VideoLocaleMeta(db.Model):
    __table_args__ = (
        UniqueConstraint('video', 'locale'),
    )

    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    locale = Column(String(32), nullable=False)
    link_url = Column(String(2048))
    link_title = Column(String(1024))
    title = Column(String(256))
    strapline = Column(String(1024))
    description = Column(Text)

    video = relationship(Video, backref=backref('locale_meta', cascade='all, delete-orphan'))

    def clone(self):
        return _clone_model_instance(self)


class VideoPlayerParameter(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    name = Column(String(32), nullable=False)
    value = Column(String(1024), nullable=False)

    video = relationship(Video, backref=backref('_player_parameters', cascade='all, delete-orphan'))

    def clone(self):
        return _clone_model_instance(self)


class VideoTag(db.Model):
    id = Column(Integer, primary_key=True)
    account_id = Column('account', ForeignKey(Account.id), nullable=False)
    label = Column(String(128), nullable=False)
    description = Column(String(200), nullable=False, server_default='')
    dolly_channel = Column(String(128))

    account = relationship(Account, backref=backref('tags', cascade='all, delete-orphan'))

    def __unicode__(self):
        return self.label

    def __repr__(self):
        return 'VideoTag(id={t.id!r}, label={t.label!r})'.format(t=self)

    @property
    def href(self):
        return url_for('api.tag', tag_id=self.id)

    @property
    def public(self):
        return bool(self.dolly_channel)

    @public.setter
    def public(self, value):
        pass

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
    tag = relationship(VideoTag, backref=backref('videos_associations', cascade='all, delete-orphan'))

    @property
    def href(self):
        return url_for('api.videotagvideo', video_id=self.video_id, tag_id=self.tag_id)


class VideoWorkflowEvent(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    user_id = Column(ForeignKey(AccountUser.id), nullable=True)
    event_date = Column(DateTime(), nullable=False, default=func.now())
    event_type = Column(String(32), nullable=False)
    event_value = Column(String(1024))

    video = relationship(Video, backref=backref('workflow_events', cascade='all, delete-orphan'))
    user = relationship(AccountUser)

    @classmethod
    def create(cls, type, value=None):
        user_id = session.get('user_id') if session else None
        return cls(event_type=type, event_value=value, user_id=user_id)


class VideoComment(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    date_added = Column(DateTime(), nullable=False, default=func.now())
    user_type = Column(Enum(*USER_TYPE, name='user_type'), nullable=False)
    user_id = Column(Integer, nullable=False)
    comment = Column(String(1024), nullable=False)
    timestamp = Column(Integer)
    notification_sent = Column(Boolean(), nullable=False, server_default='false', default=False)
    resolved = Column(Boolean(), nullable=False, server_default='false', default=False)

    video = relationship(Video, backref=backref('comments', cascade='all, delete-orphan'))

    @property
    def href(self):
        return url_for('api.videocomment', video_id=self.video_id, comment_id=self.id)

    @classmethod
    def comments_for_video(cls, video_id, comment_ids=None):
        """Return comments for a video with commenter name & email."""
        video_comments = cls.query.filter_by(video_id=video_id)
        if comment_ids:
            video_comments = video_comments.filter(cls.id.in_(comment_ids))

        account_comments = video_comments.join(
            AccountUser,
            (VideoComment.user_type == 'account_user') &
            (VideoComment.user_id == AccountUser.id)
        ).with_entities(
            VideoComment,
            AccountUser.display_name.label('name'),
            AccountUser.username.label('email'),
            AccountUser.avatar_filename,
            AccountUser.account_id,
        )

        collab_comments_with_user = video_comments.join(
            VideoCollaborator,
            (VideoComment.user_type == 'collaborator') &
            (VideoComment.user_id == VideoCollaborator.id)
        ).join(
            AccountUser,
            AccountUser.id == VideoCollaborator.account_user_id
        ).with_entities(
            VideoComment,
            AccountUser.display_name.label('name'),
            AccountUser.username.label('email'),
            AccountUser.avatar_filename,
            AccountUser.account_id,
        )

        collab_comments = video_comments.join(
            VideoCollaborator,
            (VideoComment.user_type == 'collaborator') &
            (VideoComment.user_id == VideoCollaborator.id) &
            (VideoCollaborator.account_user_id.is_(None))
        ).with_entities(
            VideoComment,
            VideoCollaborator.name,
            VideoCollaborator.email,
            null().label('avatar_filename'),
            null().label('account_id'),
        )

        return account_comments.union_all(
            collab_comments_with_user, collab_comments).order_by(VideoComment.date_added)


class VideoCollaborator(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    can_download = Column(Boolean(), nullable=False, server_default='false', default=False)
    can_comment = Column(Boolean(), nullable=False, server_default='false', default=False)
    email = Column(String(1024), nullable=False)
    name = Column(String(1024))
    account_user_id = Column('account_user', ForeignKey(AccountUser.id))

    video = relationship(Video, backref=backref('collaborators', cascade='all, delete-orphan'))

    @property
    def token(self):
        return self.get_token(self.id)

    @property
    def href(self):
        return url_for('api.videocollaborator', video_id=self.video_id, collaborator_id=self.id)

    @classmethod
    def get_token(cls, id):
        serializer = URLSafeSerializer(current_app.secret_key)
        return serializer.dumps(dict(collaborator=id))


class VideoSeoEmbed(db.Model):
    id = Column(Integer, primary_key=True)
    video_id = Column('video', ForeignKey(Video.id), nullable=False)
    link_url = Column(String(2048))
    title = Column(String(256), nullable=False)
    description = Column(String(256))


event.listen(Video, 'before_insert', genid())
