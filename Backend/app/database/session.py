"""
FastAPI dependency that yields a database session.

Usage:
    @router.get("/example")
    def example(db: Session = Depends(get_db)):
        ...
"""

from typing import Generator
from sqlalchemy.orm import Session

from app.database.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session and ensure it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
