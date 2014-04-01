"""video.filename

Revision ID: 2913f6bf966d
Revises: 542e7a17fca0
Create Date: 2014-03-31 17:36:14.326963

"""

# revision identifiers, used by Alembic.
revision = '2913f6bf966d'
down_revision = '542e7a17fca0'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video', sa.Column('filename', sa.String(length=16), nullable=True))


def downgrade():
    op.drop_column('video', 'filename')
