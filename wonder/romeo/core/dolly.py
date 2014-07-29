import hashlib
import hmac
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
    if method.lower() != 'get' or 'Authorization' in headers:
        base = current_app.config['DOLLY_WS_SECURE_BASE']
    else:
        base = current_app.config['DOLLY_WS_BASE']
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


def push_video_data(video):
    data = json.dumps(video.get_dolly_data(with_thumbnails=True))
    sig = hmac.new(current_app.config['DOLLY_PUBSUB_SECRET'], data, hashlib.sha1)
    headers = {
        'X-Hub-Signature': 'sha1=' + sig.hexdigest(),
        'Content-Type': 'application/json',
    }
    params = dict(id=current_app.config['DOLLY_PUBSUB_ID'])
    _request('pubsubhubbub/callback', 'post', data=data, params=params, headers=headers)


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
        data = self._user_request(params=dict(data='channels')).json()
        # XXX: Change Dolly config to generate another size suitable for web?
        cover_url = data.get('profile_cover_url')
        if cover_url:
            data['profile_cover_url'] = cover_url.replace('thumbnail_medium', 'ipad')
        return data

    def set_display_name(self, name):
        self._user_request('first_name', 'put', name)

    def set_description(self, description):
        self._user_request('description', 'put', description)

    def set_avatar_image(self, image):
        response = self._user_request('avatar', 'put', files=dict(image=image))
        return response.json()['thumbnail_url']

    def set_profile_image(self, image):
        response = self._user_request('profile_cover', 'put', files=dict(image=image))
        return response.json()['thumbnail_url']

    def create_channel(self, channeldata):
        self._set_all_channel_data(channeldata)
        response = self._user_request('channels', 'post', jsondata=channeldata)
        if response.status_code == 201:
            return response.json()

    def get_channel(self, channelid):
        response = self._user_request('channels/%s' % channelid)
        if response.status_code == 200:
            return response.json()

    def get_channel_videos(self, channelid):
        resource = 'channels/%s/videos' % channelid
        response = self._user_request(resource, params=dict(size=1000)).json()
        return response['videos']['items']

    def update_channel(self, channelid, channeldata):
        self._set_all_channel_data(channeldata)
        response = self._user_request('channels/%s/' % channelid, 'put', jsondata=channeldata)
        if response.status_code == 200:
            return response.json()

    def delete_channel(self, channelid):
        self._user_request('channels/%s' % channelid, 'delete')

    def publish_video(self, channelid, videodata):
        response = self._user_request('channels/%s/videos' % channelid, 'post',
                                      jsondata=(('ooyala', videodata['source_id']),))
        if response.status_code == 201:
            return response.json()['id']

    def remove_video(self, channelid, videodata):
        # need to fetch all channel videos and remove
        videos = [v['id'] for v in self.get_channel_videos(channelid)
                  if v['video']['source_id'] != videodata['source_id']]
        self._user_request('channels/%s/videos' % channelid, 'put', jsondata=videos)

    def get_share_link(self, instanceid):
        objdata = dict(object_type='video_instance', object_id=instanceid)
        response = _request('share/link/', 'post', token=self.token, jsondata=objdata)
        if response.status_code == 201:
            return response.json()['resource_url']
