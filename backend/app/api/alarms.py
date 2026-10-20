from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.event import Alarm

router = APIRouter()

@router.get("")
async def list_alarms(skip: int = 0, limit: int = 50, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    query = select(Alarm)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(desc(Alarm.raised_at)).offset(skip).limit(limit))
    alarms = result.scalars().all()
    return {
        "items": [{
            "id": a.id, "alarm_id": a.alarm_id, "alarm_type": a.alarm_type,
            "severity": a.severity, "status": a.status, "description": a.description,
            "raised_at": a.raised_at.isoformat() if a.raised_at else None
        } for a in alarms],
        "total": total
    }

@router.post("/{alarm_id}/acknowledge")
async def ack_alarm(alarm_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(Alarm).where(Alarm.id == alarm_id))
    a = res.scalar_one_or_none()
    if a:
        a.status = "acknowledged"
    return {"status": "acknowledged"}

@router.post("/{alarm_id}/clear")
async def clear_alarm(alarm_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(Alarm).where(Alarm.id == alarm_id))
    a = res.scalar_one_or_none()
    if a:
        a.status = "cleared"
    return {"status": "cleared"}
