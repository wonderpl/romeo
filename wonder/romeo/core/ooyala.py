import os
from time import time
from datetime import datetime
from base64 import b64encode
from hashlib import sha256
from urlparse import urljoin
import requests
from flask import json, current_app
from .s3 import video_bucket


BASE_URL = 'https://api.ooyala.com'


class DuplicateException(Exception):
    def __init__(self, assetid):
        self.assetid = assetid
        self.message = 'Duplicate video content'


def _parse_datetime(dt):
    return datetime.strptime(dt[:19], '%Y-%m-%dT%H:%M:%S')


def _generate_signature(method, path, params, body=''):
    # See http://support.ooyala.com/developers/documentation/tasks/api_signing_requests.html
    head = current_app.config['OOYALA_SECRET'] + method.upper() + str(path)
    for key, value in sorted(params.iteritems()):
        head += key + '=' + str(value)
    return b64encode(sha256(head + body).digest())[0:43]


def ooyala_request(*resource, **kwargs):
    method = kwargs.pop('method', 'post' if 'data' in kwargs else 'get')
    path = '/'.join(('', 'v2') + resource)
    params = dict(
        api_key=current_app.config['OOYALA_API_KEY'],
        expires=int(time()) + 60,
    )
    params.update(kwargs.pop('params', {}))
    params.update(kwargs.pop('query_params', {}))
    params['signature'] = _generate_signature(method, path, params, kwargs.get('data', ''))
    response = requests.request(method, urljoin(BASE_URL, path), params=params, **kwargs)
    response.raise_for_status()
    try:
        return response.json()
    except ValueError:
        return response.content


def get_video_data(id):
    data = ooyala_request('assets', id, params=dict(include='metadata'))
    data['upload_status'] = ooyala_request('assets', id, 'upload_status')
    if data['status'] != 'error':
        data['thumbnails'] = ooyala_request('assets', id, 'primary_preview_image')['sizes']
    return data


def set_metadata(assetid, metadata):
    labelname = str(metadata.pop('label', None))
    if labelname:
        idmap = dict((l['name'], l['id']) for l in ooyala_request('labels')['items'])
        if labelname in idmap:
            labelid = idmap[labelname]
        else:
            labelid = ooyala_request('labels', data=json.dumps(dict(name=labelname)))['id']
        ooyala_request('assets', assetid, 'labels', labelid, method='put')
    if metadata:
        ooyala_request('assets', assetid, 'metadata',
                       method='patch', data=json.dumps(metadata))


def create_asset(s3path, metadata):
    # get metadata from s3
    chunk_size = 2 ** 22
    key = video_bucket.get_key(s3path)
    if not key:
        current_app.logger.error('s3://%s/%s not found', video_bucket.name, s3path)
        return
    file_name = os.path.basename(key.name)
    file_size = key.size

    # create asset on ooyala
    asset = dict(
        asset_type='video',
        file_name=file_name,
        name=metadata.pop('name', None) or os.path.splitext(file_name)[0].capitalize(),
        file_size=file_size,
        chunk_size=chunk_size,
    )
    response = ooyala_request('assets', data=json.dumps(asset))
    assetid = response['embed_code']

    # set label and metadata
    set_metadata(assetid, metadata)

    # copy video data from s3 to ooyala
    range = -1, -1
    for upload_url in ooyala_request('assets', assetid, 'uploading_urls'):
        range = range[1] + 1, min(range[1] + chunk_size, file_size - 1)
        buf = key.get_contents_as_string(headers={'Range': 'bytes=%d-%d' % range})
        response = requests.put(upload_url, buf)
        response.raise_for_status()
        current_app.logger.info('Uploaded %s (%d-%d) to %s',
                                s3path, range[0], range[1], upload_url)
        assert response.status_code == 204
    try:
        ooyala_request('assets', assetid, 'upload_status',
                       method='put', data=json.dumps(dict(status='uploaded')))
    except Exception as e:
        if hasattr(e, 'response') and 'error: duplicate' in e.response.content:
            raise DuplicateException(assetid)
        else:
            raise

    return assetid
