"""empty message

Revision ID: 412873a9f050
Revises: 446bf3194db3
Create Date: 2014-10-02 16:08:17.379271

"""

# revision identifiers, used by Alembic.
revision = '412873a9f050'
down_revision = '446bf3194db3'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'article_featured',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('published_date', sa.DateTime(), nullable=False),
        sa.Column('author_name', sa.String(length=100), nullable=False),
        sa.Column('article_type', sa.String(length=100), nullable=False),
        sa.Column('article_url', sa.String(length=1024), nullable=False),
        sa.Column('title', sa.String(length=1024), nullable=False),
        sa.Column('featured_image', sa.String(length=1024), nullable=False),
        sa.Column('summary', sa.Text, nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'article_featured_category',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=1024), nullable=False, unique=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'article_featured_categories',
        sa.Column('article', sa.Integer(), nullable=False),
        sa.Column('category', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('article', 'category'),
        sa.ForeignKeyConstraint(['article'], ['article_featured.id'], ),
        sa.ForeignKeyConstraint(['category'], ['article_featured_category.id'], )
    )


def downgrade():
    op.drop_table('article_featured_categories')
    op.drop_table('article_featured')
    op.drop_table('article_featured_category')

