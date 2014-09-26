"""search

Revision ID: 5704adc6d42c
Revises: 20ef698b860b
Create Date: 2014-09-26 14:02:44.800682

"""

# revision identifiers, used by Alembic.
revision = '5704adc6d42c'
down_revision = '20ef698b860b'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

try:
    from wonder.romeo.search.models import (
        ACCOUNT_USER_SEARCH_VECTOR, VIDEO_SEARCH_VECTOR,
        account_user_search_vector_trigger, video_search_vector_trigger,
        video_local_meta_update_trigger)
except ImportError:
    pass


def upgrade():
    # account_user.date_updated
    op.add_column('account_user', sa.Column('date_updated', sa.DateTime()))
    op.execute('update account_user set date_updated = date_added')
    op.alter_column('account_user', 'date_updated', nullable=False)

    # account_user.search_vector, triggers & indexes
    op.add_column('account_user', sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True))
    op.execute('''
        update account_user set search_vector = search_vector.vector
        from (
            select new.id, %s as vector
            from account_user new
            left join video v on v.account = new.account
            left join video_locale_meta vlm on vlm.video = v.id and vlm.locale = ''
            group by new.id
        ) search_vector
        where search_vector.id = account_user.id;
    ''' % ACCOUNT_USER_SEARCH_VECTOR)
    op.execute(account_user_search_vector_trigger)
    op.execute('''
        create index account_user_search_vector_idx on account_user using gist(search_vector);
    ''')

    # video.search_vector, triggers & indexes
    op.add_column('video', sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True))
    op.execute('''
        update video set search_vector = search_vector.vector
        from (
            select new.id, %s as vector
            from video new
            join account a on a.id = new.account
            left join video_locale_meta vlm on vlm.video = new.id and vlm.locale = ''
            group by new.id, a.id, vlm.id
        ) search_vector
        where search_vector.id = video.id;
    ''' % VIDEO_SEARCH_VECTOR)
    op.execute(video_search_vector_trigger)
    op.execute('''
        create index video_search_vector_idx on video using gist(search_vector);
    ''')

    # propogate video_locale_meta changes to video
    op.execute(video_local_meta_update_trigger)


def downgrade():
    op.execute('''
        drop trigger video_local_meta_update on video_locale_meta;
    ''')

    op.execute('''
        drop trigger video_search_vector_update on video;
        drop function video_search_vector_trigger();
    ''')
    op.drop_column('video', 'search_vector')

    op.execute('''
        drop trigger account_user_search_vector_update on account_user;
        drop function account_user_search_vector_trigger();
    ''')
    op.drop_column('account_user', 'search_vector')
    op.drop_column('account_user', 'date_updated')
