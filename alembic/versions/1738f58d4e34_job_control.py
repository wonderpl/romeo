"""job_control

Revision ID: 1738f58d4e34
Revises: 45cb3d01a085
Create Date: 2014-08-05 17:30:53.351798

"""

# revision identifiers, used by Alembic.
revision = '1738f58d4e34'
down_revision = '45cb3d01a085'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.create_table(
        'job_control',
        sa.Column('job', sa.String(length=32), nullable=False),
        sa.Column('next_run', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('job')
    )


def downgrade():
    op.drop_table('job_control')
