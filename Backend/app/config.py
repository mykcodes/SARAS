"""
Application configuration -- reads from .env via pydantic-settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # -- Database --------------------------------------------------------------
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5432/saraswati_db"

    # -- JWT -------------------------------------------------------------------
    JWT_SECRET: str = "change-me-in-production-32-chars-min"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # -- Mistral ---------------------------------------------------------------
    MISTRAL_API_KEY: str = ""
    EMBED_MODEL: str = "mistral-embed"
    LLM_MODEL: str = "mistral-large-latest"

    # -- ChromaDB --------------------------------------------------------------
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "saraswati_docs"

    # -- File storage ----------------------------------------------------------
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 50

    # -- RAG -------------------------------------------------------------------
    MAX_CHUNK_SIZE: int = 500    # words
    CHUNK_OVERLAP: int = 100     # words
    TOP_K_CHUNKS: int = 5

    # -- CORS ------------------------------------------------------------------
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:4173",   # Vite preview
        "http://127.0.0.1:5173",
    ]


settings = Settings()
