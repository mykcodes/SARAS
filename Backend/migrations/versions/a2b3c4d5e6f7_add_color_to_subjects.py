"""add color column to subjects

Revision ID: a2b3c4d5e6f7
Revises: f125f2c72920
Create Date: 2026-07-31 03:10:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a2b3c4d5e6f7'
down_revision: Union[str, None] = 'f125f2c72920'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('subjects', sa.Column('color', sa.String(length=7), nullable=False, server_default='#D9A441'))


def downgrade() -> None:
    op.drop_column('subjects', 'color')
