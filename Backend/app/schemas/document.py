"""
Document Pydantic schemas.

Field mapping (model → frontend):
  upload_status  → processing_status
  uploaded_at    → upload_date
  total_pages    → page_count
  title          → title (computed property on model)
"""

from datetime import datetime
from pydantic import BaseModel, Field


class DocumentOut(BaseModel):
    id: int
    subject_id: int
    title: str
    original_filename: str
    filename: str
    file_path: str
    file_size: int
    processing_status: str = Field(validation_alias="upload_status")
    page_count: int | None = Field(None, validation_alias="total_pages")
    upload_date: datetime = Field(validation_alias="uploaded_at")

    model_config = {"from_attributes": True, "populate_by_name": True}


class DocumentStatusOut(BaseModel):
    id: int
    processing_status: str = Field(validation_alias="upload_status")

    model_config = {"from_attributes": True, "populate_by_name": True}
