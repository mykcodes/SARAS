from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/saraswati"
    MISTRAL_API_KEY: str = ""
    ALGORITHM: str = "HS256"
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    EMBED_MODEL: str = "mistral-embed"
    LLM_MODEL: str = "mistral-large-latest"
    UPLOAD_DIR: str = "./uploads"
    MAX_CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200


settings = Settings()
