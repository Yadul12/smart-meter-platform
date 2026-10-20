from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.event import Outage

router = APIRouter()

@router.get("")
async def list_outages(skip: int = 0, limit: int = 50, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    query = select(Outage)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(desc(Outage.start_time)).offset(skip).limit(limit))
    outages = result.scalars().all()
    return {
        "items": [{
            "id": o.id, "outage_id": o.outage_id, "meter_id": o.meter_id,
            "start_time": o.start_time.isoformat() if o.start_time else None,
            "end_time": o.end_time.isoformat() if o.end_time else None,
            "duration_minutes": o.duration_minutes, "cause": o.cause,
            "status": o.status, "area": o.area
        } for o in outages],
        "total": total
    }
