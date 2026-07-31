"""
Chat Pydantic schemas.

Frontend expects 'citations' in MessageOut (list of dicts) and 'timestamp'.
The model no longer stores citations, so we default to empty list.
The model field is 'created_at' — we expose it as both 'created_at' and 'timestamp'.
"""

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field, computed_field


# -- Citation (matches frontend CitationCard.jsx props) -----------------------

class CitationOut(BaseModel):
    documentName: str
    pageNumber: int
    sectionTitle: str


# -- Requests -----------------------------------------------------------------

class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    chat_id: int | None = None


# -- Responses ----------------------------------------------------------------

class MessageOut(BaseModel):
    id: int
    chat_id: int
    sender: str
    content: str
    citations: list[Any] = []
    created_at: datetime

    @computed_field
    @property
    def timestamp(self) -> datetime:
        """Frontend reads 'timestamp' — alias for created_at."""
        return self.created_at

    model_config = {"from_attributes": True}


class ChatOut(BaseModel):
    id: int
    subject_id: int
    title: str | None
    created_at: datetime
    updated_at: datetime
    last_message: str | None = None

    model_config = {"from_attributes": True}


class ChatHistoryOut(BaseModel):
    chat: ChatOut
    messages: list[MessageOut]
