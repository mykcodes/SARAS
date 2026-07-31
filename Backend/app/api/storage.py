from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.models.document import Document
from pydantic import BaseModel

router = APIRouter(prefix="/api/storage", tags=["storage"])

class StorageMetrics(BaseModel):
    used_bytes: int
    total_bytes: int
    subjects_count: int
    documents_count: int
    notes_count: int
    bookmarks_count: int

@router.get("/metrics", response_model=StorageMetrics)
def get_storage_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Calculate sum of all document sizes for this user
    total_used = db.query(func.sum(Document.file_size)).join(Subject).filter(
        Subject.user_id == current_user.id
    ).scalar() or 0
    
    subjects_count = db.query(Subject).filter(Subject.user_id == current_user.id).count()
    documents_count = db.query(Document).join(Subject).filter(Subject.user_id == current_user.id).count()
    
    # Let's say user has a 5GB limit (5 * 1024 * 1024 * 1024)
    total_limit = 5 * 1024 * 1024 * 1024
    
    return {
        "used_bytes": int(total_used),
        "total_bytes": total_limit,
        "subjects_count": subjects_count,
        "documents_count": documents_count,
        "notes_count": 0, # Notes not currently distinct in backend
        "bookmarks_count": db.query(Document).join(Subject).filter(Subject.user_id == current_user.id, Document.is_favorite == True).count()
    }
