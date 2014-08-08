from cgi import parse_qs
from flask import current_app
from werkzeug import generate_password_hash
from wonder.romeo import manager, db
from wonder.romeo.core.db import commit_on_success
from wonder.romeo.core.s3 import video_bucket
from wonder.romeo.core.util import get_random_filename
from wonder.romeo.core import dolly, ooyala
from wonder.romeo.account.models import Account, AccountUser
from wonder.romeo.account.views import get_dollyuser
from .models import Video, VideoThumbnail, VideoTag, VideoTagVideo
from .forms import send_processed_email


def _dolly_token(userid):
    try:
        from rockpack.mainsite.core.token import create_access_token
    except ImportError:
        return 'xxx'
    else:
        return create_access_token(userid, '', 0)


def _gen_password():
    from random import choice
    from string import ascii_lowercase
    return ''.join((choice(ascii_lowercase) for i in xrange(8)))


@commit_on_success
def _create_account_record(user):
    account = Account.query.filter_by(dolly_user=user).first()
    if account:
        return account, False

    dollyuser = dolly.DollyUser(user, _dolly_token(user))
    userdata = dollyuser.get_userdata()
    accountname = userdata['display_name']
    username = userdata['email'] or userdata['username']
    postfix = 0
    while True:
        if AccountUser.query.filter_by(username=username).count() == 0:
            break
        postfix += 1
        username = userdata['email'].replace('@', '+%d@' % postfix)
    password = _gen_password()
    accountuser = AccountUser(
        username=username,
        password_hash=generate_password_hash(password),
    )
    account = Account(
        dolly_user=user,
        dolly_token=dollyuser.token,
        name=accountname,
        users=[accountuser],
    )
    db.session.add(account)
    current_app.logger.info('Created new user: %s/%s', username, password)

    return account, True


@commit_on_success
def _create_tag_record(channel, account):
    tag = VideoTag.query.filter_by(dolly_channel=channel).first()
    if tag:
        return tag, False

    dollyuser = dolly.DollyUser(account.dolly_user, account.dolly_token)
    try:
        channeldata = dollyuser.get_channel(channel)
    except Exception:
        current_app.logger.error('Unable to get channel data: %s', channel)
        return None, False
    tag = VideoTag(
        dolly_channel=channel,
        account_id=account.id,
        label=channeldata['title'],
        description=channeldata['description'],
    )
    db.session.add(tag)

    return tag, True


@commit_on_success
def _create_video_record(asset, account_id, tag_id):
    video = Video.query.filter_by(external_id=asset['embed_code']).first()
    if video:
        return video, False

    video = Video(
        account_id=account_id,
        status='published',
        date_added=asset['created_at'],
        date_updated=asset['updated_at'],
        title=asset['name'],
        duration=asset['duration'] / 1000,
        filename='dolly',
        external_id=asset['embed_code'],
        category=asset['metadata'].get('category'),
    )
    db.session.add(video)

    preview_image = ooyala.ooyala_request('assets', asset['embed_code'], 'primary_preview_image')
    for t in preview_image['sizes']:
        t.pop('time', None)
    video.thumbnails = [VideoThumbnail(**t) for t in preview_image['sizes']]

    video.record_workflow_event('imported from ooyala')

    if tag_id:
        db.session.flush()
        db.session.add(VideoTagVideo(video_id=video.id, tag_id=tag_id))

    return video, True


@manager.command
def import_videos_from_ooyala(label=None):
    next_page_token = None
    while True:
        params = dict(limit=100, include='metadata')
        if label:
            params['where'] = "labels INCLUDES '%s'" % label
        if next_page_token:
            params['page_token'] = next_page_token
        response = ooyala.ooyala_request('assets', params=params)
        for asset in response['items']:
            if asset['status'] != 'live':
                current_app.logger.warning('Video not "live": %s', asset['embed_code'])
                continue

            try:
                channel = asset['metadata']['channel']
                user = asset['metadata']['user']
            except KeyError:
                current_app.logger.error('No metadata found: %s', asset['embed_code'])
                continue
            else:
                account, created = _create_account_record(user)
                tag, created = _create_tag_record(channel, account)

            video, created = _create_video_record(asset, account.id, tag and tag.id)
            if created:
                current_app.logger.debug('Created video record: %s/%s/%s', account.id, tag.id if tag else '-', video.id)

        if 'next_page' in response:
            next_page_token = parse_qs(response['next_page'])['page_token'][0]
        else:
            break


def update_video_status(video, data, send_email=True):
    if data['upload_status'].get('status') == 'failed':
        failure_reason = data['upload_status'].get('failure_reason') or 'unknown reason'
        video.status = 'error'
        video.record_workflow_event('processing failed', failure_reason)
        current_app.logger.error('Upload failed for %s: %s', video.id, failure_reason)
    else:
        assert data['status'] == 'live'
        failure_reason = None
        if video.status == 'processing':
            video.status = 'ready'
        video.record_workflow_event('processing complete')
        video.duration = data['duration'] / 1000
        if not video.thumbnails:
            video.thumbnails = [VideoThumbnail(**t) for t in data['thumbnails']]

    if send_email:
        send_processed_email(video.id, error=failure_reason)


@manager.cron_command(30)
@commit_on_success
def check_ooyala_processing_status():
    videos = Video.query.filter(Video.status == 'processing', Video.external_id != None)
    videoids = dict(videos.values('external_id', 'id'))
    if not videoids:
        return
    params = dict(where="embed_code in ('%s')" % "', '".join(videoids))
    for asset in ooyala.ooyala_request('assets', params=params)['items']:
        if not asset['status'] == 'processing':
            video = Video.query.filter_by(external_id=asset['embed_code']).first()
            data = ooyala.get_video_data(asset['embed_code'])
            update_video_status(video, data)


@manager.option('-v', '--videoid')
@manager.option('-e', '--set-error')
@commit_on_success
def mark_video_processed(videoid, set_error=False):
    video = Video.query.get(videoid)
    if set_error:
        data = dict(upload_status={
            'status': 'failed',
            'failure_reason': set_error
        })
    else:
        data = dict(
            upload_status={'status': 'live'},
            status='live',
            duration=55240,
            thumbnails=[
                {'url': 'http://placehold.it/%dx%d' % (w, h), 'width': w, 'height': h}
                for w, h in reversed(current_app.config['COVER_THUMBNAIL_SIZES'])
            ]
        )
    update_video_status(video, data, send_email=False)


@manager.command
@commit_on_success
def fixup_video_data():
    videos = {}
    for video in Video.query.filter_by(dolly_instance=None):
        channel = next((t.dolly_channel for t in video.tags if t.dolly_channel), None)
        if not channel:
            continue
        if channel not in videos:
            videos[channel] = get_dollyuser(video.account).get_channel_videos(channel)
        video.dolly_instance = next((v['id'] for v in videos[channel]
                                     if v['video']['source_id'] == video.external_id), None)


@manager.command
def migrate_video_files(account):
    for video in Video.query.filter_by(account_id=account, filename='dolly'):
        metadata = ooyala.ooyala_request('assets', video.external_id, 'metadata')
        key = video_bucket.get_key(metadata['path'])
        assert key.size < 5 * 2 ** 30   # can't copy files bigger than this

        video.filename = get_random_filename()
        dst = Video.get_video_filepath(account, video.filename)
        key.copy(video_bucket.name, dst)
        key.delete()

        ooyala.set_metadata(video.external_id, dict(path=dst, label=account))

    db.session.commit()
