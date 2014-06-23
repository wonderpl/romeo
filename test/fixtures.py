from PIL import Image
from cStringIO import StringIO
from fixture import DataSet, SQLAlchemyFixture, NamedDataStyle
from flask import current_app
from wonder.romeo import db, cache
from wonder.romeo.account import models as account_models
from wonder.romeo.video import models as video_models


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


def loaddata():
    modelmap = {}
    for models in account_models, video_models:
        modelmap.update(models.__dict__)

    datasets = [d for d in globals().values() if type(d) is type(DataSet) and d is not DataSet]

    fixture = SQLAlchemyFixture(session=db.session, env=modelmap, style=NamedDataStyle())
    with current_app.app_context():
        fixture.data(*datasets).setup()

    db.session.commit()

    cache.set('dolly_categories', [dict(id=1, name='Food', sub_categories=[])])
