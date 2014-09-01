import requests
import wtforms
from cStringIO import StringIO
from flask import current_app, json
from flask.ext.restful import abort
from flask.ext.wtf import Form
from flask.ext.login import current_user
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
import twitter
from wonder.common.forms import email_validator
from wonder.common.i18n import lazy_gettext as _
from wonder.common.sqs import background_on_sqs
from wonder.romeo import db
from wonder.romeo.core.email import send_email, email_template_env
from wonder.romeo.core.util import COUNTRY_CODES, get_random_filename
from wonder.romeo.core.s3 import media_bucket, upload_file
from wonder.romeo.video.forms import BaseForm, ImageData, JsonBoolean
from .models import Account, AccountUser, AccountUserAuthToken, AccountUserConnection, EXTERNAL_SYSTEM_CHOICES


def get_auth_handler(system):
    if system == 'twitter':
        return TwitterAuthHandler()


class TwitterAuthHandler(object):

    def verify(self, token):
        try:
            token_key, token_secret = token.split(':')
        except ValueError:
            return
        api = twitter.Api(
            consumer_key=current_app.config['TWITTER_CONSUMER_KEY'],
            consumer_secret=current_app.config['TWITTER_CONSUMER_SECRET'],
            access_token_key=token_key,
            access_token_secret=token_secret,
        )
        try:
            user = api.VerifyCredentials()
        except twitter.TwitterError:
            return
        else:
            return user.AsDict()


def register_user(accountname, username, password, location=None, account_type=None):
    user = AccountUser(username=username, display_name=accountname, location=location)
    if password:
        user.set_password(password)
    user.just_registered = True    # for api response

    account = Account(name=accountname, users=[user])
    db.session.add(account)

    if account_type == 'content_owner':
        # need to commit here so that dolly can verify the account
        db.session.commit()
        try:
            account.set_account_type(account_type)
        except:
            # remove committed account
            db.session.delete(account)
            db.session.commit()
            raise
    else:
        # flush to get id
        db.session.flush()

    send_welcome_email(user.id)

    return user


@background_on_sqs
def send_welcome_email(user_id):
    user = AccountUser.query.get(user_id)
    template = email_template_env.get_template('welcome.html')
    send_email(user.email, template.render(user=user))


def username_validator():
    def _exists(form, field):
        if field.data:
            field.data = field.data.lower()
            user = AccountUser.query.filter(func.lower(AccountUser.username) == field.data)
            if user.value(func.count()):
                raise wtforms.ValidationError(_('Username already registered.'))
    return _exists


class RegistrationForm(Form):
    username = wtforms.TextField(validators=[
        wtforms.validators.InputRequired(), wtforms.validators.Email(),
        email_validator(), username_validator()])
    password = wtforms.PasswordField(validators=[
        wtforms.validators.InputRequired(), wtforms.validators.Length(min=8)])
    display_name = wtforms.TextField(validators=[
        wtforms.validators.InputRequired()])
    location = wtforms.SelectField(choices=COUNTRY_CODES)
    remember = wtforms.BooleanField()

    def save(self):
        return register_user(self.display_name.data, self.username.data,
                             self.password.data, self.location.data)


class ExternalLoginForm(Form):
    external_system = wtforms.SelectField(choices=EXTERNAL_SYSTEM_CHOICES)
    external_token = wtforms.TextField(validators=[wtforms.validators.InputRequired()])
    metadata = wtforms.TextField()
    username = wtforms.TextField(validators=[
        wtforms.validators.Optional(), wtforms.validators.Email(),
        email_validator(), username_validator()])
    location = wtforms.SelectField(choices=COUNTRY_CODES, validators=[
        wtforms.validators.Optional()])
    remember = wtforms.BooleanField()

    def validate(self):
        success = super(ExternalLoginForm, self).validate()
        if success:
            auth_handler = get_auth_handler(self.external_system.data)
            if not auth_handler:
                self._errors = dict(external_system=[_('Unsupported system.')])
                success = False
            else:
                self.user_data = auth_handler.verify(self.external_token.data)
                if not self.user_data:
                    self._errors = dict(external_token=[_('Invalid token.')])
                    success = False
        return success

    def save(self):
        user = AccountUser.query.join(
            AccountUserAuthToken,
            (AccountUserAuthToken.account_user_id == AccountUser.id) &
            (AccountUserAuthToken.external_system == self.external_system.data) &
            (AccountUserAuthToken.external_uid == str(self.user_data['id']))
        ).first()
        if user:
            # User already registered
            return user
        else:
            # Try to register a new user
            if not self.username.data:
                abort(400, error='registration_required',
                      form_errors=dict(username=[_('This field is required.')]))
            if not self.location.data or self.location.data == 'None':
                abort(400, error='invalid_request',
                      form_errors=dict(location=[_('This field is required.')]))

            try:
                user = register_user(self.user_data['name'], self.username.data,
                                     None, self.location.data)
            except IntegrityError as e:
                if '(username)' in e.message:
                    abort(400, error='invalid_request',
                          form_errors=dict(username=[_('Username already registered.')]))
                raise
            else:
                self._update_user(user)
            user.auth_tokens = [
                AccountUserAuthToken(
                    external_system=self.external_system.data,
                    external_uid=str(self.user_data['id']),
                    external_token=self.external_token.data,
                    meta=json.dumps(self.metadata.data),
                )
            ]
            return user

    def _update_user(self, user):
        # Update user properties using data from external system
        user.display_name = self.user_data.get('name')
        user.description = self.user_data.get('description')
        if 'url' in self.user_data:
            response = requests.request('head', self.user_data['url'])
            user.website_url = response.url if response.ok else None
        user.avatar = self._slurp_external_image(
            self.user_data.get('profile_image_url', '').replace('_normal.', '.'),
            'avatar', user.account_id)
        user.profile_cover = self._slurp_external_image(
            self.user_data.get('profile_banner_url', ''),
            'profile_cover', user.account_id)

    def _slurp_external_image(self, url, imagetype, account_id):
        response = requests.get(url, stream=True)
        content_type = response.headers.get('content-type', '')
        if not (response.ok and content_type.startswith('image/')):
            response.close()
            return
        filename = get_random_filename()
        filepath = AccountUser.get_image_filepath(account_id, filename, imagetype)
        upload_file(media_bucket, filepath, StringIO(response.content), content_type)
        return filename


class LoginForm(Form):
    username = wtforms.TextField()
    password = wtforms.PasswordField()
    remember = wtforms.BooleanField()

    def validate(self):
        success = super(LoginForm, self).validate()
        if success:
            self.user = AccountUser.get_from_credentials(self.username.data, self.password.data)
            if not self.user:
                self._errors = dict(username=[_('The username or password you entered is incorrect.')])
                success = False
        return success

    def save(self):
        return self.user


class AccountUserForm(BaseForm):
    display_name = wtforms.TextField()
    location = wtforms.SelectField(choices=COUNTRY_CODES)
    title = wtforms.TextField()
    description = wtforms.TextField()
    website_url = wtforms.TextField(validators=[wtforms.validators.URL()])
    search_keywords = wtforms.TextField()
    profile_cover = wtforms.FileField(validators=[ImageData('profile_cover', thumbnails=True)])
    avatar = wtforms.FileField(validators=[ImageData('avatar', thumbnails=True)])
    contactable = wtforms.BooleanField(validators=[JsonBoolean()])

    class Meta:
        model = AccountUser


class ChangePasswordForm(Form):
    password = wtforms.PasswordField()


class AccountUserConnectionForm(BaseForm):
    user = wtforms.IntegerField()
    message = wtforms.TextField()

    class Meta:
        model = AccountUserConnection

    def __init__(self, account_user=None, *args, **kwargs):
        super(AccountUserConnectionForm, self).__init__(*args, **kwargs)
        self.account_user = account_user

    def validate_user(self, field):
        if field.data:
            self.connection_user = AccountUser.query.filter_by(id=field.data, active=True).first()
            if not self.connection_user:
                raise wtforms.ValidationError(_('Invalid user id.'))
            if not self.connection_user.contactable:
                raise wtforms.ValidationError(_('User not contactable.'))

    def populate_obj(self, obj):
        super(AccountUserConnectionForm, self).populate_obj(obj)
        obj.account_user_id = self.account_user.id
        obj.connection_id = self.connection_user.id

    def save(self):
        try:
            connection = super(AccountUserConnectionForm, self).save()
            created = True
        except IntegrityError as e:
            if 'already exists' in e.message:
                db.session.rollback()
                connection = AccountUserConnection.query.filter_by(
                    account_user_id=self.account_user.id,
                    connection_id=self.connection_user.id,
                ).one()
                created = False
            else:
                raise

        reverse = AccountUserConnection.query.filter_by(
            account_user_id=self.connection_user.id,
            connection_id=self.account_user.id,
        ).first()
        if reverse and reverse.state == 'pending':
            reverse.state = connection.state = 'accepted'
            send_connection_acceptance_email(self.account_user.id, self.connection_user.id)
        else:
            send_connection_invite_email(self.account_user.id, self.connection_user.id)

        return connection if created else None


@background_on_sqs
def send_connection_invite_email(sender_id, recipient_id):
    connection = AccountUserConnection.query.filter_by(
        account_user_id=sender_id,
        connection_id=recipient_id,
    ).one()

    template = email_template_env.get_template('connection_invite.html')
    body = template.render(
        sender=connection.account_user,
        recipient=connection.connection,
        message=connection.message,
    )
    send_email(connection.connection.email, body)


@background_on_sqs
def send_connection_acceptance_email(sender_id, recipient_id):
    connection = AccountUserConnection.query.filter_by(
        account_user_id=sender_id,
        connection_id=recipient_id,
    ).one()

    template = email_template_env.get_template('connection_acceptance.html')
    for sender, recipient, initiator in (
            (connection.account_user, connection.connection, True),
            (connection.connection, connection.account_user, False)):
        recipient.is_initiator = initiator
        body = template.render(sender=sender, recipient=recipient)
        send_email(recipient.email, body)


class AccountPaymentForm(Form):
    payment_token = wtforms.TextField(validators=[wtforms.validators.Required()])

    def validate_payment_token(self, field):
        if field.data:
            pass

    def save(self):
        stripe = type('S', (object,), dict(Customer=type(
            'C', (object,), dict(create=lambda *a, **k: None))()))
        try:
            stripe.Customer.create(
                card=self.payment_token.data,
                plan='basic_yearly',
                email=current_user.email,
            )
        except Exception:
            raise
        else:
            current_user.account.payment_token = self.payment_token.data
            current_user.account.set_account_type('content_owner')
