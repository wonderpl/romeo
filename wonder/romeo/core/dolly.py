import requests
from flask import current_app
from wonder.romeo import cache


def _parse_cache_header(response):
    header = response.headers.get('Cache-Control', '')
    if 'no-cache' in header or 'no-store' in header:
        return False
    for field in header.split(', '):
        if field.startswith('max-age'):
            return int(field.split('=')[-1])


def get_resource(path):
    response = requests.get(current_app.config['DOLLY_WS_BASE'] + path)
    response.raise_for_status()
    response.cache_max_age = _parse_cache_header(response)
    return response


def get_categories():
    cachekey = 'dolly_categories'
    categories = cache.get(cachekey)
    if not categories:
        sortorder = dict(key=lambda c: c['priority'], reverse=True)
        response = get_resource('categories/')
        categories = response.json()['categories']['items']
        categories.sort(**sortorder)
        for cat in categories:
            cat['sub_categories'].sort(**sortorder)
        # XXX: Exclude the first top-level category (Editors Picks)
        categories = categories[1:]
        if response.cache_max_age:
            cache.set(cachekey, categories, response.cache_max_age)
    return categories
