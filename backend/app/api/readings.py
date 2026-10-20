from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.reading import MeterReading

router = APIRouter()

@router.get("")
async def list_readings(
    skip: int = 0, limit: int = 100, meter_id: Optional[int] = None,
    current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)
):
    query = select(MeterReading)
    if meter_id:
        query = query.where(MeterReading.meter_id == meter_id)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(desc(MeterReading.reading_time)).offset(skip).limit(limit))
    readings = result.scalars().all()
    return {"items": [{
        "id": r.id, "meter_id": r.meter_id, "reading_time": r.reading_time.isoformat(),
        "reading_type": r.reading_type, "voltage": r.voltage, "current": r.current,
        "active_power": r.active_power, "power_factor": r.power_factor,
        "import_active_energy": r.import_active_energy, "vee_status": r.vee_status
    } for r in readings], "total": total}
