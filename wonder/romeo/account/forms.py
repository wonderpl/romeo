import wtforms
from flask import current_app, json
from flask.ext.restful import abort
from flask.ext.wtf import Form
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
import twitter
from wonder.common.forms import email_validator
from wonder.common.i18n import lazy_gettext as _
from wonder.common.sqs import background_on_sqs
from wonder.romeo import db
from wonder.romeo.core import dolly
from wonder.romeo.core.email import send_email, email_template_env
from .models import Account, AccountUser, AccountUserAuthToken, EXTERNAL_SYSTEM_CHOICES


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


def register_user(accountname, username, password):
    user = AccountUser(username=username)
    if password:
        user.set_password(password)
    user.just_registered = True    # for api response

    account = Account(name=accountname, users=[user])
    db.session.add(account)
    # need to commit here so that dolly can verify the account
    db.session.commit()

    try:
        dollydata = dolly.login(user.id)
    except:
        # remove committed account
        db.session.delete(account)
        db.session.commit()
        raise
    else:
        account.dolly_user = dollydata['user_id']
        account.dolly_token = dollydata['access_token']

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
    name = wtforms.TextField(validators=[
        wtforms.validators.InputRequired()])
    remember = wtforms.BooleanField()

    def save(self):
        return register_user(self.name.data, self.username.data, self.password.data)


class ExternalLoginForm(Form):
    external_system = wtforms.SelectField(choices=EXTERNAL_SYSTEM_CHOICES)
    external_token = wtforms.TextField(validators=[wtforms.validators.InputRequired()])
    metadata = wtforms.TextField()
    username = wtforms.TextField(validators=[
        wtforms.validators.Optional(), wtforms.validators.Email(),
        email_validator(), username_validator()])
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
            return user
        else:
            if not self.username.data:
                abort(400, error='registration_required',
                      form_errors=dict(username=[_('This field is required.')]))
            try:
                user = register_user(self.user_data['name'], self.username.data, None)
            except IntegrityError as e:
                if '(username)' in e.message:
                    abort(400, error='invalid_request',
                          form_errors=dict(username=[_('The username is already registered.')]))
                raise
            user.auth_tokens = [
                AccountUserAuthToken(
                    external_system=self.external_system.data,
                    external_uid=str(self.user_data['id']),
                    external_token=self.external_token.data,
                    meta=json.dumps(self.metadata.data),
                )
            ]
            return user


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


class ChangePasswordForm(Form):
    password = wtforms.PasswordField()
