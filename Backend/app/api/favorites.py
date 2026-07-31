from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.subject import Subject
from app.models.document import Document
from app.schemas.subject import SubjectOut
from app.schemas.document import DocumentOut
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

class FavoritesOut(BaseModel):
    subjects: List[SubjectOut]
    documents: List[DocumentOut]

@router.get("", response_model=FavoritesOut)
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subjects = db.query(Subject).filter(
        Subject.user_id == current_user.id,
        Subject.is_favorite == True
    ).all()
    
    # We join with Subject to ensure the document belongs to the user
    documents = db.query(Document).join(Subject).filter(
        Subject.user_id == current_user.id,
        Document.is_favorite == True
    ).all()
    
    return {
        "subjects": subjects,
        "documents": documents
    }
