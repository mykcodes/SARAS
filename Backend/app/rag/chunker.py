"""
Text chunker — split cleaned document text into overlapping chunks.

Uses LangChain's RecursiveCharacterTextSplitter with character-based
chunk sizes (roughly 2000 chars ≈ 400-500 words at avg 4-5 chars/word).
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings


def _make_splitter() -> RecursiveCharacterTextSplitter:
    # Convert word counts to approximate char counts
    chunk_size = settings.MAX_CHUNK_SIZE * 5        # e.g. 500 words → 2500 chars
    chunk_overlap = settings.CHUNK_OVERLAP * 5       # e.g. 100 words → 500 chars
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len,
    )


_splitter = _make_splitter()


def chunk_text(text: str) -> list[str]:
    """
    Split `text` into overlapping chunks.
    Returns a list of non-empty string chunks.
    """
    chunks = _splitter.split_text(text)
    return [c.strip() for c in chunks if c.strip()]
