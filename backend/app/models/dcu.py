from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin, SoftDeleteMixin

class DCU(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "dcus"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    dcu_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    firmware_version: Mapped[str] = mapped_column(String(20), default="v2.4.1", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="online", nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    wan_protocol: Mapped[str] = mapped_column(String(30), default="cellular_4g", nullable=False)
    nan_protocol: Mapped[str] = mapped_column(String(30), default="rf_mesh", nullable=False)
    wan_status: Mapped[str] = mapped_column(String(20), default="online", nullable=False)
    nan_status: Mapped[str] = mapped_column(String(20), default="online", nullable=False)
    signal_quality: Mapped[int | None] = mapped_column(Integer, default=-65, nullable=True)
    last_heartbeat: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    total_connected_meters: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    online_meters: Mapped[int] = mapped_column(Integer, default=9, nullable=False)
    offline_meters: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    stored_messages: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    buffer_size: Mapped[int] = mapped_column(Integer, default=1000, nullable=False)

class DCUMeterAssignment(Base):
    __tablename__ = "dcu_meter_assignments"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    dcu_id: Mapped[int] = mapped_column(ForeignKey("dcus.id", ondelete="CASCADE"), nullable=False)
    meter_id: Mapped[int] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    assigned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
