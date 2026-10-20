from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base, TimestampMixin

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    username: Mapped[str | None] = mapped_column(String(50), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)

class FirmwareVersion(Base, TimestampMixin):
    __tablename__ = "firmware_versions"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    version_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    target_hardware: Mapped[str] = mapped_column(String(100), nullable=False)
    release_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, default=524288, nullable=False)
    checksum: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    release_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

class FirmwareJob(Base, TimestampMixin):
    __tablename__ = "firmware_jobs"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    job_name: Mapped[str] = mapped_column(String(100), nullable=False)
    firmware_version_id: Mapped[int] = mapped_column(ForeignKey("firmware_versions.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    target_meters_count: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    completed_meters_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    failed_meters_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_by: Mapped[int | None] = mapped_column(Integer, nullable=True)

class Command(Base, TimestampMixin):
    __tablename__ = "commands"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    command_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    meter_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    dcu_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    command_type: Mapped[str] = mapped_column(String(50), nullable=False)
    parameters: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    created_by: Mapped[int | None] = mapped_column(Integer, nullable=True)
    executed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class CommandResult(Base):
    __tablename__ = "command_results"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    command_id: Mapped[int] = mapped_column(ForeignKey("commands.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="success", nullable=False)
    result_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    execution_duration_ms: Mapped[int | None] = mapped_column(Integer, default=100, nullable=True)

class VEEResult(Base, TimestampMixin):
    __tablename__ = "vee_results"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    meter_id: Mapped[int] = mapped_column(Integer, nullable=False)
    reading_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rule_name: Mapped[str] = mapped_column(String(100), nullable=False)
    rule_category: Mapped[str] = mapped_column(String(50), default="validation", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="passed", nullable=False)
    original_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    modified_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    message: Mapped[str | None] = mapped_column(String(255), nullable=True)
