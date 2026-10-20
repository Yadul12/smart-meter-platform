from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import random, uuid

from app.core.database import get_session
from app.core.websocket import ws_manager
from app.models.meter import Meter
from app.models.event import MeterEvent, Outage
from app.models.reading import MeterReading

router = APIRouter()

SIMULATION_STATE = {
    "is_running": True,
    "tick_rate_seconds": 15,
    "last_gasp_count": 3,
    "first_breath_count": 2,
    "readings_generated": 150
}

@router.get("/status")
async def get_status():
    return SIMULATION_STATE

@router.post("/toggle")
async def toggle_sim():
    SIMULATION_STATE["is_running"] = not SIMULATION_STATE["is_running"]
    return {"status": "toggled", "is_running": SIMULATION_STATE["is_running"]}

@router.post("/trigger/reading")
async def trigger_reading(data: dict = {}, db: AsyncSession = Depends(get_session)):
    meter_id = data.get("meter_id", 1)
    res = await db.execute(select(Meter).where(Meter.id == meter_id))
    m = res.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if m:
        v = round(random.uniform(228.0, 236.0), 1)
        c = round(random.uniform(1.0, 25.0), 2)
        p = round(v * c * 0.95 / 1000.0, 3)
        m.voltage = v
        m.current = c
        m.active_power = p
        m.import_energy = round((m.import_energy or 100.0) + 0.15, 3)
        m.last_reading_time = now
        m.last_communication = now
        
        reading = MeterReading(
            meter_id=m.id, reading_time=now, reading_type="periodic",
            voltage=v, current=c, frequency=50.0, active_power=p, power_factor=0.95,
            import_active_energy=m.import_energy, source="simulator", vee_status="validated"
        )
        db.add(reading)
        
        await ws_manager.broadcast_all({
            "type": "METER_READING", "meter_id": m.meter_id, "voltage": v, "current": c, "timestamp": now.isoformat()
        })
    return {"status": "success", "readings_created": 1}

@router.post("/trigger/last-gasp")
async def trigger_last_gasp(data: dict = {}, db: AsyncSession = Depends(get_session)):
    meter_id = data.get("meter_id", 13)
    res = await db.execute(select(Meter).where(Meter.id == meter_id))
    meter = res.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if meter:
        meter.status = "power_off"
        meter.voltage = 0.0
        meter.current = 0.0
        meter.active_power = 0.0
        event = MeterEvent(
            event_id=f"EVT-{uuid.uuid4().hex[:8].upper()}",
            meter_id=meter.id, event_type="LAST_GASP", event_category="power_quality",
            severity="critical", description=f"Power failure Last Gasp signal received from meter {meter.meter_id}",
            event_time=now
        )
        db.add(event)
        outage = Outage(
            outage_id=f"OUT-{uuid.uuid4().hex[:8].upper()}", meter_id=meter.id,
            start_time=now, cause="Power Grid Interruption", status="ongoing",
            affected_customers=1, area="South Delhi Sector 4"
        )
        db.add(outage)
        await ws_manager.broadcast_all({
            "type": "LAST_GASP", "meter_id": meter.meter_id, "event_id": event.event_id,
            "description": event.description, "timestamp": now.isoformat()
        })
        return {"status": "success", "meter_id": meter.meter_id, "event_type": "LAST_GASP"}
    return {"status": "error"}

@router.post("/trigger/first-breath")
async def trigger_first_breath(data: dict = {}, db: AsyncSession = Depends(get_session)):
    meter_id = data.get("meter_id", 13)
    res = await db.execute(select(Meter).where(Meter.id == meter_id))
    meter = res.scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if meter:
        meter.status = "online"
        meter.voltage = 230.5
        meter.current = 3.2
        meter.active_power = 0.72
        event = MeterEvent(
            event_id=f"EVT-{uuid.uuid4().hex[:8].upper()}",
            meter_id=meter.id, event_type="FIRST_BREATH", event_category="power_quality",
            severity="info", description=f"Power restored First Breath signal received from meter {meter.meter_id}",
            event_time=now
        )
        db.add(event)
        outage_res = await db.execute(select(Outage).where(Outage.meter_id == meter.id, Outage.status == "ongoing"))
        outage = outage_res.scalar_one_or_none()
        if outage:
            outage.status = "resolved"
            outage.end_time = now
            outage.duration_minutes = 15.0
        await ws_manager.broadcast_all({
            "type": "FIRST_BREATH", "meter_id": meter.meter_id, "event_id": event.event_id,
            "description": event.description, "timestamp": now.isoformat()
        })
        return {"status": "success", "meter_id": meter.meter_id, "event_type": "FIRST_BREATH"}
    return {"status": "error"}
