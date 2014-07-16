"""video_comment.resolved

Revision ID: 541d3e97a140
Revises: 3779b0b1dcbd
Create Date: 2014-07-16 21:56:33.403764

"""

# revision identifiers, used by Alembic.
revision = '541d3e97a140'
down_revision = '3779b0b1dcbd'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video_comment', sa.Column('resolved', sa.Boolean(), server_default='false', nullable=False))


def downgrade():
    op.drop_column('video_comment', 'resolved')
