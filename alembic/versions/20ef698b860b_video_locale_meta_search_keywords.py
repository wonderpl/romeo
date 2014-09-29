"""video_locale_meta.search_keywords

Revision ID: 20ef698b860b
Revises: 1f9c87f36da6
Create Date: 2014-09-29 16:38:11.192741

"""

# revision identifiers, used by Alembic.
revision = '20ef698b860b'
down_revision = '1f9c87f36da6'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.drop_column('video', 'search_keywords')
    op.add_column('video_locale_meta', sa.Column('search_keywords', sa.String(length=1024), nullable=True))


def downgrade():
    op.drop_column('video_locale_meta', 'search_keywords')
    op.add_column('video', sa.Column('search_keywords', sa.VARCHAR(length=1024), autoincrement=False, nullable=True))
