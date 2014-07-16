"""video.dolly_instance

Revision ID: 19e094c35693
Revises: 3779b0b1dcbd
Create Date: 2014-07-16 13:25:55.223536

"""

# revision identifiers, used by Alembic.
revision = '19e094c35693'
down_revision = '3779b0b1dcbd'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video', sa.Column('dolly_instance', sa.String(length=128), nullable=True))


def downgrade():
    op.drop_column('video', 'dolly_instance')
