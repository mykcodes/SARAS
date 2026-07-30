"""
Text extraction — try pypdf first, fall back to Mistral OCR.

pypdf is fast and free; Mistral OCR handles scanned/image-heavy PDFs.
"""

import os
from pypdf import PdfReader
from mistralai import Mistral

from app.config import settings

_client: Mistral | None = None


def _get_client() -> Mistral:
    global _client
    if _client is None:
        _client = Mistral(api_key=settings.MISTRAL_API_KEY)
    return _client


def extract_with_pypdf(file_path: str) -> tuple[str, int]:
    """
    Extract text using pypdf.
    Returns (text, page_count).
    Raises if the file cannot be read.
    """
    reader = PdfReader(file_path)
    pages_text = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            pages_text.append(t.strip())
    return "\n\n".join(pages_text), len(reader.pages)


def extract_with_ocr(file_path: str) -> tuple[str, int]:
    """
    Use Mistral OCR for scanned / image PDFs.
    Returns (markdown_text, page_count).
    """
    client = _get_client()

    with open(file_path, "rb") as f:
        uploaded = client.files.upload(
            file={"file_name": os.path.basename(file_path), "content": f},
            purpose="ocr",
        )

    signed_url = client.files.get_signed_url(file_id=uploaded.id)
    response = client.ocr.process(
        model="mistral-ocr-latest",
        document={"type": "document_url", "document_url": signed_url.url},
    )

    pages_text = [page.markdown for page in response.pages if page.markdown]
    return "\n\n".join(pages_text), len(response.pages)


# Threshold: if pypdf extracts fewer than this many characters, fall back to OCR
_MIN_CHARS = 200


def extract_text(file_path: str) -> tuple[str, int]:
    """
    Smart extraction:
      1. Try pypdf
      2. If result is too short (likely scanned), use Mistral OCR
    Returns (text, page_count).
    """
    try:
        text, pages = extract_with_pypdf(file_path)
        if len(text.strip()) >= _MIN_CHARS:
            return text, pages
    except Exception:
        pass

    # Fall back to Mistral OCR
    return extract_with_ocr(file_path)
