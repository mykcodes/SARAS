"""
Subjects routes — /api/subjects CRUD
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectOut
from app.services.subject_service import (
    list_subjects,
    get_subject,
    create_subject,
    update_subject,
    delete_subject,
)

router = APIRouter(prefix="/api/subjects", tags=["subjects"])


def _to_out(subject) -> SubjectOut:
    """Convert ORM Subject → SubjectOut (adds file_count and storage_used)."""
    data = SubjectOut.model_validate(subject)
    data.file_count = len(subject.documents)
    data.storage_used = sum(d.file_size for d in subject.documents) if subject.documents else 0
    return data


def _get_or_404(db: Session, subject_id: int, user_id: int):
    subject = get_subject(db, subject_id, user_id)
    if subject is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return subject


@router.get("", response_model=list[SubjectOut])
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subjects = list_subjects(db, current_user.id)
    return [_to_out(s) for s in subjects]


@router.post("", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create(
    body: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = create_subject(db, current_user.id, body)
    return _to_out(subject)


@router.get("/{subject_id}", response_model=SubjectOut)
def get_one(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _to_out(_get_or_404(db, subject_id, current_user.id))


@router.put("/{subject_id}", response_model=SubjectOut)
def update(
    subject_id: int,
    body: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = _get_or_404(db, subject_id, current_user.id)
    return _to_out(update_subject(db, subject, body))


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = _get_or_404(db, subject_id, current_user.id)
    delete_subject(db, subject)


@router.put("/{subject_id}/favorite", response_model=SubjectOut)
def toggle_favorite(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subject = _get_or_404(db, subject_id, current_user.id)
    subject.is_favorite = not subject.is_favorite
    db.commit()
    db.refresh(subject)
    return _to_out(subject)
