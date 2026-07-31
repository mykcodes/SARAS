"""
Document service — file storage and DB record management.

Handles:
  - Saving uploaded file to disk
  - Creating the Document DB record
  - Updating upload/processing status
  - Deleting document + file
"""

import os
import uuid
import aiofiles

from sqlalchemy.orm import Session

from app.models.document import Document
from app.config import settings


def _ensure_upload_dir(subject_id: int) -> str:
    """Return (and create if needed) the upload dir for a subject."""
    path = os.path.join(settings.UPLOAD_DIR, str(subject_id))
    os.makedirs(path, exist_ok=True)
    return path


async def save_upload(subject_id: int, original_filename: str, content: bytes) -> tuple[str, str]:
    """
    Write bytes to disk.
    Returns (stored_filename, absolute_file_path).
    """
    ext = os.path.splitext(original_filename)[1].lower() or ".pdf"
    stored_filename = f"{uuid.uuid4().hex}{ext}"
    upload_dir = _ensure_upload_dir(subject_id)
    file_path = os.path.join(upload_dir, stored_filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    return stored_filename, file_path


def create_document_record(
    db: Session,
    subject_id: int,
    original_filename: str,
    stored_filename: str,
    file_path: str,
    file_size: int = 0,
) -> Document:
    doc = Document(
        subject_id=subject_id,
        filename=stored_filename,
        original_filename=original_filename,
        file_path=file_path,
        file_size=file_size,
        upload_status="pending",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_document(db: Session, doc_id: int, subject_id: int) -> Document | None:
    return (
        db.query(Document)
        .filter(Document.id == doc_id, Document.subject_id == subject_id)
        .first()
    )


def list_documents(db: Session, subject_id: int) -> list[Document]:
    return db.query(Document).filter(Document.subject_id == subject_id).all()


def set_processing_status(
    db: Session,
    doc: Document,
    status: str,
    error: str | None = None,
    page_count: int | None = None,
) -> None:
    doc.upload_status = status
    if page_count is not None:
        doc.total_pages = page_count
    db.commit()


def delete_document(db: Session, doc: Document) -> None:
    """Remove file from disk and delete DB record."""
    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except OSError:
        pass
    db.delete(doc)
    db.commit()
