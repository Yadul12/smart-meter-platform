from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin

class MeterEvent(Base, TimestampMixin):
    __tablename__ = "meter_events"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    meter_id: Mapped[int] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    event_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    event_category: Mapped[str] = mapped_column(String(50), default="power_quality", nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="info", nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    event_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    acknowledged_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    resolved_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    additional_data: Mapped[str | None] = mapped_column(Text, nullable=True)

class Alarm(Base, TimestampMixin):
    __tablename__ = "alarms"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    alarm_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    meter_id: Mapped[int | None] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=True)
    dcu_id: Mapped[int | None] = mapped_column(ForeignKey("dcus.id", ondelete="CASCADE"), nullable=True)
    alarm_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), default="warning", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active", nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    raised_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    acknowledged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    acknowledged_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cleared_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cleared_by: Mapped[int | None] = mapped_column(Integer, nullable=True)

class Outage(Base, TimestampMixin):
    __tablename__ = "outages"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    outage_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    meter_id: Mapped[int | None] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_minutes: Mapped[float | None] = mapped_column(Float, nullable=True)
    cause: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="ongoing", nullable=False)
    affected_customers: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    area: Mapped[str | None] = mapped_column(String(100), nullable=True)
