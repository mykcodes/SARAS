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

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,       # test connections before using them
    pool_size=10,
    max_overflow=20,
    echo=False,               # set True for SQL debug logging
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
