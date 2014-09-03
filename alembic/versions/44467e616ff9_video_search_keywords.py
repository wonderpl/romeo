"""video.search_keywords

Revision ID: 44467e616ff9
Revises: 12e777d9e45
Create Date: 2014-09-03 18:01:22.063246

"""

# revision identifiers, used by Alembic.
revision = '44467e616ff9'
down_revision = '12e777d9e45'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video', sa.Column('hosted_url', sa.String(length=1024), nullable=True))
    op.add_column('video', sa.Column('search_keywords', sa.String(length=1024), nullable=True))


def downgrade():
    op.drop_column('video', 'search_keywords')
    op.drop_column('video', 'hosted_url')
