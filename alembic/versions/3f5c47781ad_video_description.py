"""video.description

Revision ID: 3f5c47781ad
Revises: 34c5a325a778
Create Date: 2014-05-02 17:39:39.413719

"""

# revision identifiers, used by Alembic.
revision = '3f5c47781ad'
down_revision = '34c5a325a778'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.drop_column('video', 'description')


def downgrade():
    op.add_column('video', sa.Column('description', sa.VARCHAR(length=256), nullable=True))
