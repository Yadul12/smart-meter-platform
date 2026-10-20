from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin

class ComplianceTest(Base, TimestampMixin):
    __tablename__ = "compliance_tests"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    test_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    test_name: Mapped[str] = mapped_column(String(150), nullable=False)
    clause_reference: Mapped[str] = mapped_column(String(100), nullable=False)
    test_category: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="passed", nullable=False)
    test_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    tested_by: Mapped[str | None] = mapped_column(String(100), nullable=True)
    parameters: Mapped[str | None] = mapped_column(Text, nullable=True)
    results: Mapped[str | None] = mapped_column(Text, nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

class NetworkTest(Base, TimestampMixin):
    __tablename__ = "network_tests"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    test_type: Mapped[str] = mapped_column(String(50), default="ping_latency", nullable=False)
    meter_id: Mapped[int | None] = mapped_column(ForeignKey("meters.id", ondelete="CASCADE"), nullable=True)
    dcu_id: Mapped[int | None] = mapped_column(ForeignKey("dcus.id", ondelete="CASCADE"), nullable=True)
    latency_ms: Mapped[float] = mapped_column(Float, nullable=False)
    packet_loss_pct: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rssi: Mapped[float] = mapped_column(Float, nullable=False)
    snr: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="passed", nullable=False)
    test_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
