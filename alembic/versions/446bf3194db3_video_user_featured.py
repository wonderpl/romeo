"""empty message

Revision ID: 446bf3194db3
Revises: 1f9c87f36da6
Create Date: 2014-10-02 13:36:11.466330

"""

# revision identifiers, used by Alembic.
revision = '446bf3194db3'
down_revision = '1f9c87f36da6'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'account_user_featured',
        sa.Column('user', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('user'),
        sa.ForeignKeyConstraint(['user'], [u'account_user.id'], )
    )


def downgrade():
    op.drop_table('account_user_featured')
