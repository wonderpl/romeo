import unittest
import random
from mock import patch
from flask import current_app
from wonder.romeo.account.commands import createuser
from wonder.romeo.account.models import AccountUser
from .helpers import register_user, client_for_user


class AccountTestCase(unittest.TestCase):

    def _create_test_user(self, **kwargs):
        uid = str(random.getrandbits(20))
        data = dict(
            account=uid,
            account_type='content_owner',
            username='noreply+%s@wonderpl.com' % uid,
        )
        data.update(kwargs)
        with patch('wonder.romeo.core.dolly.login') as login:
            login.return_value = dict(user_id='abc', access_token='xxx')
            createuser(**data)
        return data

    def test_login(self):
        credentials = dict(username='a@b.com', password='123')
        accountdata = dict(display_name='test', description=None, avatar_thumbnail_url='', profile_cover_url='')
        userdata = self._create_test_user(**credentials)
        with patch('wonder.romeo.account.views.DollyUser') as DollyUser:
            DollyUser.return_value.get_userdata.return_value = accountdata
            with current_app.test_client() as client:
                r = client.post('/api/login', data=credentials)
                self.assertEquals(r.status_code, 200)
                self.assertEquals(r.json()['account']['name'], userdata['account'])


class ConnectionTestCase(unittest.TestCase):

    def _connect(self, user1, user2):
        with client_for_user(user1['id']) as client:
            r = client.post(user1['href'] + '/connections', json=dict(user=user2['id']))
        return r

    def test_create_connection(self):
        email1, email2 = ['noreply+c%d@wonderpl.com' % i for i in range(2)]
        user1, user2 = [register_user(username=u)['user'] for u in email1, email2]
        with patch('wonder.romeo.account.forms.send_email') as send_email:
            # Initiate connection
            r = self._connect(user1, user2)
            self.assertEquals(r.status_code, 201)

            # Confirm invite email sent
            recipient, body = send_email.call_args[0]
            self.assertEquals(recipient, email2)
            self.assertIn('Accept?', body)
            self.assertIn(user2['display_name'], body)
            send_email.reset_mock()

            # Accept invitation
            r = self._connect(user2, user1)
            self.assertEquals(r.status_code, 201)

            # Confirm acceptance sent
            self.assertEquals(send_email.call_count, 2)
            recipient, body = send_email.call_args[0]
            self.assertEquals(recipient, email2)
            self.assertIn('accepted', body)
            self.assertIn(user2['display_name'], body)
            self.assertIn(email1, body)

    def test_connection_fail(self):
        user1, user2 = [register_user()['user'] for u in range(2)]

        AccountUser.query.filter_by(id=user2['id']).update(dict(contactable=False))

        with patch('wonder.romeo.account.forms.send_email') as send_email:
            # Can't connect with self
            r = self._connect(user1, user1)
            self.assertEquals(r.status_code, 400)
            self.assertFalse(send_email.called)

            # Can't connect with someone who is not contactable...
            r = self._connect(user1, user2)
            self.assertEquals(r.status_code, 400)
            self.assertFalse(send_email.called)

            # ...unless they've already initiated
            r = self._connect(user2, user1)
            self.assertEquals(r.status_code, 201)
            r = self._connect(user1, user2)
            self.assertEquals(r.status_code, 201)
            self.assertEquals(send_email.call_count, 3)

    def test_connection_dups(self):
        account1, user1 = register_user(content_owner=True).values()
        account2, user2 = register_user().values()

        with patch('wonder.romeo.account.forms.send_email'),\
                patch('wonder.romeo.video.forms.send_email'):
            # Connect & collaborate with the same user
            self._connect(user1, user2)
            with client_for_user(user1['id']) as client:
                video = client.post(account1['href'] + '/videos',
                                    json=dict(title='test')).json()
                collab = dict(email=user2['username'], name=user2['display_name'])
                client.post(video['href'] + '/collaborators', json=collab)
                connections = client.get(user1['href'] + '/connections').json()
                self.assertEquals(connections['connection']['total'], 1)


class InviteRequestTestCase(unittest.TestCase):

    def test_invite_request(self):
        with patch('wonder.romeo.account.forms.send_email') as send_email:
            user = dict(email='noreply+invite@wonderpl.com', name='Invite User')
            with current_app.test_client() as client:
                r = client.post('/api/invite_request', json=user)
                self.assertEquals(r.status_code, 204)

            recipient, body = send_email.call_args[0]
            self.assertEquals(recipient, user['email'])
            self.assertIn(user['name'], body)
