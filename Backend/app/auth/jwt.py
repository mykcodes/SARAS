"""
JWT utility — create and verify access tokens.
"""

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

from app.config import settings


def create_access_token(subject: int) -> str:
    """Create a signed JWT for the given user id."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> int | None:
    """
    Verify and decode a JWT.
    Returns the user_id (int) on success, None if the token is invalid/expired.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id_str: str | None = payload.get("sub")
        if user_id_str is None:
            return None
        return int(user_id_str)
    except (JWTError, ValueError):
        return None
