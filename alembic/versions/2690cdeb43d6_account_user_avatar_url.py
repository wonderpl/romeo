"""account_user.avatar_url

Revision ID: 2690cdeb43d6
Revises: 541d3e97a140
Create Date: 2014-07-16 23:35:12.518994

"""

# revision identifiers, used by Alembic.
revision = '2690cdeb43d6'
down_revision = '541d3e97a140'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('account_user', sa.Column('avatar_url', sa.String(length=256), nullable=True))


def downgrade():
    op.drop_column('account_user', 'avatar_url')
