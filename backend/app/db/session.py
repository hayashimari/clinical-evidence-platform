from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _safe_db_url() -> URL:
    return make_url(settings.database_url)


def check_db_connection() -> dict[str, str | None]:
    url = _safe_db_url()

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected",
            "engine": url.drivername,
            "host": url.host or "unknown",
            "port": str(url.port) if url.port else None,
            "name": url.database,
            "error": None,
        }
    except SQLAlchemyError as exc:
        return {
            "status": "error",
            "database": "disconnected",
            "engine": url.drivername,
            "host": url.host or "unknown",
            "port": str(url.port) if url.port else None,
            "name": url.database,
            "error": str(exc),
        }
