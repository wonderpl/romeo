"""registration_token

Revision ID: 1aba0b650a7d
Revises: 44467e616ff9
Create Date: 2014-09-09 22:01:11.964034

"""

# revision identifiers, used by Alembic.
revision = '1aba0b650a7d'
down_revision = '44467e616ff9'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'registration_token',
        sa.Column('id', sa.String(length=128), nullable=False),
        sa.Column('date_added', sa.DateTime(), nullable=False),
        sa.Column('recipient', sa.String(length=256), nullable=False),
        sa.Column('account_user', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['account_user'], [u'account_user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('registration_token')
