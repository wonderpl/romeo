import unittest
from flask import current_app, json
from wonder.romeo.account.models import AccountUser
from .helpers import client_for_user


class RootTestCase(unittest.TestCase):

    def test_root_api_anonymous(self):
        with current_app.test_client() as client:
            r = client.get('/api')
            self.assertEquals(r.status_code, 200)
            data = json.loads(r.data)
            self.assertEquals(data['auth_status'], 'logged_out')

    def test_root_api_user(self):
        accountuser = AccountUser.query.first()
        with client_for_user(accountuser.id) as client:
            r = client.get('/api')
            self.assertEquals(r.status_code, 200)
            data = json.loads(r.data)
            self.assertEquals(data['auth_status'], 'logged_in')
            self.assertEquals(data['user']['href'], '/api/user/%d' % accountuser.id)
