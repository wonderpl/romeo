"""user

Revision ID: 534bed448ef7
Revises: None
Create Date: 2014-02-19 18:50:16.163403

"""

# revision identifiers, used by Alembic.
revision = '534bed448ef7'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=128), nullable=False),
        sa.Column('password_hash', sa.String(length=128), nullable=False),
        sa.Column('active', sa.Boolean(), server_default='true', nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )


def downgrade():
    op.drop_table('user')
