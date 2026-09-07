from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User

def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    Returns a default user for a single-user system (Authentication has been removed).
    If no user exists, creates one.
    """
    user = db.query(User).first()
    if not user:
        user = User(
            email="local@saraswati.app",
            full_name="Saraswati User",
            password_hash="not_used"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
