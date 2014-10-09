from base64 import urlsafe_b64encode, urlsafe_b64decode
from collections import namedtuple
from requests_oauthlib import OAuth2Session
from flask import current_app, request, url_for, session


class ContactProvider(object):

    @staticmethod
    def create_for(external_system):
        return _PROVIDERS[external_system]()

    def _config(self, key):
        return current_app.config[self.config_prefix + '_' + key]

    def _state(self, callback_function, csrf_token):
        state = self.external_system, callback_function, csrf_token
        return urlsafe_b64encode(':'.join(state))

    @staticmethod
    def parse_state(s):
        return namedtuple('State', 'external_system, callback_function, csrf_token')(
            *urlsafe_b64decode(s.encode('utf8')).split(':'))

    def _oauth(self, **kwargs):
        kwargs['redirect_uri'] = url_for('.contacts_auth_callback', _external=True)
        kwargs['client_id'] = self._config('CLIENT_ID')
        return OAuth2Session(**kwargs)

    def get_auth_redirect_url(self, callback_function):
        oauth = self._oauth(scope=self.scope)
        csrf_token = oauth.new_state()
        url, state = oauth.authorization_url(
            url=self.auth_url,
            state=self._state(callback_function, csrf_token),
            display='popup',
        )
        session['contact_oauth_csrf_token'] = csrf_token
        return url

    def get_email_contacts(self, callback_function):
        csrf_token = session.pop('contact_oauth_csrf_token', '')
        oauth = self._oauth(state=self._state(callback_function, csrf_token))
        oauth.fetch_token(
            token_url=self.token_url,
            client_secret=self._config('CLIENT_SECRET'),
            authorization_response=request.url
        )

        response = oauth.get(self.contacts_url).json()
        self._raise_for_error(response)

        return self._parse_contacts(response)

    def _raise_for_error(self, response):
        pass


class WindowsLiveContactProvider(ContactProvider):

    external_system = 'live'
    config_prefix = 'WINDOWS_LIVE'

    auth_url = 'https://login.live.com/oauth20_authorize.srf'
    token_url = 'https://login.live.com/oauth20_token.srf'
    contacts_url = 'https://apis.live.net/v5.0/me/contacts'
    scope = ['wl.basic', 'wl.emails', 'wl.contacts_emails']

    def _parse_contacts(self, contacts):
        return [
            (contact['name'], contact['emails'].get('preferred', ''))
            for contact in contacts['data']
        ]


class GoogleContactProvider(ContactProvider):

    external_system = 'google'
    config_prefix = 'GOOGLE'

    auth_url = 'https://accounts.google.com/o/oauth2/auth'
    token_url = 'https://accounts.google.com/o/oauth2/token'
    contacts_url = 'https://www.google.com/m8/feeds/contacts/default/full?alt=json'
    scope = ['https://www.google.com/m8/feeds/contacts/default/full']

    def _raise_for_error(self, response):
        if 'error' in response:
            raise Exception(response['error']['message'])

    def _parse_contacts(self, contacts):
        emails = []
        for contact in contacts['feed']['entry']:
            if u'gd$email' in contact:
                address = next(a['address']
                               for a in contact[u'gd$email']
                               if a['primary'] == 'true')
                name = contact.get('title', {}).get('$t')
                emails.append((name, address))
        return emails


_PROVIDERS = {p.external_system: p for p in globals().values()
              if hasattr(p, 'external_system')}
