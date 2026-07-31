"""
RAG pipeline — retrieve → build prompt → call Mistral LLM → parse citations.

Entry point: `ask(question, user_id, subject_id, chat_history) -> AskResult`
"""

import re
from dataclasses import dataclass, field

from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.config import settings
from app.rag.vectorstore import search_chunks

_SYSTEM_PROMPT = """You are Saraswati AI, an expert academic tutor embedded in the Saraswati study platform.

Your task is to answer the student's question based STRICTLY on the provided document context below.

STRICT CONSTRAINTS:
1. Base your ENTIRE answer ONLY on the provided Document Context. Do NOT use outside general knowledge if it is not present or clearly implied by the context.
2. If the answer cannot be found in the provided context, reply EXACTLY with:
   "I cannot answer this question based on the provided documents."
3. Silently correct obvious OCR typos present in the extracted text.
4. At the END of your answer, add a "Sources:" section listing the document name and page/chunk numbers you drew from, in this exact format:
   Sources:
   - [DocumentName] chunk N
5. Be clear, accurate, and well-structured. Use bullet points or numbered lists where helpful."""

_HUMAN_PROMPT = """Document Context:
---
{context}
---

Conversation History:
{history}

Student Question: {question}"""


@dataclass
class Citation:
    documentName: str
    pageNumber: int
    sectionTitle: str = ""


@dataclass
class AskResult:
    answer: str
    citations: list[Citation] = field(default_factory=list)


def _build_context(chunks: list[dict]) -> str:
    lines = []
    for i, chunk in enumerate(chunks, 1):
        lines.append(
            f"[{i}] Document: {chunk['document_name']} | Chunk {chunk['chunk_index']}\n"
            f"{chunk['text']}"
        )
    return "\n\n".join(lines)


def _build_history(messages: list) -> str:
    """messages is a list of Message ORM objects with .sender and .content."""
    if not messages:
        return "(no prior conversation)"
    lines = []
    for m in messages:
        role = "Student" if m.sender == "user" else "Saraswati AI"
        lines.append(f"{role}: {m.content}")
    return "\n".join(lines)


def _parse_citations(answer: str, chunks: list[dict]) -> list[Citation]:
    """
    Extract citations from the 'Sources:' section of the answer.
    Falls back to treating every retrieved chunk as a citation if parsing fails.
    """
    citations: list[Citation] = []

    # Try to find "Sources:" block
    sources_match = re.search(r"Sources:\s*\n((?:\s*-[^\n]+\n?)+)", answer, re.IGNORECASE)
    if sources_match:
        for line in sources_match.group(1).splitlines():
            line = line.strip().lstrip("- ").strip()
            if not line:
                continue
            # Match "[DocName] chunk N" pattern
            m = re.match(r"\[?(.+?)\]?\s+chunk\s+(\d+)", line, re.IGNORECASE)
            if m:
                doc_name = m.group(1).strip()
                chunk_idx = int(m.group(2))
                citations.append(Citation(documentName=doc_name, pageNumber=chunk_idx + 1))
            else:
                citations.append(Citation(documentName=line, pageNumber=1))
    else:
        # Fallback: cite all retrieved chunks
        seen = set()
        for chunk in chunks:
            key = (chunk["document_name"], chunk["chunk_index"])
            if key not in seen:
                seen.add(key)
                citations.append(
                    Citation(
                        documentName=chunk["document_name"],
                        pageNumber=chunk["chunk_index"] + 1,
                    )
                )
    return citations


def _strip_sources_block(answer: str) -> str:
    """Remove the 'Sources:' section from the final answer text."""
    return re.sub(r"\nSources:\s*\n(?:\s*-[^\n]+\n?)+", "", answer, flags=re.IGNORECASE).strip()


async def ask(
    question: str,
    user_id: int,
    subject_id: int,
    chat_history: list,  # list of Message ORM objects
    document_id: int | None = None,
) -> AskResult:
    """
    Full RAG pipeline:
      1. Embed question → retrieve top-K chunks
      2. Build prompt with context + history
      3. Call Mistral LLM
      4. Parse citations from response
    """
    # 1. Retrieve
    chunks = search_chunks(question, user_id, subject_id, document_id=document_id)

    if not chunks:
        return AskResult(
            answer="I cannot answer this question based on the provided documents. "
                   "No relevant content was found in the uploaded documents for this subject.",
            citations=[],
        )

    # 2. Build inputs
    context = _build_context(chunks)
    history = _build_history(chat_history)

    # 3. Call LLM
    llm = ChatMistralAI(
        model=settings.LLM_MODEL,
        temperature=0.1,
        mistral_api_key=settings.MISTRAL_API_KEY,
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", _SYSTEM_PROMPT),
        ("human", _HUMAN_PROMPT),
    ])
    chain = prompt | llm | StrOutputParser()

    raw_answer: str = await chain.ainvoke({
        "context": context,
        "history": history,
        "question": question,
    })

    # 4. Parse
    citations = _parse_citations(raw_answer, chunks)
    clean_answer = _strip_sources_block(raw_answer)

    return AskResult(answer=clean_answer, citations=citations)


async def index_document(
    file_path: str,
    user_id: int,
    subject_id: int,
    document_id: int,
    document_name: str,
) -> int:
    """
    Full indexing pipeline for a newly uploaded document:
      extract → clean → chunk → embed → store in ChromaDB
    Returns the page count.
    """
    from app.ocr.extractor import extract_text
    from app.ocr.cleaner import clean
    from app.rag.chunker import chunk_text
    from app.rag.vectorstore import add_chunks

    text, page_count = extract_text(file_path)
    text = clean(text)
    chunks = chunk_text(text)
    add_chunks(chunks, user_id, subject_id, document_id, document_name)

    return page_count
