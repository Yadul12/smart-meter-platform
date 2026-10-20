from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.dcu import DCU

router = APIRouter()

@router.get("")
async def list_dcus(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    query = select(DCU).where(DCU.deleted_at.is_(None))
    result = await db.execute(query.order_by(DCU.id).offset(skip).limit(limit))
    dcus = result.scalars().all()
    total = (await db.execute(select(func.count(DCU.id)).where(DCU.deleted_at.is_(None)))).scalar() or 0
    items = []
    for d in dcus:
        items.append({
            "id": d.id, "dcu_id": d.dcu_id, "name": d.name, "ip_address": d.ip_address,
            "firmware_version": d.firmware_version, "status": d.status,
            "wan_protocol": d.wan_protocol, "nan_protocol": d.nan_protocol,
            "wan_status": d.wan_status, "nan_status": d.nan_status,
            "signal_quality": d.signal_quality, "latitude": d.latitude, "longitude": d.longitude,
            "last_heartbeat": d.last_heartbeat.isoformat() if d.last_heartbeat else None,
            "total_connected_meters": d.total_connected_meters, "online_meters": d.online_meters,
            "offline_meters": d.offline_meters, "stored_messages": d.stored_messages,
            "buffer_size": d.buffer_size,
        })
    return {"items": items, "total": total}
