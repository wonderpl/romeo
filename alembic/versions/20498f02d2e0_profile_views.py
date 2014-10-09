"""empty message

Revision ID: 20498f02d2e0
Revises: 5704adc6d42c
Create Date: 2014-10-09 10:41:56.386663

"""

# revision identifiers, used by Alembic.
revision = '20498f02d2e0'
down_revision = '5704adc6d42c'

import datetime
from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'account_user_visit',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('visitor', sa.Integer(), nullable=False),
        sa.Column('profile', sa.Integer(), nullable=False),
        sa.Column('visit_date', sa.DateTime(), default=datetime.datetime.utcnow),
        sa.Column('notified', sa.Boolean(), default=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['visitor'], ['account_user.id'], ),
        sa.ForeignKeyConstraint(['profile'], ['account_user.id'], )
    )


def downgrade():
    op.drop_table('account_user_visit')
