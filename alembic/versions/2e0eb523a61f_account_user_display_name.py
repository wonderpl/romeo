"""account_user.display_name

Revision ID: 2e0eb523a61f
Revises: 54f4af38f88
Create Date: 2014-06-26 14:13:28.935011

"""

# revision identifiers, used by Alembic.
revision = '2e0eb523a61f'
down_revision = '54f4af38f88'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('account_user', sa.Column('display_name', sa.String(length=256), nullable=True))


def downgrade():
    op.drop_column('account_user', 'display_name')
