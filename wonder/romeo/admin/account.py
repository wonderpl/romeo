from flask import request, redirect, url_for
from wonder.common.sqs import background_on_sqs
from wonder.romeo import db
from wonder.romeo.core.email import send_email, email_template_env
from wonder.romeo.account.forms import RegistrationForm
from wonder.romeo.account import models
from . import AdminView, AdminModelView, admin_view, expose


@admin_view()
class AccountAdminModelView(AdminModelView):
    model = models.Account

    column_list = 'name', 'date_added'
    column_filters = 'name',
    column_searchable_list = 'name',

    form_excluded_columns = 'tags', 'videos', 'users', 'date_added'


@admin_view()
class AccountUserAdminModelView(AdminModelView):
    model = models.AccountUser

    column_list = 'display_name', 'username', 'date_added'
    column_filters = 'display_name', 'username'
    column_searchable_list = 'display_name', 'username'

    form_excluded_columns = 'account', 'connections', 'auth_tokens', 'date_added'


@admin_view()
class RegistrationTokenAdminModelView(AdminModelView):
    model = models.RegistrationToken

    column_list = 'recipient', 'account_user', 'date_added'

    form_excluded_columns = 'account_user', 'date_added'


@background_on_sqs
def send_beta_invite_emails(tokens):
    tokens = models.RegistrationToken.query.filter(
        models.RegistrationToken.id.in_(tokens))
    for token, recipient in tokens.values('id', 'recipient'):
        template = email_template_env.get_template('beta_invite.html')
        send_email(recipient, template.render(reg_token=token))


@admin_view(name='Beta Invite')
class BetaInviteAdminView(AdminView):

    @expose('/', ('get', 'post'))
    def index(self):
        tokens, errors = [], []
        input = str(request.form.get('recipients', '')).strip()

        if input:
            recipients = map(str.strip, input.split('\n'))
            # XXX: Using RegistrationForm username field to validate all input
            form = RegistrationForm()
            for recipient in recipients:
                form.username.data = form.username.raw_data = recipient
                if form.username.validate(form):
                    tokens.append(models.RegistrationToken.new(recipient).id)
                else:
                    errors.append(recipient + ': ' + form.username.errors[0])

            if tokens and not errors:
                db.session.commit()
                send_beta_invite_emails(tokens)
                # redirect to token list, sorted so that recent are at top
                return redirect(url_for('admin_registration_token.index_view') +
                                '?sort=2&desc=1')

        return self.render('admin/beta_invite.html',
                           recipients=input, errors=errors)
