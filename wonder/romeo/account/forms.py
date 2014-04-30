from PIL import Image
import wtforms
from flask import request
from flask.ext.wtf import Form
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import media_bucket
from .models import Account, AccountUser


class LoginForm(Form):
    username = wtforms.TextField()
    password = wtforms.PasswordField()
    remember = wtforms.BooleanField()

    def validate(self):
        success = super(LoginForm, self).validate()
        if success:
            self.user = AccountUser.get_from_credentials(self.username.data, self.password.data)
            if not self.user:
                self._errors = dict(username=['mismatch'])
                success = False
        return success


class ChangePasswordForm(Form):
    password = wtforms.PasswordField()


class PlayerLogoForm(Form):
    player_logo = wtforms.FileField()

    def validate_player_logo(self, field):
        if field.data:
            try:
                image = Image.open(field.data)
                field.data.derived_content_type = Image.MIME[image.format]
            except Exception as e:
                raise wtforms.ValidationError(e.message)
            else:
                field.data.stream.seek(0)

    @commit_on_success
    def save(self, account):
        account.player_logo_filename = Account.get_random_player_logo_filename()
        headers = {
            'Content-Type': self.player_logo.data.derived_content_type,
            'Cache-Control': 'max-age={}'.format((60 * 60 * 24 * 365 * 10)),
        }
        key = media_bucket.new_key(account.get_player_logo_filepath())
        key.set_contents_from_file(self.player_logo.data, policy='public-read', headers=headers)
        # TODO: save thumbnails

    def is_submitted(self):
        # Include PATCH
        return request and request.method in ('PUT', 'POST', 'PATCH')
