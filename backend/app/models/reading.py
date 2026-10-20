from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin

class MeterReading(Base, TimestampMixin):
    __tablename__ = "meter_readings"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    meter_id: Mapped[int] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=False, index=True)
    reading_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    reading_type: Mapped[str] = mapped_column(String(30), default="periodic", nullable=False)
    voltage: Mapped[float | None] = mapped_column(Float, nullable=True)
    current: Mapped[float | None] = mapped_column(Float, nullable=True)
    frequency: Mapped[float | None] = mapped_column(Float, default=50.0, nullable=True)
    active_power: Mapped[float | None] = mapped_column(Float, nullable=True)
    reactive_power: Mapped[float | None] = mapped_column(Float, nullable=True)
    apparent_power: Mapped[float | None] = mapped_column(Float, nullable=True)
    power_factor: Mapped[float | None] = mapped_column(Float, nullable=True)
    import_active_energy: Mapped[float | None] = mapped_column(Float, nullable=True)
    export_active_energy: Mapped[float | None] = mapped_column(Float, default=0.0, nullable=True)
    max_demand: Mapped[float | None] = mapped_column(Float, nullable=True)
    vee_status: Mapped[str] = mapped_column(String(20), default="raw", nullable=False)
    source: Mapped[str] = mapped_column(String(30), default="hes", nullable=False)

class LoadProfile(Base):
    __tablename__ = "load_profiles"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    meter_id: Mapped[int] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=False, index=True)
    interval_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    interval_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    active_energy: Mapped[float] = mapped_column(Float, nullable=False)
    avg_demand: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_demand: Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_voltage: Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_power_factor: Mapped[float | None] = mapped_column(Float, nullable=True)
