from functools import wraps
from werkzeug.routing import RequestRedirect
from flask.ext.login import current_user
from flask.ext import restful
from wonder.romeo import api


def login_required(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        if current_user.is_authenticated():
            try:
                return func(*args, **kwargs)
            except RequestRedirect as e:
                if e.message == '/logout':
                    return dict(error='expired_token'), 401
        else:
            return dict(error='invalid_token'), 401
    return decorator


def api_resource(path):
    def wrapper(cls):
        endpoint = cls.__name__.lower()
        if endpoint.endswith('resource'):
            endpoint = 'api.' + endpoint[:-8]
        api.add_resource(cls, path, endpoint=endpoint)
        return cls
    return wrapper


class Resource(restful.Resource):

    decorators = [login_required]
