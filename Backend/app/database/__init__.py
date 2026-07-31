"""
Database package — exposes the engine, Base, and get_db.

Import Base from here for Alembic's env.py.
"""
from .base import Base
from .database import engine, SessionLocal
from .session import get_db

__all__ = ["Base", "engine", "SessionLocal", "get_db"]
