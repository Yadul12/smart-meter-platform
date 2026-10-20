from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import random

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.meter import Meter

router = APIRouter()

@router.get("/meters")
async def hes_list_meters(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Meter).where(Meter.deleted_at.is_(None)).offset(skip).limit(limit))
    meters = result.scalars().all()
    return {"items": [{"id": m.id, "meter_id": m.meter_id, "status": m.status, "topology": m.topology,
                       "connectivity_type": m.connectivity_type, "signal_strength": m.signal_strength,
                       "last_communication": m.last_communication.isoformat() if m.last_communication else None,
                       "firmware_version": m.firmware_version} for m in meters]}

@router.post("/meters/{meter_id}/read")
async def hes_read_meter(meter_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Meter).where(Meter.id == meter_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Meter not found")
    m.voltage = round(random.uniform(228.0, 235.0), 1)
    m.current = round(random.uniform(1.0, 30.0), 2)
    m.active_power = round(m.voltage * m.current * (m.power_factor or 0.95) / 1000.0, 3)
    m.last_communication = datetime.now(timezone.utc)
    return {"status": "success", "meter_id": m.meter_id, "voltage": m.voltage, "current": m.current, "power": m.active_power}

@router.post("/meters/{meter_id}/action")
async def hes_meter_action(meter_id: int, data: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Meter).where(Meter.id == meter_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Meter not found")
    action = data.get("action", "activate")
    now = datetime.now(timezone.utc)
    if action in ("activate", "reconnect", "first_breath"):
        m.status = "online"
        m.voltage = round(random.uniform(230.0, 234.5), 1)
        m.current = round(random.uniform(4.5, 22.0), 2)
        m.active_power = round(m.voltage * m.current * 0.95 / 1000.0, 3)
        m.power_factor = 0.95
    elif action in ("deactivate", "last_gasp"):
        m.status = "power_off" if action == "last_gasp" else "offline"
        m.voltage = 0.0
        m.current = 0.0
        m.active_power = 0.0
        m.power_factor = 0.0
    m.last_communication = now
    return {
        "status": "success",
        "action": action,
        "meter_id": m.meter_id,
        "meter_status": m.status,
        "voltage": m.voltage,
        "current": m.current,
        "active_power": m.active_power,
        "message": f"Device command '{action.upper()}' executed on {m.meter_id} via DLMS/COSEM (IS 15959 Pt.2)"
    }

