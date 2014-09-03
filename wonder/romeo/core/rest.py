from functools import wraps
from werkzeug.routing import RequestRedirect
from flask import request
from flask.ext.login import current_user
from flask.ext import restful
from flask.ext.restful.utils import unpack
from wonder.romeo import api, db


def support_bulk_save(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        if isinstance(request.json, list):
            results = []
            for item in list(request.json):
                request._cached_json = item
                results.append(unpack(f(*args, **kwargs)))
            results, status_codes, headers = zip(*results)
            if 400 in status_codes:
                db.session.rollback()
                status_code = 400
            else:
                status_code = 200
            return results, status_code
        else:
            return f(*args, **kwargs)
    return decorator


def cache_control(**cache_properties):
    def decorator(func):
        func._cache_control = cache_properties
        return func
    return decorator


def _cache_control(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        response = func(*args, **kwargs)

        try:
            # navigate the flask-restful view wrapper chain
            viewfunc = func.func_closure[0].cell_contents.view_class.get
        except Exception:
            viewfunc = func

        if hasattr(viewfunc, '_cache_control'):
            for k, v in viewfunc._cache_control.items():
                setattr(response.cache_control, k, v)
        else:
            if 'public' in request.args:
                response.cache_control.max_age = 3600
            else:
                # Private, no-cache by default
                response.cache_control.private = True
                response.cache_control.no_cache = True

        if response.cache_control.max_age:
            if not response.cache_control.private:
                response.cache_control.public = True
            response.add_etag()
            response.make_conditional(request)

        return response

    return decorator

api.decorators.append(_cache_control)


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
