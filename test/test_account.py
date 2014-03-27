import unittest
import random
from mock import patch
from flask import current_app, json
from wonder.romeo.account.commands import createuser


class AccountTestCase(unittest.TestCase):

    def _create_test_user(self, **kwargs):
        uid = str(random.getrandbits(20))
        data = dict(
            account=uid,
            username='noreply+%s@wonderpl.com' % uid,
        )
        data.update(kwargs)
        with patch('wonder.romeo.core.dolly.login') as login:
            login.return_value = dict(user_id='abc', access_token='xxx')
            createuser(**data)
        return data

    def test_login(self):
        credentials = dict(username='a@b.com', password='123')
        accountdata = dict(display_name='test', avatar_thumbnail_url='', profile_cover_url='')
        self._create_test_user(**credentials)
        with patch('wonder.romeo.account.views.DollyUser') as DollyUser:
            DollyUser.return_value.get_userdata.return_value = accountdata
            with current_app.test_client() as client:
                r = client.post('/api/login', data=credentials)
                self.assertEquals(r.status_code, 200)
                data = json.loads(r.data)
                self.assertEquals(data['username'], credentials['username'])
                self.assertEquals(data['account']['display_name'], accountdata['display_name'])
