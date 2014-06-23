import re
import unittest
from mock import patch, DEFAULT
from flask import current_app, json
from wonder.romeo.video.models import Video
from .helpers import client_for_account
from .fixtures import genimg


class VideoEditTestCase(unittest.TestCase):

    def test_edit_description(self):
        description = 'xyzzy'
        video = Video.query.first()
        with client_for_account(video.account_id) as client:
            r = client.patch('/api/video/%d' % video.id,
                             data=dict(description=description))
            self.assertEquals(r.status_code, 200)
            data = json.loads(r.data)
            self.assertEqual(data['description'], description)
        self.assertEqual(video.locale_meta[0].description, description)

    def test_edit_player_logo(self):
        formdata = dict(player_logo=(genimg(), 'img.png'))
        video = Video.query.filter_by(player_logo_filename=None).first()
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
        video = Video.query.first()
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


class VideoCollaboratorTestCase(unittest.TestCase):

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
