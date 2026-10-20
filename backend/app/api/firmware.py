from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.system import FirmwareVersion, FirmwareJob

router = APIRouter()

@router.get("/versions")
async def list_versions(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(FirmwareVersion).order_by(desc(FirmwareVersion.release_date)))
    versions = result.scalars().all()
    return {
        "items": [{
            "id": v.id, "version_code": v.version_code, "target_hardware": v.target_hardware,
            "release_date": v.release_date.isoformat() if v.release_date else None,
            "file_size": v.file_size, "checksum": v.checksum, "is_active": v.is_active,
            "release_notes": v.release_notes
        } for v in versions]
    }

@router.get("/jobs")
async def list_jobs(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(FirmwareJob).order_by(desc(FirmwareJob.created_at)))
    jobs = result.scalars().all()
    return {
        "items": [{
            "id": j.id, "job_name": j.job_name, "status": j.status,
            "target_meters_count": j.target_meters_count, "completed_meters_count": j.completed_meters_count
        } for j in jobs]
    }

@router.post("/jobs")
async def create_job(data: dict, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    job = FirmwareJob(
        job_name=data.get("job_name", "OTA-Rollout-v1.2.4"),
        firmware_version_id=data.get("firmware_version_id", 1),
        status="in_progress",
        target_meters_count=data.get("target_meters_count", 25),
        completed_meters_count=5
    )
    db.add(job)
    return {"id": 1, "job_name": job.job_name, "status": "created"}
