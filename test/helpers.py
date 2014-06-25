from flask import current_app
from contextlib import contextmanager
from wonder.romeo.account.models import AccountUser


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
