"""
Alembic environment configuration.

This file is sourced by Alembic CLI to discover the target_metadata and
the database URL. It imports all models so metadata is complete.
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# ── Saraswati imports ─────────────────────────────────────────────────────────
import sys
import os

# Add the backend dir to sys.path so `app.*` imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.config import settings
from app.database.base import Base

# Register all models with Base.metadata
import app.models.user      # noqa: F401
import app.models.subject   # noqa: F401
import app.models.document  # noqa: F401
import app.models.chat      # noqa: F401
import app.models.message   # noqa: F401

# ── Alembic config ────────────────────────────────────────────────────────────
config = context.config

# Set the sqlalchemy.url from our settings (overrides alembic.ini placeholder)
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
