import os
from pkg_resources import resource_string
from urllib import urlencode
from hashlib import md5
from flask import current_app


COUNTRY_CODES = [
    tuple(l.split('\t', 1))
    for l in resource_string(__name__, 'country_codes.txt').split('\n')
    if l and l[0] != '#'
]


def gravatar_url(email):
    base = current_app.config['GRAVATAR_BASE_URL']
    hash = md5(email.lower()).hexdigest()
    query = urlencode(dict(d='mm', s=current_app.config['GRAVATAR_SIZE']))
    return base + hash + '?' + query


def get_random_filename():
    return os.urandom(8).encode('hex')
