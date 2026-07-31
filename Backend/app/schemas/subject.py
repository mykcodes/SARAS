"""
Subject Pydantic schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field


# -- Requests -----------------------------------------------------------------

class SubjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, examples=["DBMS"])
    description: str | None = Field(None, max_length=1000)
    color: str = Field("#D9A441", pattern=r"^#[0-9A-Fa-f]{6}$")


class SubjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    color: str | None = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


# -- Responses ----------------------------------------------------------------

class SubjectOut(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None
    color: str = "#D9A441"
    is_favorite: bool = False
    file_count: int = 0
    storage_used: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
