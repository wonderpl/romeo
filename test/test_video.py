import re
import unittest
from mock import patch, MagicMock, DEFAULT
from fixture import DataTestCase
from flask import current_app, json, g
from wonder.romeo import db
from wonder.romeo.account.models import AccountUser
from wonder.romeo.video.models import Video, VideoLocaleMeta, VideoComment
from .helpers import client_for_account, client_for_user, client_for_collaborator
from .fixtures import dbfixture, DataSet, genimg


class TestCase(unittest.TestCase):

    def tearDown(self):
        # clear cached mocks from g (the s3 module in particular uses this)
        for key, value in g.__dict__.items():
            if isinstance(value, MagicMock):
                delattr(g, key)


class VideoWorkflowTestCase(DataTestCase, TestCase):

    class AccountData(DataSet):
        class account:
            id = 1001
            name = 'test'
            dolly_user = 'dudu'

    class AccountUserData(DataSet):
        class user:
            id = 1101
            account_id = 1001
            username = 'noreply+1101@wonderpl.com'
            password_hash = ''

    class VideoTagData(DataSet):
        class tag:
            account_id = 1001
            label = 'published'
            dolly_channel = 'ddd'

    fixture = dbfixture
    datasets = AccountData, AccountUserData, VideoTagData

    def tearDown(self):
        g.__dict__ = {}

    def test_video_workflow(self):
        account = self.data.AccountData.account

        with client_for_account(account.id) as client:
            # create new video
            r = client.post('/api/account/%d/videos' % account.id,
                            content_type='application/json',
                            data=json.dumps(dict(title='test')))
            self.assertEquals(r.status_code, 201)
            data = json.loads(r.data)
            self.assertEquals(data['status'], 'uploading')
            videoid = data['id']
            resource = data['href']

            self.assertEquals(Video.query.get(videoid).title, 'test')

            # update description
            r = client.patch(resource, content_type='application/json',
                             data=json.dumps(dict(description='desc')))
            self.assertEquals(r.status_code, 200)
            data = json.loads(r.data)
            self.assertEquals(data['status'], 'uploading')
            self.assertEquals(data['description'], 'desc')

            meta = VideoLocaleMeta.query.filter_by(video_id=videoid).one()
            self.assertEquals(meta.locale, '')
            self.assertEquals(meta.description, 'desc')

        external_id = 'EEEE'

        # set uploaded file
        with patch('wonder.romeo.core.ooyala.ooyala_request') as ooyala_request:
            def _ooyala_request(*args, **kwargs):
                if args == ('assets',):     # create asset
                    return dict(embed_code=external_id)
                elif args == ('labels',):
                    return dict(items=[dict(id=1, name=str(account.id))])
                elif 'uploading_urls' in args:
                    return []
            ooyala_request.side_effect = _ooyala_request
            with patch('boto.connect_s3'):
                with current_app.test_request_context():
                    with client_for_account(account.id) as client:
                        r = client.patch(resource, content_type='application/json',
                                         data=json.dumps(dict(filename='xxx')))
                        self.assertEquals(r.status_code, 200)
                        data = json.loads(r.data)
                        self.assertEquals(data['status'], 'processing')

            ooyala_request.assert_called_with('assets', external_id, 'upload_status',
                                              data='{"status": "uploaded"}', method='put')

            self.assertEquals(Video.query.get(videoid).external_id, external_id)

        # ooyala callback
        with patch('wonder.romeo.video.views.get_video_data') as get_video_data:
            get_video_data.side_effect = lambda i: dict(
                status='live',
                upload_status={},
                duration=42000,
                thumbnails=[dict(url='t1', width=1, height=1)]
            )
            with patch('wonder.romeo.video.forms.send_email') as send_email:
                with current_app.test_client() as client:
                    r = client.get('/_ooyala/callback', query_string=dict(embedCode=external_id))
                    self.assertEquals(r.status_code, 204)
                self.assertEquals(send_email.call_args[0][0],
                                  self.data.AccountUserData.user.username)
                self.assertIn('/video/%d' % videoid, send_email.call_args[0][1])

            self.assertEquals(Video.query.get(videoid).status, 'ready')

        # publish
        with patch('wonder.romeo.core.dolly.DollyUser.publish_video') as publish_video:
            publish_video.return_value = 'vi123'
            with patch('wonder.romeo.video.forms.send_email') as send_email:
                with client_for_account(account.id) as client:
                    r = client.post(resource + '/tags',
                                    data=dict(id=self.data.VideoTagData.tag.id))
                    self.assertEquals(r.status_code, 201)
                publish_video.assert_called_with(self.data.VideoTagData.tag.dolly_channel,
                                                 dict(source_id=external_id))
                dolly_link = '/%s/?video=%s' % (
                    self.data.VideoTagData.tag.dolly_channel, publish_video.return_value)
                self.assertIn(dolly_link, send_email.call_args[0][1])

                self.assertEquals(Video.query.get(videoid).status, 'published')

        # update
        with patch('wonder.romeo.core.dolly._request') as dolly_request:
            with client_for_account(account.id) as client:
                r = client.patch(resource, content_type='application/json',
                                 data=json.dumps(dict(title='new title')))
                self.assertEquals(r.status_code, 200)
            (path, method), kwargs = dolly_request.call_args
            self.assertEquals(path, 'pubsubhubbub/callback')
            self.assertIn('X-Hub-Signature', kwargs['headers'])
            data = json.loads(kwargs['data'])
            self.assertEquals(data['id'], videoid)
            self.assertEquals(data['video']['source_id'], external_id)
            self.assertEquals(data['title'], 'new title')

        # delete
        with patch('wonder.romeo.core.dolly._request') as dolly_request:
            with client_for_account(account.id) as client:
                r = client.delete(resource)
                self.assertEquals(r.status_code, 204)
            (path, method), kwargs = dolly_request.call_args
            self.assertEquals(path, '%s/channels/%s/videos/' % (
                self.data.AccountData.account.dolly_user,
                self.data.VideoTagData.tag.dolly_channel))
            self.assertEquals(kwargs['jsondata'], [])


class VideoMetaTestCase(TestCase):

    def test_download_url(self):
        video = Video.query.filter(Video.filename != None).first()
        with patch('boto.connect_s3') as s3:
            url = 'http://s3/xxx'
            s3.return_value.get_bucket.return_value.get_key.return_value.\
                generate_url.return_value = url
            with client_for_account(video.account_id) as client:
                r = client.get('/api/video/%d/download_url' % video.id)
                self.assertEquals(r.status_code, 302)
                self.assertEquals(r.headers['Location'], url)
                self.assertEquals(json.loads(r.data)['url'], url)

    def test_share_url(self):
        video = Video.query.filter_by(status='published').first()
        with patch('wonder.romeo.core.dolly.DollyUser.get_share_link') as get_share_link:
            url = 'http://wonderpl.com/xxx'
            get_share_link.return_value = url
            url += '?utm_source=facebook'
            with client_for_account(video.account_id) as client:
                r = client.get('/api/video/%d/share_url?target=facebook' % video.id)
                self.assertEquals(r.status_code, 302)
                self.assertEquals(r.headers['Location'], url)
                self.assertEquals(json.loads(r.data)['url'], url)


class VideoEditTestCase(TestCase):

    def test_edit_description(self):
        description = 'xyzzy'
        video = Video.query.filter_by(status='ready').first()
        with client_for_account(video.account_id) as client:
            r = client.patch('/api/video/%d' % video.id,
                             data=dict(description=description))
            self.assertEquals(r.status_code, 200)
            data = json.loads(r.data)
            self.assertEqual(data['description'], description)
        self.assertEqual(video.locale_meta[0].description, description)

    def test_edit_player_logo(self):
        formdata = dict(player_logo=(genimg(), 'img.png'))
        video = Video.query.filter_by(status='ready').first()
        with patch('wonder.romeo.video.forms.upload_file') as upload_file:
            with client_for_account(video.account_id) as client:
                r = client.patch('/api/video/%d' % video.id,
                                 content_type='multipart/form-data', data=formdata)
                self.assertEquals(r.status_code, 200)
                data = json.loads(r.data)
                self.assertIn(upload_file.call_args[0][1], data['player_logo_url'])
        self.assertIsNotNone(video.player_logo_filename)

    def test_edit_cover(self):
        formdata = dict(cover_image=(genimg((800, 450), 'jpeg'), 'img.jpg'))
        video = Video.query.filter_by(status='ready').first()
        patches = {f: DEFAULT for f in ('ooyala_request', 'download_file', 'upload_file')}
        with patch.multiple('wonder.romeo.video.forms', **patches) as patched:
            with client_for_account(video.account_id) as client:
                r = client.patch('/api/video/%d' % video.id,
                                 content_type='multipart/form-data', data=formdata)
                self.assertEquals(r.status_code, 200)
                data = json.loads(r.data)
                self.assertIn(patched['upload_file'].call_args[0][1],
                              data['thumbnails']['items'][0]['url'])

                # Pass the uploaded content back to download_file for the
                # background thumbnailing process in create_cover_thumbnails
                patched['download_file'].return_value =\
                    patched['upload_file'].call_args[0][2].getvalue()

            self.assertTrue(patched['ooyala_request'].called)
            self.assertEquals(patched['ooyala_request'].call_args[0][2], 'preview_image_files')

        self.assertGreater(len(video.thumbnails), 2)
        widths = [t.width for t in video.thumbnails]
        for w in (800,) + zip(*current_app.config['COVER_THUMBNAIL_SIZES'])[0][:3]:
            self.assertIn(w, widths)


class VideoCommentTestCase(DataTestCase, TestCase):

    class AccountData(DataSet):
        class account:
            id = 4001
            name = 'test'

    class AccountUserData(DataSet):
        class user:
            id = 4101
            account_id = 4001
            username = 'noreply+user1@wonderpl.com'
            password_hash = ''

    class VideoData(DataSet):
        class video:
            id = 4201
            account_id = 4001
            title = 'test'

    class VideoCollaboratorData(DataSet):
        class collab1:
            id = 4301
            video_id = 4201
            email = 'noreply+collab1@wonderpl.com'
            name = 'collab1'
            can_comment = True

    class VideoCommentData(DataSet):
        class comment1:
            video_id = 4201
            comment = 'xyzzy1'
            timestamp = 60
            user_type = 'account_user'
            user_id = 4101
            notification_sent = True

        class comment2:
            video_id = 4201
            comment = 'xyzzy2'
            user_type = 'account_user'
            user_id = 4101

        class comment3:
            video_id = 4201
            comment = 'xyzzy3'
            user_type = 'collaborator'
            user_id = 4301

    fixture = dbfixture
    datasets = AccountData, AccountUserData, VideoData, VideoCollaboratorData, VideoCommentData

    def test_get_comments(self):
        collabid = self.data.VideoCollaboratorData.collab1.id
        video = self.data.VideoData.video
        with client_for_collaborator(collabid) as client:
            r = client.get('/api/video/%d/comments' % video.id)
            comments = json.loads(r.data)['comment']['items']
            self.assertItemsEqual(
                set(c['username'] for c in comments),
                (self.data.AccountUserData.user.username,
                 self.data.VideoCollaboratorData.collab1.name))
            self.assertItemsEqual(
                [c['comment'] for c in comments],
                [c.comment for k, c in self.data.VideoCommentData])

    def test_post_comment(self):
        user = AccountUser.query.first()
        video = user.account.videos[0]
        comment = dict(comment='A test comment', timestamp=60)

        with client_for_user(user.id) as client:
            r = client.post('/api/video/%d/comments' % video.id,
                            content_type='application/json', data=json.dumps(comment))
            self.assertEquals(r.status_code, 201)

            r = client.get('/api/video/%d/comments' % video.id)
            comments = json.loads(r.data)['comment']['items']
            self.assertEqual(comments[0]['comment'], comment['comment'])
            self.assertEqual(comments[0]['username'], user.username)

    def test_comment_notification(self):
        # commit fixture data so it's still available for the background call
        db.session.commit()

        resource_url = '/api/video/%d/comments/notification' % self.data.VideoData.video.id

        with patch('wonder.romeo.video.forms.send_email') as send_email:
            with client_for_user(self.data.AccountUserData.user.id) as client:
                r = client.post(resource_url)
                self.assertEquals(r.status_code, 204)

            email_body = send_email.call_args[0][1]
            # comment 1 already had notification sent
            self.assertNotIn(self.data.VideoCommentData.comment1.comment, email_body)
            # comment 2 is new
            self.assertIn(self.data.VideoCommentData.comment2.comment, email_body)
            # comment 3 is by somebody else
            self.assertNotIn(self.data.VideoCommentData.comment3.comment, email_body)

            self.assertItemsEqual(
                [self.data.AccountUserData.user.username,
                 self.data.VideoCollaboratorData.collab1.email],
                zip(*zip(*send_email.call_args_list)[0])[0])

        comment = VideoComment.query.get(self.data.VideoCommentData.comment2.id)
        self.assertTrue(comment.notification_sent)

        # 2nd time around, there are no comments left to notify about
        with patch('wonder.romeo.video.forms.send_email') as send_email:
            with client_for_user(self.data.AccountUserData.user.id) as client:
                r = client.post(resource_url)
                self.assertEquals(r.status_code, 204)
            self.assertFalse(send_email.called)


class VideoCollaboratorTestCase(TestCase):

    def test_invite_collaborator(self):
        video = Video.query.first()
        recipient = 'noreply@wonderpl.com'

        with patch('wonder.romeo.video.forms.send_email') as send_email:
            with client_for_account(video.account_id) as client:
                jsondata = json.dumps(dict(email=recipient, name='test'))
                r = client.post('/api/video/%d/collaborators' % video.id,
                                content_type='application/json', data=jsondata)
                self.assertEquals(r.status_code, 204)

            self.assertEqual(send_email.call_args[0][0], recipient)
            self.assertIn('/video/%d' % video.id, send_email.call_args[0][1])

            token = re.search('token=([\w.-]+)', send_email.call_args[0][1]).group(1)

        # Check that collaborator can access video with token
        with current_app.test_client() as client:
            r = client.post('/api/validate_token', data=dict(token=token))
            self.assertEquals(r.status_code, 204)

            r = client.get('/api/video/%d' % video.id)
            self.assertEquals(r.status_code, 200)

        # Same request for anonymous should fail
        with current_app.test_client() as client:
            r = client.get('/api/video/%d' % video.id)
            self.assertEquals(r.status_code, 401)


class VideoPlayerParametersTestCase(TestCase):

    def test_player_parameters(self):
        video = Video.query.first()
        params = dict(color='00ff00', show_logo='true')

        with client_for_account(video.account_id) as client:
            r = client.put('/api/video/%d/player_parameters' % video.id,
                           content_type='application/json', data=json.dumps(params))
            self.assertEquals(r.status_code, 204)

        with current_app.test_client() as client:
            r = client.get('/api/v/%d' % video.id)
            self.assertEquals(r.status_code, 200)
            videodata = json.loads(r.data)['video']
            self.assertItemsEqual(videodata['source_player_parameters'].items(),
                                  params.items())
