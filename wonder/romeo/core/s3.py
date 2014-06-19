import boto
from werkzeug.local import LocalProxy
from flask import g, current_app


def _get_connection():
    conn = getattr(g, '_s3_connection', None)
    if conn is None:
        conn = g._s3_connection = boto.connect_s3(
            current_app.config.get('AWS_ACCESS_KEY'),
            current_app.config.get('AWS_SECRET_KEY'))
    return conn


def _get_bucket(name):
    gkey = '_s3_%s' % name
    bucket = getattr(g, gkey, None)
    if bucket is None:
        bucket = _get_connection().get_bucket(name, validate=False)
        setattr(g, gkey, bucket)
    return bucket


def upload_file(bucket, path, data, content_type=None, public=True, long_cache_age=True):
    headers = {}
    if content_type:
        headers['Content-Type'] = content_type
    if long_cache_age:
        headers['Cache-Control'] = 'max-age={}'.format((60 * 60 * 24 * 365 * 10))
    key = bucket.new_key(path)
    policy = 'public-read' if public else None
    return key.set_contents_from_file(data, policy=policy, headers=headers)


def download_file(bucket, path):
    return bucket.new_key(path).get_contents_as_string()


s3connection = LocalProxy(_get_connection)
video_bucket = LocalProxy(lambda: _get_bucket(current_app.config['VIDEO_S3_BUCKET']))
media_bucket = LocalProxy(lambda: _get_bucket(current_app.config['MEDIA_S3_BUCKET']))
