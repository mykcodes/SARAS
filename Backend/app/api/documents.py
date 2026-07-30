import asyncio
import os
import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.auth.jwt import decode_access_token
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentOut, DocumentStatusOut
from app.services.document_service import (
    save_upload,
    create_document_record,
    get_document,
    list_documents,
    delete_document,
    set_processing_status,
)
from app.services.subject_service import get_subject
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/subjects/{subject_id}/documents", tags=["documents"])


def _get_subject_or_404(db: Session, subject_id: int, user_id: int):
    subject = get_subject(db, subject_id, user_id)
    if subject is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return subject


def _get_doc_or_404(db: Session, doc_id: int, subject_id: int):
    doc = get_document(db, doc_id, subject_id)
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc


async def _index_document_bg(
    file_path: str,
    user_id: int,
    subject_id: int,
    document_id: int,
    document_name: str,
    db_url: str,
) -> None:
    """Background task: extract, chunk, embed, store in ChromaDB, update status."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.rag.pipeline import index_document
    from app.models.document import Document

    engine = create_engine(db_url)
    Session_ = sessionmaker(bind=engine)
    with Session_() as session:
        doc = session.get(Document, document_id)
        if doc is None:
            return
        set_processing_status(session, doc, "processing")

    try:
        page_count = await asyncio.to_thread(
            _sync_index, file_path, user_id, subject_id, document_id, document_name
        )
        with Session_() as session:
            doc = session.get(Document, document_id)
            if doc:
                set_processing_status(session, doc, "complete", page_count=page_count)
    except Exception as exc:
        logger.exception("Document indexing failed for doc_id=%d", document_id)
        with Session_() as session:
            doc = session.get(Document, document_id)
            if doc:
                set_processing_status(session, doc, "error")


def _sync_index(file_path, user_id, subject_id, document_id, document_name) -> int:
    """Synchronous wrapper for the async index_document (called via asyncio.to_thread)."""
    import asyncio as _asyncio
    from app.rag.pipeline import index_document

    loop = _asyncio.new_event_loop()
    try:
        return loop.run_until_complete(
            index_document(file_path, user_id, subject_id, document_id, document_name)
        )
    finally:
        loop.close()


@router.get("", response_model=list[DocumentOut])
def list_docs(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_subject_or_404(db, subject_id, current_user.id)
    docs = list_documents(db, subject_id)
    return [DocumentOut.model_validate(d) for d in docs]


@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload(
    subject_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a PDF, save to disk, create DB record, kick off background indexing."""
    subject = _get_subject_or_404(db, subject_id, current_user.id)

    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    content = await file.read()

    # Validate size
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum size of {settings.MAX_FILE_SIZE_MB} MB",
        )

    stored_filename, file_path = await save_upload(subject_id, file.filename, content)
    doc = create_document_record(
        db, subject_id, file.filename, stored_filename, file_path,
        file_size=len(content),
    )

    # Kick off background indexing
    asyncio.create_task(
        _index_document_bg(
            file_path=file_path,
            user_id=current_user.id,
            subject_id=subject_id,
            document_id=doc.id,
            document_name=doc.title,
            db_url=settings.DATABASE_URL,
        )
    )

    return DocumentOut.model_validate(doc)


@router.get("/{doc_id}", response_model=DocumentOut)
def get_doc(
    subject_id: int,
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_subject_or_404(db, subject_id, current_user.id)
    return DocumentOut.model_validate(_get_doc_or_404(db, doc_id, subject_id))


@router.get("/{doc_id}/status", response_model=DocumentStatusOut)
def get_status(
    subject_id: int,
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_subject_or_404(db, subject_id, current_user.id)
    return DocumentStatusOut.model_validate(_get_doc_or_404(db, doc_id, subject_id))


@router.get("/{doc_id}/file", response_model=None)
def serve_pdf(
    subject_id: int,
    doc_id: int,
    db: Session = Depends(get_db),
    token: Optional[str] = Query(None),
):
    """Serve the raw PDF file for inline viewing.

    Accepts authentication via ?token= query param.
    This is required because browsers loading PDFs via URL cannot set custom headers.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token query parameter is required to view this PDF",
        )

    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    _get_subject_or_404(db, subject_id, user.id)
    doc = _get_doc_or_404(db, doc_id, subject_id)

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        doc.file_path,
        media_type="application/pdf",
        filename=doc.original_filename,
        headers={"Content-Disposition": "inline"},
    )


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doc(
    subject_id: int,
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _get_subject_or_404(db, subject_id, current_user.id)
    doc = _get_doc_or_404(db, doc_id, subject_id)

    # Also remove ChromaDB chunks
    try:
        from app.rag.vectorstore import delete_document_chunks
        delete_document_chunks(current_user.id, subject_id, doc.id)
    except Exception:
        pass  # Don't block deletion if ChromaDB fails

    delete_document(db, doc)
