from PIL import Image
from cStringIO import StringIO
from fixture import DataSet, SQLAlchemyFixture, NamedDataStyle
from flask import current_app
from wonder.romeo import db, cache
from wonder.romeo.account import models as account_models
from wonder.romeo.video import models as video_models


dbfixture = SQLAlchemyFixture(
    session=db.session,
    # get models from both account and video:
    env=dict(account_models.__dict__.items() + video_models.__dict__.items()),
    style=NamedDataStyle()
)


def genimg(size=(1, 1), format='png'):
    buf = StringIO()
    Image.new('RGB', size).save(buf, format)
    buf.seek(0)
    return buf


class AccountData(DataSet):
    class Account1:
        id = 1
        name = 'account1'


class AccountUserData(DataSet):
    class AccountUser1:
        id = 1
        account_id = 1
        username = 'noreply+1@wonderpl.com'
        password_hash = ''


class VideoData(DataSet):
    class Video1:
        id = 1
        account_id = 1
        title = 'Video 1'
        external_id = 'xx'
        filename = 'fffffffff'
        status = 'ready'

    class Video2:
        id = 2
        account_id = 1
        title = 'Video 2'
        external_id = 'yy'
        filename = 'ggggggggg'
        status = 'published'


class VideoTagData(DataSet):
    class VideoTag1:
        account_id = 1
        label = 'Collection 1'
        dolly_channel = 'ccccc'


class VideoTagVideoData(DataSet):
    class VideoTagVideo1:
        video = VideoData.Video2
        tag = VideoTagData.VideoTag1


def loaddata():
    datasets = [d for d in globals().values() if type(d) is type(DataSet) and d is not DataSet]

    with current_app.app_context():
        dbfixture.data(*datasets).setup()

    db.session.commit()

    cache.set('dolly_categories', [dict(id=1, name='Food', sub_categories=[])])
