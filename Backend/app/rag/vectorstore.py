"""
ChromaDB vector store interface.

Chunks are stored with metadata:
  user_id, subject_id, document_id, document_name, chunk_index

This ensures RAG queries are always scoped to the correct user + subject.
"""

from typing import Optional

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config import settings
from app.rag.embeddings import embed_texts, embed_query

_chroma_client: Optional[chromadb.ClientAPI] = None
_collection: Optional[chromadb.Collection] = None


def _get_collection() -> chromadb.Collection:
    global _chroma_client, _collection
    if _collection is None:
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        _collection = _chroma_client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def add_chunks(
    chunks: list[str],
    user_id: int,
    subject_id: int,
    document_id: int,
    document_name: str,
) -> None:
    """Embed chunks and upsert them into ChromaDB."""
    if not chunks:
        return

    collection = _get_collection()
    embeddings = embed_texts(chunks)

    ids = [f"u{user_id}_s{subject_id}_d{document_id}_c{i}" for i in range(len(chunks))]
    metadatas = [
        {
            "user_id": user_id,
            "subject_id": subject_id,
            "document_id": document_id,
            "document_name": document_name,
            "chunk_index": i,
        }
        for i in range(len(chunks))
    ]

    collection.upsert(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadatas)


def search_chunks(
    query: str,
    user_id: int,
    subject_id: int,
    top_k: int | None = None,
    document_id: int | None = None,
) -> list[dict]:
    """
    Semantic search filtered to user_id + subject_id (and optionally document_id).
    Returns list of dicts with keys: text, document_id, document_name, chunk_index, distance.
    """
    collection = _get_collection()
    k = top_k or settings.TOP_K_CHUNKS
    query_embedding = embed_query(query)

    filter_conditions = [{"user_id": user_id}, {"subject_id": subject_id}]
    if document_id is not None:
        filter_conditions.append({"document_id": document_id})

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k,
        where={"$and": filter_conditions},
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    if results["documents"] and results["documents"][0]:
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            chunks.append(
                {
                    "text": doc,
                    "document_id": meta.get("document_id"),
                    "document_name": meta.get("document_name", ""),
                    "chunk_index": meta.get("chunk_index", 0),
                    "distance": dist,
                }
            )
    return chunks


def delete_document_chunks(user_id: int, subject_id: int, document_id: int) -> None:
    """Remove all chunks for a specific document from ChromaDB."""
    collection = _get_collection()
    collection.delete(
        where={
            "$and": [
                {"user_id": user_id},
                {"subject_id": subject_id},
                {"document_id": document_id},
            ]
        }
    )
