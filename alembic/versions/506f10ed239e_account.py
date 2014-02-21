"""account

Revision ID: 506f10ed239e
Revises: None
Create Date: 2014-02-19 21:02:45.319781

"""

# revision identifiers, used by Alembic.
revision = '506f10ed239e'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'account',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('wonder_user', sa.CHAR(length=22), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'account_user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('account', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=128), nullable=False),
        sa.Column('password_hash', sa.String(length=128), nullable=False),
        sa.Column('active', sa.Boolean(), server_default='true', nullable=False),
        sa.ForeignKeyConstraint(['account'], [u'account.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )
    op.create_index('ix_account_user_account', 'account_user', ['account'])


def downgrade():
    op.drop_table('account_user')
    op.drop_table('account')
