"""
SQLAlchemy declarative base — shared by all ORM models.
Import Base from here to avoid circular imports.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """All ORM models inherit from this base class."""
    pass
