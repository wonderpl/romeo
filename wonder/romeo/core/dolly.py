import requests
from urlparse import urljoin
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
    if jsondata is not None:
        kwargs['data'] = json.dumps(jsondata)
        headers['Content-Type'] = 'application/json'
    base = current_app.config['DOLLY_WS_SECURE_BASE' if 'Authorization' in headers
                              else 'DOLLY_WS_BASE']
    response = requests.request(method, urljoin(base, path), **kwargs)
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


def get_video_embed_content(videoid):
    return _request('/embed/%s/' % videoid).content


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


class DollyUser(object):

    def __init__(self, userid, token):
        self.userid = userid
        self.token = token

    def _user_request(self, resource='', *args, **kwargs):
        kwargs.setdefault('token', self.token)
        if resource and not resource.endswith('/'):
            resource += '/'
        return _request('%s/%s' % (self.userid, resource), *args, **kwargs)

    def _set_all_channel_data(self, channeldata):
        for field in 'category', 'cover', 'description', 'public', 'title':
            channeldata.setdefault(field, '')

    def get_userdata(self):
        return self._user_request(params=dict(data='channels')).json()

    def set_display_name(self, name):
        self._user_request('first_name', 'put', name)

    def set_description(self, description):
        self._user_request('description', 'put', description)

    def set_avatar_image(self, image):
        self._user_request('avatar', 'put', files=dict(image=image))

    def set_profile_image(self, image):
        self._user_request('profile_cover', 'put', files=dict(image=image))

    def create_channel(self, channeldata):
        self._set_all_channel_data(channeldata)
        response = self._user_request('channels', 'post', jsondata=channeldata)
        if response.status_code == 201:
            return response.json()

    def update_channel(self, channelid, channeldata):
        self._set_all_channel_data(channeldata)
        response = self._user_request('channels/%s/' % channelid, 'put', jsondata=channeldata)
        if response.status_code == 200:
            return response.json()

    def delete_channel(self, channelid):
        self._user_request('channels/%s' % channelid, 'delete')

    def publish_video(self, channelid, videodata):
        self._user_request('channels/%s/videos' % channelid, 'post',
                           jsondata=(('ooyala', videodata['source_id']),))

    def remove_video(self, channelid, videodata):
        # need to fetch all channel videos and remove
        resource = 'channels/%s/videos' % channelid
        response = self._user_request(resource, params=dict(size=1000)).json()
        videos = [v['id'] for v in response['videos']['items']
                  if v['video']['source_id'] != videodata['source_id']]
        self._user_request(resource, 'put', jsondata=videos)
