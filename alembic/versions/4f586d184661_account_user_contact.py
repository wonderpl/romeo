"""account_user_contact

Revision ID: 4f586d184661
Revises: 20498f02d2e0
Create Date: 2014-10-13 12:09:40.220074

"""

# revision identifiers, used by Alembic.
revision = '4f586d184661'
down_revision = '20498f02d2e0'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM


def upgrade():
    op.create_table(
        'account_user_contact',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('account_user', sa.Integer(), nullable=False),
        sa.Column('date_added', sa.DateTime(), nullable=False),
        sa.Column('external_system', ENUM(name='external_system', create_type=False), nullable=False),
        sa.Column('external_uid', sa.String(length=1024), nullable=False),
        sa.Column('display_name', sa.String(length=256), nullable=True),
        sa.Column('email', sa.String(length=256), nullable=True),
        sa.ForeignKeyConstraint(['account_user'], [u'account_user.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('account_user', 'external_system', 'external_uid')
    )
    op.execute("commit")
    op.execute("alter type external_system add value 'yahoo' after 'google'")
    op.execute("alter type external_system add value 'live' after 'yahoo'")


def downgrade():
    op.drop_table('account_user_contact')
