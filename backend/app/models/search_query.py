from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SearchQuery(Base):
    __tablename__ = "search_queries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )


class SearchQueryResult(Base):
    __tablename__ = "search_query_results"
    __table_args__ = (
        UniqueConstraint("search_query_id", "resource_id", name="uq_search_query_results_query_resource"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    search_query_id: Mapped[int] = mapped_column(ForeignKey("search_queries.id"), nullable=False, index=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("resources.id"), nullable=False, index=True)
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    snippet: Mapped[str | None] = mapped_column(Text, nullable=True)
