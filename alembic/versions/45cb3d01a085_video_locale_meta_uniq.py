"""video_locale_meta.uniq

Revision ID: 45cb3d01a085
Revises: 2690cdeb43d6
Create Date: 2014-08-05 11:46:54.120647

"""

# revision identifiers, used by Alembic.
revision = '45cb3d01a085'
down_revision = '2690cdeb43d6'

from alembic import op


def upgrade():
    op.create_unique_constraint(None, 'video_locale_meta', ['video', 'locale'])


def downgrade():
    op.drop_constraint(None, 'video_locale_meta')
