"""video_collaborator.account_user

Revision ID: 1a396b61741f
Revises: 1aba0b650a7d
Create Date: 2014-09-16 17:04:08.599618

"""

# revision identifiers, used by Alembic.
revision = '1a396b61741f'
down_revision = '1aba0b650a7d'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video_collaborator', sa.Column('account_user', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('video_collaborator', 'account_user')
