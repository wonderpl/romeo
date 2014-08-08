"""account

Revision ID: 12e777d9e45
Revises: 34ee9f2a5153
Create Date: 2014-08-27 14:44:32.977167

"""

# revision identifiers, used by Alembic.
revision = '12e777d9e45'
down_revision = '34ee9f2a5153'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.execute("create type account_type as enum ('collaborator', 'content_owner')")
    op.add_column('account', sa.Column('payment_token', sa.String(length=256), nullable=True))
    op.add_column('account', sa.Column('account_type', sa.Enum('collaborator', 'content_owner', name='account_type'), nullable=True))
    op.execute("update account set account_type = 'content_owner'")
    op.alter_column('account', 'account_type', nullable=True)

    op.add_column('account_user', sa.Column('contactable', sa.Boolean(), server_default='true', nullable=False))
    op.add_column('account_user', sa.Column('location', sa.CHAR(length=2), nullable=True))
    op.add_column('account_user', sa.Column('title', sa.String(length=256), nullable=True))
    op.add_column('account_user', sa.Column('description', sa.String(length=1024), nullable=True))
    op.add_column('account_user', sa.Column('website_url', sa.String(length=256), nullable=True))
    op.add_column('account_user', sa.Column('search_keywords', sa.String(length=1024), nullable=True))
    op.add_column('account_user', sa.Column('profile_cover_filename', sa.String(length=256), nullable=True))
    op.add_column('account_user', sa.Column('avatar_filename', sa.String(length=256), nullable=True))
    op.drop_column('account_user', 'avatar_url')

    op.create_table(
        'account_user_connection',
        sa.Column('account_user', sa.Integer(), nullable=False),
        sa.Column('connection', sa.Integer(), nullable=False),
        sa.Column('date_added', sa.DateTime(), nullable=False),
        sa.Column('state', sa.Enum('pending', 'accepted', name='connection_state'), nullable=False),
        sa.Column('message', sa.String(length=1024), nullable=True),
        sa.ForeignKeyConstraint(['account_user'], [u'account_user.id'], ),
        sa.ForeignKeyConstraint(['connection'], [u'account_user.id'], ),
        sa.PrimaryKeyConstraint('account_user', 'connection')
    )


def downgrade():
    op.drop_column('account', 'payment_token')
    op.drop_column('account', 'account_type')
    op.execute("drop type account_type")

    op.add_column('account_user', sa.Column('avatar_url', sa.VARCHAR(length=256), autoincrement=False, nullable=True))
    op.drop_column('account_user', 'avatar_filename')
    op.drop_column('account_user', 'profile_cover_filename')
    op.drop_column('account_user', 'search_keywords')
    op.drop_column('account_user', 'description')
    op.drop_column('account_user', 'website_url')
    op.drop_column('account_user', 'title')
    op.drop_column('account_user', 'location')
    op.drop_column('account_user', 'contactable')

    op.drop_table('account_user_connection')
    op.execute("drop type connection_state")
