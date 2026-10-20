from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional
from datetime import datetime, timezone

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.meter import Meter, Consumer

router = APIRouter()

@router.get("")
async def list_meters(
    skip: int = 0, limit: int = 50, status: Optional[str] = None,
    topology: Optional[str] = None, search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    query = select(Meter).where(Meter.deleted_at.is_(None))
    if status:
        query = query.where(Meter.status == status)
    if topology:
        query = query.where(Meter.topology == topology)
    if search:
        query = query.where(or_(
            Meter.meter_id.ilike(f"%{search}%"),
            Meter.serial_number.ilike(f"%{search}%"),
            Meter.ip_address.ilike(f"%{search}%"),
        ))

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    result = await db.execute(query.order_by(Meter.id).offset(skip).limit(limit))
    meters = result.scalars().all()

    items = []
    for m in meters:
        consumer_name = None
        if m.consumer_id:
            c_result = await db.execute(select(Consumer.name).where(Consumer.id == m.consumer_id))
            c_row = c_result.first()
            consumer_name = c_row[0] if c_row else None
        items.append({
            "id": m.id, "meter_id": m.meter_id, "serial_number": m.serial_number,
            "status": m.status, "phase": m.phase, "topology": m.topology,
            "connectivity_type": m.connectivity_type, "accuracy_class": m.accuracy_class,
            "voltage": m.voltage, "current": m.current, "active_power": m.active_power,
            "power_factor": m.power_factor, "frequency_measured": m.frequency_measured,
            "import_energy": m.import_energy, "export_energy": m.export_energy,
            "firmware_version": m.firmware_version, "ip_address": m.ip_address,
            "signal_strength": m.signal_strength, "latitude": m.latitude, "longitude": m.longitude,
            "last_communication": m.last_communication.isoformat() if m.last_communication else None,
            "last_reading_time": m.last_reading_time.isoformat() if m.last_reading_time else None,
            "installation_date": m.installation_date.isoformat() if m.installation_date else None,
            "consumer_id": m.consumer_id, "consumer_name": consumer_name,
            "manufacturer": m.manufacturer,
        })
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.get("/stats")
async def meter_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    total = (await db.execute(select(func.count(Meter.id)).where(Meter.deleted_at.is_(None)))).scalar() or 0
    online = (await db.execute(select(func.count(Meter.id)).where(Meter.status == "online", Meter.deleted_at.is_(None)))).scalar() or 0
    offline = (await db.execute(select(func.count(Meter.id)).where(Meter.status == "offline", Meter.deleted_at.is_(None)))).scalar() or 0
    power_off = (await db.execute(select(func.count(Meter.id)).where(Meter.status == "power_off", Meter.deleted_at.is_(None)))).scalar() or 0
    return {"total": total, "online": online, "offline": offline, "power_off": power_off}

@router.get("/{meter_id}")
async def get_meter(
    meter_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(Meter).where(Meter.id == meter_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Meter not found")
    consumer_data = None
    if m.consumer_id:
        c_res = await db.execute(select(Consumer).where(Consumer.id == m.consumer_id))
        consumer = c_res.scalar_one_or_none()
        if consumer:
            consumer_data = {"id": consumer.id, "consumer_number": consumer.consumer_number,
                             "name": consumer.name, "address": consumer.address, "phone": consumer.phone}
    return {
        "id": m.id, "meter_id": m.meter_id, "serial_number": m.serial_number,
        "meter_type": m.meter_type, "accuracy_class": m.accuracy_class,
        "phase": m.phase, "rated_voltage": m.rated_voltage, "rated_current": m.rated_current,
        "max_current": m.max_current, "frequency": m.frequency,
        "firmware_version": m.firmware_version, "manufacturer": m.manufacturer,
        "connectivity_type": m.connectivity_type, "topology": m.topology,
        "ip_address": m.ip_address, "sim_iccid": m.sim_iccid,
        "signal_strength": m.signal_strength,
        "latitude": m.latitude, "longitude": m.longitude,
        "status": m.status, "voltage": m.voltage, "current": m.current,
        "active_power": m.active_power, "reactive_power": m.reactive_power,
        "apparent_power": m.apparent_power, "power_factor": m.power_factor,
        "frequency_measured": m.frequency_measured,
        "import_energy": m.import_energy, "export_energy": m.export_energy,
        "last_communication": m.last_communication.isoformat() if m.last_communication else None,
        "last_reading_time": m.last_reading_time.isoformat() if m.last_reading_time else None,
        "installation_date": m.installation_date.isoformat() if m.installation_date else None,
        "consumer_id": m.consumer_id, "consumer": consumer_data
    }
