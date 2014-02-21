from random import randint
from functools import wraps
from sqlalchemy.util import safe_reraise
from wonder.romeo import db


def genid(size=8):
    def _genid(mapper, connection, target):
        if not target.id:
            target.id = randint(10 ** (size - 1), 10 ** size)
    return _genid


def commit_on_success(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            result = f(*args, **kwargs)
            db.session.commit()
        except:
            with safe_reraise():
                db.session.rollback()
        else:
            return result
    return wrapper
