import wtforms
from flask.ext.wtf import Form
from .models import AccountUser


class LoginForm(Form):
    username = wtforms.TextField()
    password = wtforms.PasswordField()
    remember = wtforms.BooleanField()

    def validate(self):
        success = super(LoginForm, self).validate()
        if success:
            self.user = AccountUser.get_from_credentials(self.username.data, self.password.data)
            if not self.user:
                self._errors = dict(username='mismatch')
                success = False
        return success
