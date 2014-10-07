"""empty message

Revision ID: 56062aa2c0f6
Revises: 412873a9f050
Create Date: 2014-10-06 12:09:40.948412

"""

# revision identifiers, used by Alembic.
revision = '56062aa2c0f6'
down_revision = '1f9c87f36da6'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'featured_user',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user'], [u'account_user.id'], )
    )

    op.create_table(
        'featured_article',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('author_id', sa.Integer()),
        sa.Column('published_date', sa.DateTime(), nullable=False),
        sa.Column('author_name', sa.String(length=100)),
        sa.Column('article_type', sa.String(length=100), nullable=False),
        sa.Column('article_url', sa.String(length=1024), nullable=False),
        sa.Column('title', sa.String(length=1024), nullable=False),
        sa.Column('featured_image', sa.String(length=1024), nullable=False),
        sa.Column('summary', sa.Text, nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'featured_article_category',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=1024), nullable=False, unique=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'featured_article_categories',
        sa.Column('article', sa.Integer(), nullable=False),
        sa.Column('category', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('article', 'category'),
        sa.ForeignKeyConstraint(['article'], ['featured_article.id'], ),
        sa.ForeignKeyConstraint(['category'], ['featured_article_category.id'], )
    )


def downgrade():
    op.drop_table('featured_user')
    op.drop_table('featured_article_categories')
    op.drop_table('featured_article_category')
    op.drop_table('featured_article')
