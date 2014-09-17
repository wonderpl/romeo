from random import randint
from mock import patch
from flask import current_app
from contextlib import contextmanager
from wonder.romeo.account.models import AccountUser


def register_user(**kwargs):
    with client_for_new_user(**kwargs) as client:
        return client.reg_data


def _register_user(client, **kwargs):
    id = randint(0, 10 ** 6)
    userdata = dict(
        username='noreply+test%s@wonderpl.com' % id,
        display_name='test user %s' % id,
        password='romeo123',
        location='GB',
    )
    userdata.update(kwargs)
    response = client.post('/api/register', json=userdata)
    reg = response.json()
    assert reg['user']['display_name'] == userdata['display_name']
    return reg


@contextmanager
def client_for_new_user(**kwargs):
    with patch('wonder.romeo.account.forms.send_email') as send_email:
        with current_app.test_client() as client:
            client.reg_data = _register_user(client, **kwargs)
            yield client
        assert send_email.called


@contextmanager
def client_for_user(user_id):
    with current_app.test_client() as client:
        with client.session_transaction() as session:
            session['user_id'] = user_id
        yield client


@contextmanager
def client_for_account(account_id):
    user_id = AccountUser.query.filter_by(account_id=account_id).value(AccountUser.id)
    with client_for_user(user_id) as client:
        yield client


@contextmanager
def client_for_collaborator(collaborator_id):
    with current_app.test_client() as client:
        with client.session_transaction() as session:
            session['collaborator_ids'] = [collaborator_id]
        yield client
