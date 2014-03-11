import requests
from flask import current_app, json
from wonder.romeo import cache


def _parse_cache_header(response):
    header = response.headers.get('Cache-Control', '')
    if 'no-cache' in header or 'no-store' in header:
        return False
    for field in header.split(', '):
        if field.startswith('max-age'):
            return int(field.split('=')[-1])


def _request(path, method='get', jsondata=None, token=None, **kwargs):
    headers = kwargs.setdefault('headers', {})
    if token:
        headers['Authorization'] = 'Bearer %s' % token
    if jsondata:
        kwargs['data'] = json.dumps(jsondata)
        headers['Content-Type'] = 'application/json'
    base = current_app.config['DOLLY_WS_SECURE_BASE' if 'Authorization' in headers
                              else 'DOLLY_WS_BASE']
    response = requests.request(method, base + path, **kwargs)
    response.raise_for_status()
    response.cache_max_age = _parse_cache_header(response)
    return response


def get_categories():
    cachekey = 'dolly_categories'
    categories = cache.get(cachekey)
    if not categories:
        sortorder = dict(key=lambda c: c['priority'], reverse=True)
        response = _request('categories/')
        categories = response.json()['categories']['items']
        categories.sort(**sortorder)
        for cat in categories:
            cat['sub_categories'].sort(**sortorder)
        # XXX: Exclude the first top-level category (Editors Picks)
        categories = categories[1:]
        if response.cache_max_age:
            cache.set(cachekey, categories, response.cache_max_age)
    return categories


def get_userdata(userid, token):
    response = _request(userid + '/', token=token, params=dict(data='none'))
    return response.json()


def set_display_name(userid, token, name):
    response = _request(userid + '/first_name/', 'put', name, token=token)
    assert response.status_code == 204


def set_avatar_image(userid, token, image):
    response = _request(userid + '/avatar/', 'put',
                        files={'image': image}, token=token)
    assert response.status_code == 200


def set_profile_image(userid, token, image):
    response = _request(userid + '/profile_cover/', 'put',
                        files={'image': image}, token=token)
    assert response.status_code == 200


def login(userid):
    # Use app session interface to create a cookie value that can be used
    # with _verify_user to confirm the user exists.
    serializer = current_app.session_interface.get_signing_serializer(current_app)
    token = serializer.dumps({'user_id': userid})
    tokendata = dict(
        external_token=token,
        external_system='romeo',
        token_permissions='auth',
    )
    headers = {'Authorization': current_app.config['DOLLY_WS_CLIENT_AUTH']}
    response = _request('login/external/', 'post', jsondata=tokendata, headers=headers)
    return response.json()
