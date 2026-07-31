"""
Mistral embeddings wrapper.
"""

from __future__ import annotations

from mistralai import Mistral
from app.config import settings

_client = None


def get_client():
    global _client

    if _client is None:
        _client = Mistral(api_key=settings.MISTRAL_API_KEY)

    return _client


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    client = get_client()

    response = client.embeddings.create(
        model=settings.EMBED_MODEL,
        inputs=texts,
    )

    return [item.embedding for item in response.data]


def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]