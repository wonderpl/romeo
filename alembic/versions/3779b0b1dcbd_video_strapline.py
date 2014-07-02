"""video.strapline

Revision ID: 3779b0b1dcbd
Revises: 2e0eb523a61f
Create Date: 2014-07-02 18:31:04.546546

"""

# revision identifiers, used by Alembic.
revision = '3779b0b1dcbd'
down_revision = '2e0eb523a61f'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('video_locale_meta', sa.Column('strapline', sa.String(length=1024), nullable=True))
    op.alter_column(
        'video_locale_meta',
        'description',
        existing_type=sa.VARCHAR(length=256),
        type_=sa.Text)
    op.alter_column(
        'video_player_parameter',
        'value',
        existing_type=sa.VARCHAR(length=32),
        type_=sa.String(length=1024),
        existing_nullable=False)


def downgrade():
    op.alter_column(
        'video_locale_meta',
        'description',
        existing_type=sa.Text,
        type_=sa.VARCHAR(length=256))
    op.alter_column(
        'video_player_parameter',
        'value',
        existing_type=sa.String(length=1024),
        type_=sa.VARCHAR(length=32),
        existing_nullable=False)
    op.drop_column('video_locale_meta', 'strapline')
