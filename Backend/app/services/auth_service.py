"""
Auth service — password hashing and user creation.
"""

from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.schemas.auth import RegisterRequest

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return _pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_ctx.verify(plain, hashed)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def create_user(db: Session, req: RegisterRequest) -> User:
    """
    Create and persist a new user.
    Raises ValueError if the email is already taken.
    """
    if get_user_by_email(db, req.email):
        raise ValueError(f"Email already registered: {req.email}")

    user = User(
        full_name=req.full_name,
        email=req.email.lower(),
        password_hash=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Return the User if credentials are valid, else None."""
    user = get_user_by_email(db, email)
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
