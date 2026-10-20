from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin, SoftDeleteMixin

class Tariff(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "tariffs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tariff_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(30), default="residential", nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fixed_charge: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    tax_rate_percent: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    is_tou_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

class TariffSlab(Base):
    __tablename__ = "tariff_slabs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tariff_id: Mapped[int] = mapped_column(ForeignKey("tariffs.id", ondelete="CASCADE"), nullable=False)
    slab_order: Mapped[int] = mapped_column(Integer, nullable=False)
    slab_type: Mapped[str] = mapped_column(String(20), default="normal", nullable=False)
    start_time: Mapped[str | None] = mapped_column(String(10), nullable=True)
    end_time: Mapped[str | None] = mapped_column(String(10), nullable=True)
    min_units: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    max_units: Mapped[float | None] = mapped_column(Float, nullable=True)
    rate_per_unit: Mapped[float] = mapped_column(Float, nullable=False)

class Bill(Base, TimestampMixin):
    __tablename__ = "bills"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    bill_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    consumer_id: Mapped[int] = mapped_column(ForeignKey("consumers.id", ondelete="CASCADE"), nullable=False)
    meter_id: Mapped[int | None] = mapped_column(ForeignKey("meters.id", ondelete="SET NULL"), nullable=True)
    tariff_id: Mapped[int | None] = mapped_column(ForeignKey("tariffs.id", ondelete="SET NULL"), nullable=True)
    billing_period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    billing_period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    bill_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    start_reading: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    end_reading: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_active_energy: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    peak_energy: Mapped[float | None] = mapped_column(Float, default=0.0, nullable=True)
    normal_energy: Mapped[float | None] = mapped_column(Float, default=0.0, nullable=True)
    off_peak_energy: Mapped[float | None] = mapped_column(Float, default=0.0, nullable=True)
    energy_charge: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    fixed_charge: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="generated", nullable=False)

class Payment(Base, TimestampMixin):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    bill_id: Mapped[int] = mapped_column(ForeignKey("bills.id", ondelete="CASCADE"), nullable=False)
    payment_reference: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(30), default="online", nullable=False)
    payment_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="completed", nullable=False)
