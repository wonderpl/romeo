from urllib import urlencode
from hashlib import md5
from flask import current_app


def gravatar_url(email):
    base = current_app.config['GRAVATAR_BASE_URL']
    hash = md5(email.lower()).hexdigest()
    query = urlencode(dict(d='mm', s=current_app.config['GRAVATAR_SIZE']))
    return base + hash + '?' + query
