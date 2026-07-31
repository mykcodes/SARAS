"""
Subject service — CRUD operations for subjects.
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate


def list_subjects(db: Session, user_id: int) -> list[Subject]:
    return db.query(Subject).filter(Subject.user_id == user_id).all()


def get_subject(db: Session, subject_id: int, user_id: int) -> Subject | None:
    return (
        db.query(Subject)
        .filter(Subject.id == subject_id, Subject.user_id == user_id)
        .first()
    )


def create_subject(db: Session, user_id: int, data: SubjectCreate) -> Subject:
    subject = Subject(
        user_id=user_id,
        name=data.name,
        description=data.description,
        color=data.color,
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def update_subject(db: Session, subject: Subject, data: SubjectUpdate) -> Subject:
    if data.name is not None:
        subject.name = data.name
    if data.description is not None:
        subject.description = data.description
    if data.color is not None:
        subject.color = data.color
    subject.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(subject)
    return subject


def delete_subject(db: Session, subject: Subject) -> None:
    db.delete(subject)
    db.commit()
