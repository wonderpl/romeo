import re
from sqlalchemy import func
from flask import (Blueprint, request, render_template, url_for, redirect)
from flask.ext.login import current_user
from flask.ext.restful import abort
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.rest import Resource, api_resource
from wonder.romeo.core.util import gravatar_url
from wonder.romeo.account.views import user_view
from wonder.romeo.account.models import AccountUser
from .models import AccountUserContact
from .providers import ContactProvider


contactsapp = Blueprint('contacts', __name__)


@contactsapp.route('/import_contacts')
def import_contacts():
    return render_template('contacts_test.html')


@contactsapp.route('/contacts/redirect')
def contacts_auth_redirect():
    try:
        provider = ContactProvider.create_for(request.args['external_system'])
    except KeyError:
        abort(404)

    callback_function = request.args.get('callback', '')
    if not re.match('^[\w.]+$', callback_function):
        abort(400)

    return redirect(provider.get_auth_redirect_url(callback_function))


@contactsapp.route('/contacts/callback')
@commit_on_success
def contacts_auth_callback():
    if not current_user.is_authenticated():
        abort(401)

    try:
        state = ContactProvider.parse_state(request.args['state'])
    except ValueError:
        abort(400)

    try:
        provider = ContactProvider.create_for(state.external_system)
    except KeyError:
        abort(404)

    try:
        emails = provider.get_email_contacts(state.callback_function)
    except Exception as e:
        result = dict(
            error=True,
            message=getattr(e, 'message', '') or str(e),
            description=getattr(e, 'description', ''),
        )
    else:
        _save_contacts(provider.external_system, emails)
        result = dict(
            count=len(emails),
            external_system=provider.external_system,
            href=url_for('api.importedcontacts', user_id=current_user.id) +
            '?external_system=' + provider.external_system,
        )

    return render_template('auth_callback.html',
                           result=result, callback_function=state.callback_function)


def _save_contacts(external_system, emails):
    # remove existing
    AccountUserContact.query.filter_by(
        account_user_id=current_user.id,
        external_system=external_system,
    ).delete()
    # add new
    AccountUserContact.query.session.add_all(
        AccountUserContact(
            account_user_id=current_user.id,
            external_system=external_system,
            external_uid=email_address,
            display_name=name,
            email=email_address,
        )
        for name, email_address in emails
    )


def _contact_item(contact, user=None):
    data = dict(
        external_system=contact.external_system,
        email=contact.email,
        display_name=user and user.display_name or contact.display_name,
        avatar=user and user.avatar or gravatar_url(contact.email),
    )
    if user:
        data['user'] = dict(
            id=user.id,
            href=user.public_href,
            title=user.title,
        )
    return data


@api_resource('/user/<int:user_id>/imported_contacts')
class ImportedContactsResource(Resource):

    @user_view()
    def get(self, user):
        contacts = AccountUserContact.query.outerjoin(
            AccountUser,
            func.lower(AccountUser.username) == func.lower(AccountUserContact.email)
        ).with_entities(AccountUserContact, AccountUser)

        if 'external_system' in request.args:
            contacts = contacts.filter(
                AccountUserContact.external_system == request.args['external_system'])

        items = [_contact_item(*c) for c in contacts]
        return dict(contact=dict(items=items, total=len(items)))
