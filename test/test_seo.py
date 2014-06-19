import unittest
import random
from mock import patch
from flask import current_app, json
from wonder.romeo import db
from wonder.romeo.account.commands import createuser
from wonder.romeo.video.models import Video, VideoLocaleMeta


class SeoTestCase(unittest.TestCase):

    def _create_test_user(self, **kwargs):
        uid = str(random.getrandbits(20))
        data = dict(
            account=uid,
            username='noreply+%s@wonderpl.com' % uid,
        )
        data.update(kwargs)
        with patch('wonder.romeo.core.dolly.login') as login:
            login.return_value = dict(user_id='abc', access_token='xxx')
            createuser(**data)
        return data

    def test_add_embed(self):
        credentials = dict(username='c@d.com', password='123')
        accountdata = dict(display_name='testes', description=None, avatar_thumbnail_url='', profile_cover_url='')
        self._create_test_user(**credentials)

        with patch('wonder.romeo.account.views.DollyUser') as DollyUser:
            DollyUser.return_value.get_userdata.return_value = accountdata
            with current_app.test_client() as client:
                r = client.post('/api/login', data=credentials)
                login_data = json.loads(r.data)
                account_id = login_data['account']['href'].split('/')[-1]

                # Create a new video
                # TODO: this should be a feature or something

                new_video = Video(
                    account_id=account_id,
                    status='ready',
                    title='a video title',
                    filename='filename.mp4',
                    duration=120,
                    external_id='xxx')
                db.session.add(new_video)
                db.session.flush()

                new_video_meta = VideoLocaleMeta(
                    video_id=new_video.id,
                    locale='en-gb',
                    description='a description',
                    title=new_video.title)
                db.session.add(new_video_meta)
                db.session.commit()

                embed_data = {
                    'video_id': new_video.id,
                    'link_url': 'http://some.domain.com'
                }

                # Add a new sitemap entry

                r = client.post(
                    '/api/seo/account/{}/sitemaps'.format(account_id),
                    data=embed_data
                )

                # Check the addition

                r = client.get('/api/seo/account/{}/sitemaps'.format(account_id))
                data = json.loads(r.data)

                embed = data['embeds'][0]

                self.assertEquals(data['total'], 1)
                self.assertEquals(embed['link_url'], embed_data['link_url'])
                self.assertEquals(embed['title'], new_video.title)
                self.assertEquals(embed['description'], new_video.description)

                # Delete the sitemap entry

                r = client.delete('/api/seo/account/{}/sitemaps/{}'.format(account_id, embed['id']))
                self.assertEquals(r.status_code, 204)

                # Check deletion

                r = client.get('/api/seo/account/{}/sitemaps'.format(account_id))
                data = json.loads(r.data)

                self.assertEquals(data['total'], 0)
