"""video_collaborator

Revision ID: 4e986bf948b8
Revises: 274331b97f48
Create Date: 2014-06-23 16:27:28.666707

"""

# revision identifiers, used by Alembic.
revision = '4e986bf948b8'
down_revision = '274331b97f48'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'video_collaborator',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('video', sa.Integer(), nullable=False),
        sa.Column('can_download', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('can_comment', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('email', sa.String(length=1024), nullable=False),
        sa.Column('name', sa.String(length=1024), nullable=True),
        sa.ForeignKeyConstraint(['video'], [u'video.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('video_collaborator')
