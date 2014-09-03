import re
from datetime import timedelta
from boto import connect_ses
from werkzeug.local import LocalProxy
from jinja2 import Environment, PackageLoader
from flask import current_app, url_for


# Pick title from a html string
TITLE_RE = re.compile('<title>([^<]+)</title>')


def send_email(recipient, body, subject=None, format='html'):
    if not subject:
        import HTMLParser
        subject = HTMLParser.HTMLParser().unescape(TITLE_RE.search(body).group(1))
    conn = connect_ses(current_app.config.get('AWS_ACCESS_KEY'), current_app.config.get('AWS_SECRET_KEY'))
    if current_app.config.get('DISABLE_EMAIL'):
        current_app.logger.info('Would send "%s" email to "%s"', subject, recipient)
        return
    return conn.send_email(
        current_app.config['DEFAULT_EMAIL_SOURCE'],
        subject,
        body,
        [recipient],
        format=format
    )


def _timestamp_fmt(t):
    hours, minutes, seconds = str(timedelta(seconds=t)).split(':')
    if hours == '0':
        hours = None
    if hours is None and minutes[0] == '0':
        minutes = minutes[1:]
    return ':'.join(filter(None, (hours, minutes, seconds)))


def _get_template_env():
    config = current_app.config

    # Force https for static images in html email (seems to be needed by yahoo mail)
    assets_url = config.get('ASSETS_URL', '')
    if assets_url.startswith('//'):
        assets_url = 'https:' + assets_url
    config['EMAIL_ASSETS_URL'] = assets_url

    options = dict(trim_blocks=True)

    env = Environment(
        loader=PackageLoader('wonder.romeo', config['EMAIL_TEMPLATE_PATH']),
        **options
    )
    env.globals.update(config=config, url_for=url_for, timestamp_fmt=_timestamp_fmt)

    return env


email_template_env = LocalProxy(_get_template_env)
