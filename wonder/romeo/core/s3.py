import boto
from wonder.romeo import app


jpeg_policy = {
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'max-age={}'.format((60 * 60 * 24 * 365 * 10)),
}


def s3connection():
    return boto.connect_s3(app.config['AWS_ACCESS_KEY'], app.config['AWS_SECRET_KEY'])


class S3Uploader(object):

    def __init__(self):
        self.conn = s3connection()
        self.bucket = self.conn.get_bucket(app.config['S3_BUCKET'])

    def exists(self, name):
        if self.bucket.get_key(name):
            return True
        return False

    def get_file(self, name):
        f = self.bucket.get_key(name)
        if f:
            return f.get_contents_as_string()
        return None

    def put_from_filename(self, file_path, key_name,
                          acl='public-read', replace=False, headers=None):
        new_file = self.bucket.new_key(key_name)
        new_file.set_contents_from_filename(file_path, policy=acl, replace=replace, headers=headers)

    def put_from_file(self, fp, key_name,
                      acl='public-read', replace=False, headers=None):
        app.logger.debug('putting key %s', key_name)
        fp.seek(0)
        new_file = self.bucket.new_key(key_name)
        new_file.set_contents_from_file(fp, policy=acl, replace=replace, headers=headers)
