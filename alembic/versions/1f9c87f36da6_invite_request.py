"""invite_request

Revision ID: 1f9c87f36da6
Revises: 1a396b61741f
Create Date: 2014-09-22 18:37:53.102759

"""

# revision identifiers, used by Alembic.
revision = '1f9c87f36da6'
down_revision = '1a396b61741f'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'invite_request',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date_added', sa.DateTime(), nullable=False),
        sa.Column('email', sa.String(length=256), nullable=False),
        sa.Column('name', sa.String(length=256), nullable=True),
        sa.Column('message', sa.String(length=1024), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('invite_request')
