from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional
from datetime import datetime, timezone

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.event import MeterEvent

router = APIRouter()

@router.get("")
async def list_events(
    skip: int = 0, limit: int = 50, meter_id: Optional[int] = None,
    current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)
):
    query = select(MeterEvent)
    if meter_id:
        query = query.where(MeterEvent.meter_id == meter_id)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(desc(MeterEvent.event_time)).offset(skip).limit(limit))
    events = result.scalars().all()
    return {
        "items": [{
            "id": e.id, "event_id": e.event_id, "meter_id": e.meter_id,
            "event_type": e.event_type, "event_category": e.event_category,
            "severity": e.severity, "description": e.description,
            "event_time": e.event_time.isoformat() if e.event_time else None,
            "acknowledged": e.acknowledged, "resolved": e.resolved
        } for e in events],
        "total": total
    }

@router.post("/{event_id}/acknowledge")
async def ack_event(event_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(MeterEvent).where(MeterEvent.id == event_id))
    ev = res.scalar_one_or_none()
    if ev:
        ev.acknowledged = True
        ev.acknowledged_at = datetime.now(timezone.utc)
    return {"status": "acknowledged"}

@router.post("/{event_id}/resolve")
async def resolve_event(event_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    res = await db.execute(select(MeterEvent).where(MeterEvent.id == event_id))
    ev = res.scalar_one_or_none()
    if ev:
        ev.resolved = True
        ev.resolved_at = datetime.now(timezone.utc)
    return {"status": "resolved"}
