from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserSpecialty(Base):
    __tablename__ = "user_specialties"
    __table_args__ = (
        UniqueConstraint("user_id", "specialty_id", name="uq_user_specialties_user_specialty"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    specialty_id: Mapped[int] = mapped_column(ForeignKey("specialties.id"), nullable=False, index=True)
    proficiency_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
