"""
Mistral embeddings wrapper.

Uses mistralai SDK directly (not LangChain) for reliability and
compatibility with the current mistralai package version.
"""

from mistralai import Mistral
from app.config import settings

_client: Mistral | None = None


def _get_client() -> Mistral:
    global _client
    if _client is None:
        _client = Mistral(api_key=settings.MISTRAL_API_KEY)
    return _client


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts.
    Returns a list of float vectors, one per input text.
    """
    if not texts:
        return []
    client = _get_client()
    response = client.embeddings.create(
        model=settings.EMBED_MODEL,
        inputs=texts,
    )
    # response.data is a list of EmbeddingObject sorted by index
    return [item.embedding for item in response.data]


def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    return embed_texts([text])[0]
