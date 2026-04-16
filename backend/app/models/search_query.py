from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SearchQuery(Base):
    __tablename__ = "search_queries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    raw_query: Mapped[str] = mapped_column(Text, nullable=False)
    normalized_query: Mapped[str | None] = mapped_column(Text, nullable=True)
    interpreted_intent: Mapped[str | None] = mapped_column(String(100), nullable=True)
    specialty_id: Mapped[int | None] = mapped_column(ForeignKey("specialties.id", ondelete="SET NULL"), nullable=True)
    filters_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class SearchQueryResult(Base):
    __tablename__ = "search_query_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    search_query_id: Mapped[int] = mapped_column(ForeignKey("search_queries.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[int] = mapped_column(ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    matched_segment_id: Mapped[int | None] = mapped_column(ForeignKey("resource_segments.id", ondelete="SET NULL"), nullable=True)
    result_rank: Mapped[int] = mapped_column(Integer, nullable=False)
    relevance_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    source_channel: Mapped[str | None] = mapped_column(String(50), nullable=True)  # lexical / vector / hybrid
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)