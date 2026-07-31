"""
Auth Pydantic schemas.

Shapes:
  RegisterRequest  -- POST /api/auth/register body
  LoginRequest     -- POST /api/auth/login body
  TokenResponse    -- response with access token
  UserOut          -- safe user representation (no password hash)
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, computed_field


# -- Requests -----------------------------------------------------------------

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255, validation_alias="name", examples=["Mayank Kumar"])
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

    model_config = {"populate_by_name": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -- Responses ----------------------------------------------------------------

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def name(self) -> str:
        """Frontend reads 'name' — alias for full_name."""
        return self.full_name

    model_config = {"from_attributes": True}


# Forward reference resolution
TokenResponse.model_rebuild()
