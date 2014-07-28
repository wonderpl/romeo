"""account_user_auth_token

Revision ID: 34ee9f2a5153
Revises: 1738f58d4e34
Create Date: 2014-07-30 18:40:18.247645

"""

# revision identifiers, used by Alembic.
revision = '34ee9f2a5153'
down_revision = '1738f58d4e34'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'account_user_auth_token',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('account_user', sa.Integer(), nullable=False),
        sa.Column('external_system', sa.Enum('email', 'facebook', 'twitter', 'google', 'apns', 'dolly', name='external_system'), nullable=False),
        sa.Column('external_uid', sa.String(length=1024), nullable=False),
        sa.Column('external_token', sa.String(length=1024), nullable=False),
        sa.Column('permissions', sa.String(length=1024), nullable=True),
        sa.Column('meta', sa.String(length=1024), nullable=True),
        sa.Column('expires', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['account_user'], [u'account_user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.add_column('account', sa.Column('date_added', sa.DateTime()))
    op.execute("update account set date_added = now()")
    op.alter_column('account', 'date_added', nullable=False)

    op.add_column('account_user', sa.Column('date_added', sa.DateTime()))
    op.execute("update account_user set date_added = now()")
    op.alter_column('account_user', 'date_added', nullable=False)

    op.alter_column(
        'account_user',
        'password_hash',
        existing_type=sa.VARCHAR(length=128),
        nullable=True
    )


def downgrade():
    op.drop_column('account_user', 'date_added')
    op.drop_column('account', 'date_added')

    op.alter_column(
        'account_user',
        'password_hash',
        existing_type=sa.VARCHAR(length=128),
        nullable=False
    )
    op.drop_table('account_user_auth_token')
