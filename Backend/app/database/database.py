"""
SQLAlchemy engine and session factory.

Uses connection pooling optimised for a long-running server process.
All async is handled at the route layer with BackgroundTasks so we keep
synchronous SQLAlchemy for simplicity and compatibility.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.database.base import Base  # noqa: F401 — imported so models register

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

engine_kwargs = {
    "pool_pre_ping": True,
    "echo": False,
}

if settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def create_tables() -> None:
    """Create all tables (used in tests / initial setup without Alembic)."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified.")
