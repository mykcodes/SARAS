"""
Document model.

Tracks uploaded PDF files. Only metadata is stored in PostgreSQL;
the actual binary file lives on disk at file_path.

upload_status values:
  pending     -- file received, not yet processed
  processing  -- OCR / chunking / embedding in progress
  complete    -- ready for RAG queries
  error       -- processing failed
"""

from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("subjects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # -- File metadata ---------------------------------------------------------
    filename: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    original_filename: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    file_path: Mapped[str] = mapped_column(
        Text, nullable=False
    )
    file_size: Mapped[int] = mapped_column(
        BigInteger, nullable=False, default=0
    )
    total_pages: Mapped[int | None] = mapped_column(
        Integer, nullable=True
    )
    upload_status: Mapped[str] = mapped_column(
        String(50), default="pending", nullable=False, index=True
    )
    is_favorite: Mapped[bool] = mapped_column(
        default=False, nullable=False
    )

    # -- Timestamps ------------------------------------------------------------
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # -- Relationships ---------------------------------------------------------
    subject: Mapped["Subject"] = relationship("Subject", back_populates="documents")

    @property
    def title(self) -> str:
        """Friendly title derived from the original filename (no extension)."""
        return self.original_filename.rsplit(".", 1)[0]

    def __repr__(self) -> str:
        return (
            f"<Document id={self.id} file={self.original_filename!r} "
            f"status={self.upload_status!r}>"
        )
