import unittest
import pytest
from mock import patch
from wonder.romeo import db
from wonder.romeo.video.models import Video
from .helpers import client_for_new_user, client_for_account


skip_if_not_postgres = pytest.mark.skipif(
    db.engine.name != 'postgresql', reason='Postgres database required')


class VideoSearchTestCase(unittest.TestCase):

    @skip_if_not_postgres
    def test_video_search(self):
        with client_for_new_user() as client:
            r = client.get('/api/search', query_string=dict(q='video'))
            self.assertGreater(r.json()['video']['total'], 0)


class UserSearchTestCase(unittest.TestCase):

    @skip_if_not_postgres
    def test_user_search(self):
        with client_for_new_user() as client:
            r = client.get('/api/search', query_string=dict(q='test', src='collaborator'))
            self.assertGreater(r.json()['collaborator']['total'], 0)

    @skip_if_not_postgres
    def test_keyword_search(self):
        uniq_keyword = 'xyzzy'
        query_string = 'src=video&src=content_owner&q=' + uniq_keyword
        video = Video.query.filter_by(status='published').first()
        with patch('wonder.romeo.video.forms.push_video_data'):
            with client_for_account(video.account_id) as client:
                r = client.get('/api/search', query_string=query_string)
                self.assertEquals(r.json()['video']['total'], 0)
                self.assertEquals(r.json()['content_owner']['total'], 0)

                r = client.patch(video.href, json=dict(search_keywords=uniq_keyword))
                self.assertEquals(r.status_code, 200)

                r = client.get('/api/search', query_string=query_string)
                self.assertEquals(r.json()['video']['total'], 1)
                items = r.json()['video']['items']
                self.assertIn(video.id, [i['id'] for i in items])

                self.assertEquals(r.json()['content_owner']['total'], 1)
                items = r.json()['content_owner']['items']
                self.assertIn(video.account.users[0].id, [i['id'] for i in items])
