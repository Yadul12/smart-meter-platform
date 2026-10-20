from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base, TimestampMixin, SoftDeleteMixin

class Consumer(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "consumers"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    consumer_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    consumer_type: Mapped[str] = mapped_column(String(30), default="residential", nullable=False)
    sanctioned_load: Mapped[float | None] = mapped_column(Float, nullable=True)
    tariff_id: Mapped[int | None] = mapped_column(Integer, nullable=True)

class Meter(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "meters"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    meter_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    serial_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    meter_type: Mapped[str] = mapped_column(String(50), default="whole_current_static", nullable=False)
    accuracy_class: Mapped[str] = mapped_column(String(10), default="1.0S", nullable=False)
    phase: Mapped[str] = mapped_column(String(20), default="single_phase", nullable=False)
    rated_voltage: Mapped[float] = mapped_column(Float, default=230.0, nullable=False)
    rated_current: Mapped[float] = mapped_column(Float, default=10.0, nullable=False)
    max_current: Mapped[float] = mapped_column(Float, default=60.0, nullable=False)
    frequency: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    firmware_version: Mapped[str] = mapped_column(String(20), default="v1.2.4", nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(100), default="Vardhman Airport Solutions Ltd.", nullable=False)
    connectivity_type: Mapped[str] = mapped_column(String(30), default="rf_mesh", nullable=False)
    topology: Mapped[str] = mapped_column(String(30), default="nan_dcu", nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    sim_iccid: Mapped[str | None] = mapped_column(String(30), nullable=True)
    signal_strength: Mapped[int | None] = mapped_column(Integer, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="online", nullable=False)
    voltage: Mapped[float | None] = mapped_column(Float, default=230.0, nullable=True)
    current: Mapped[float | None] = mapped_column(Float, default=5.0, nullable=True)
    active_power: Mapped[float | None] = mapped_column(Float, default=1.1, nullable=True)
    reactive_power: Mapped[float | None] = mapped_column(Float, default=0.2, nullable=True)
    apparent_power: Mapped[float | None] = mapped_column(Float, default=1.15, nullable=True)
    power_factor: Mapped[float | None] = mapped_column(Float, default=0.95, nullable=True)
    frequency_measured: Mapped[float | None] = mapped_column(Float, default=50.0, nullable=True)
    import_energy: Mapped[float | None] = mapped_column(Float, default=150.0, nullable=True)
    export_energy: Mapped[float | None] = mapped_column(Float, default=0.0, nullable=True)
    last_communication: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_reading_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    installation_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    consumer_id: Mapped[int | None] = mapped_column(ForeignKey("consumers.id", ondelete="SET NULL"), nullable=True)
