import wtforms
from flask.ext.wtf import Form


class LoginForm(Form):
    username = wtforms.TextField()
    password = wtforms.PasswordField()
    remember = wtforms.BooleanField()
