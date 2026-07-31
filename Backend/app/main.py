"""
FastAPI application — CORS, routers, DB init.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.database import engine, Base

# Import all models so SQLAlchemy registers them before create_all
import app.models.user      # noqa: F401
import app.models.subject   # noqa: F401
import app.models.document  # noqa: F401
import app.models.chat      # noqa: F401
import app.models.message   # noqa: F401

from app.api.auth import router as auth_router
from app.api.subjects import router as subjects_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create all DB tables on startup (safe with Alembic — no-op if tables exist)."""
    logger.info("Starting Saraswati backend…")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready.")
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="Saraswati API",
    description="AI-powered study assistant backend",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(subjects_router)
app.include_router(documents_router)
app.include_router(chat_router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}
