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


s3connection = LocalProxy(_get_connection)
video_bucket = LocalProxy(lambda: _get_bucket(current_app.config['VIDEO_S3_BUCKET']))
