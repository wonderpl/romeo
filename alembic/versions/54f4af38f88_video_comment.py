"""video_comment

Revision ID: 54f4af38f88
Revises: 417bf1daf6d0
Create Date: 2014-06-25 17:01:09.722262

"""

# revision identifiers, used by Alembic.
revision = '54f4af38f88'
down_revision = '417bf1daf6d0'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'video_comment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('video', sa.Integer(), nullable=False),
        sa.Column('date_added', sa.DateTime(), nullable=False),
        sa.Column('user_type', sa.Enum('account_user', 'collaborator', name='user_type'), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('comment', sa.String(length=1024), nullable=False),
        sa.Column('timestamp', sa.Integer(), nullable=True),
        sa.Column('notification_sent', sa.Boolean(), server_default='false', nullable=False),
        sa.ForeignKeyConstraint(['video'], [u'video.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('video_comment')
