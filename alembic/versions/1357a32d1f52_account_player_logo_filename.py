"""account.player_logo_filename

Revision ID: 1357a32d1f52
Revises: 2913f6bf966d
Create Date: 2014-04-30 18:06:36.827700

"""

# revision identifiers, used by Alembic.
revision = '1357a32d1f52'
down_revision = '2913f6bf966d'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('account', sa.Column('player_logo_filename', sa.String(length=128), nullable=True))


def downgrade():
    op.drop_column('account', 'player_logo_filename')
