"""video.player_logo_filename

Revision ID: 34c5a325a778
Revises: 1357a32d1f52
Create Date: 2014-05-01 15:59:36.272269

"""

# revision identifiers, used by Alembic.
revision = '34c5a325a778'
down_revision = '1357a32d1f52'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.drop_column('account', 'player_logo_filename')
    op.add_column('video', sa.Column('player_logo_filename', sa.String(length=128), nullable=True))


def downgrade():
    op.drop_column('video', 'player_logo_filename')
    op.add_column('account', sa.Column('player_logo_filename', sa.VARCHAR(length=128), nullable=True))
