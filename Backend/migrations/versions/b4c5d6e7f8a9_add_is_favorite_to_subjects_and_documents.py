"""add is_favorite to subjects and documents

Revision ID: b4c5d6e7f8a9
Revises: a2b3c4d5e6f7
Create Date: 2026-08-01 05:09:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b4c5d6e7f8a9'
down_revision: Union[str, None] = 'a2b3c4d5e6f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'subjects',
        sa.Column('is_favorite', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    )
    op.add_column(
        'documents',
        sa.Column('is_favorite', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    )


def downgrade() -> None:
    op.drop_column('documents', 'is_favorite')
    op.drop_column('subjects', 'is_favorite')
