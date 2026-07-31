"""
Chat routes — ask (RAG), history, messages, delete.

POST /api/subjects/{subject_id}/chat/ask
GET  /api/subjects/{subject_id}/chat/history
GET  /api/chat/{chat_id}/messages
DELETE /api/chat/{chat_id}
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.chat import AskRequest, MessageOut, ChatOut, ChatHistoryOut
from app.services.chat_service import (
    get_or_create_chat,
    list_chats,
    get_chat,
    delete_chat,
    save_message,
    get_recent_messages,
    list_messages,
    set_chat_title,
)
from app.services.subject_service import get_subject
from app.rag.pipeline import ask, AskResult

router = APIRouter(tags=["chat"])


def _subject_or_404(db, subject_id, user_id):
    s = get_subject(db, subject_id, user_id)
    if s is None:
        raise HTTPException(status_code=404, detail="Subject not found")
    return s


def _chat_or_404(db, chat_id, user_id):
    c = get_chat(db, chat_id, user_id)
    if c is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return c


# -- Per-subject chat endpoints ------------------------------------------------

@router.post("/api/subjects/{subject_id}/chat/ask")
async def ask_question(
    subject_id: int,
    body: AskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """RAG ask — retrieve relevant chunks -> call Mistral -> return answer + citations."""
    _subject_or_404(db, subject_id, current_user.id)

    chat = get_or_create_chat(db, current_user.id, subject_id, body.chat_id)
    history = get_recent_messages(db, chat.id, limit=6)

    # Call RAG pipeline
    result: AskResult = await ask(body.question, current_user.id, subject_id, history, body.document_id)

    # Persist messages
    user_msg = save_message(db, chat.id, "user", body.question)
    ai_msg = save_message(db, chat.id, "assistant", result.answer)

    # Build citations for the response
    citations_dicts = [
        {"documentName": c.documentName, "pageNumber": c.pageNumber, "sectionTitle": c.sectionTitle}
        for c in result.citations
    ]

    # Auto-title new chats using the first question (truncated)
    if chat.title is None:
        set_chat_title(db, chat, body.question[:100])

    # Build response — attach citations to the AI message response
    ai_msg_out = MessageOut.model_validate(ai_msg)
    ai_msg_out.citations = citations_dicts

    return {
        "chat_id": chat.id,
        "user_message": MessageOut.model_validate(user_msg),
        "ai_message": ai_msg_out,
    }


@router.get("/api/subjects/{subject_id}/chat/history", response_model=list[ChatOut])
def get_history(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all chat sessions for a subject."""
    _subject_or_404(db, subject_id, current_user.id)
    chats = list_chats(db, current_user.id, subject_id)
    result = []
    for c in chats:
        out = ChatOut.model_validate(c)
        # Attach last message preview
        msgs = c.messages
        if msgs:
            out.last_message = msgs[-1].content[:120]
        result.append(out)
    return result


# -- Per-chat endpoints --------------------------------------------------------

@router.get("/api/chat/{chat_id}/messages", response_model=list[MessageOut])
def get_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = _chat_or_404(db, chat_id, current_user.id)
    return [MessageOut.model_validate(m) for m in list_messages(db, chat.id)]


@router.delete("/api/chat/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = _chat_or_404(db, chat_id, current_user.id)
    delete_chat(db, chat)
