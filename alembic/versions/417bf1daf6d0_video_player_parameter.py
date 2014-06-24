"""video_player_parameter

Revision ID: 417bf1daf6d0
Revises: 4e986bf948b8
Create Date: 2014-06-24 16:06:51.787731

"""

# revision identifiers, used by Alembic.
revision = '417bf1daf6d0'
down_revision = '4e986bf948b8'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'video_player_parameter',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('video', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=1024), nullable=False),
        sa.Column('value', sa.String(length=1024), nullable=False),
        sa.ForeignKeyConstraint(['video'], [u'video.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('video_player_parameter')
