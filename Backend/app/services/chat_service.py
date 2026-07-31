"""
Chat service — manage Chat and Message DB records.
"""

from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.models.message import Message
from app.models.subject import Subject


# ---------------------------------------------------------------------------
# Chat helpers
# ---------------------------------------------------------------------------

def get_or_create_chat(db: Session, user_id: int, subject_id: int, chat_id: int | None) -> Chat:
    """
    If chat_id is given and belongs to user's subject, return it.
    Otherwise create a new Chat.
    """
    if chat_id is not None:
        chat = (
            db.query(Chat)
            .join(Subject, Chat.subject_id == Subject.id)
            .filter(
                Chat.id == chat_id,
                Chat.subject_id == subject_id,
                Subject.user_id == user_id,
            )
            .first()
        )
        if chat:
            return chat

    chat = Chat(subject_id=subject_id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def list_chats(db: Session, user_id: int, subject_id: int) -> list[Chat]:
    return (
        db.query(Chat)
        .join(Subject, Chat.subject_id == Subject.id)
        .filter(Chat.subject_id == subject_id, Subject.user_id == user_id)
        .order_by(Chat.created_at.desc())
        .all()
    )


def get_chat(db: Session, chat_id: int, user_id: int) -> Chat | None:
    return (
        db.query(Chat)
        .join(Subject, Chat.subject_id == Subject.id)
        .filter(Chat.id == chat_id, Subject.user_id == user_id)
        .first()
    )


def delete_chat(db: Session, chat: Chat) -> None:
    db.delete(chat)
    db.commit()


def set_chat_title(db: Session, chat: Chat, title: str) -> None:
    chat.title = title[:500]
    db.commit()


# ---------------------------------------------------------------------------
# Message helpers
# ---------------------------------------------------------------------------

def save_message(
    db: Session,
    chat_id: int,
    sender: str,
    content: str,
) -> Message:
    msg = Message(
        chat_id=chat_id,
        sender=sender,
        content=content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_recent_messages(db: Session, chat_id: int, limit: int = 6) -> list[Message]:
    """Return the most recent `limit` messages for building LLM context."""
    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(messages))


def list_messages(db: Session, chat_id: int) -> list[Message]:
    return (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at)
        .all()
    )
