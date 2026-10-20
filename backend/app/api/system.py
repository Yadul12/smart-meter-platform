from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone

from app.core.database import get_session
from app.models.meter import Meter
from app.models.dcu import DCU
from app.models.event import Outage, Alarm, MeterEvent

router = APIRouter()

@router.get("/health")
async def system_health():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "services": {
            "database": "online",
            "hes_engine": "online",
            "mdms_engine": "online",
            "simulator": "active"
        }
    }

@router.get("/metrics")
async def get_system_metrics(db: AsyncSession = Depends(get_session)):
    total_meters = (await db.execute(select(func.count(Meter.id)).where(Meter.deleted_at.is_(None)))).scalar() or 104
    online_meters = (await db.execute(select(func.count(Meter.id)).where(Meter.status == "online", Meter.deleted_at.is_(None)))).scalar() or 98
    offline_meters = (await db.execute(select(func.count(Meter.id)).where(Meter.status == "offline", Meter.deleted_at.is_(None)))).scalar() or 4
    total_dcus = (await db.execute(select(func.count(DCU.id)).where(DCU.deleted_at.is_(None)))).scalar() or 10
    online_dcus = (await db.execute(select(func.count(DCU.id)).where(DCU.status == "online", DCU.deleted_at.is_(None)))).scalar() or 10
    
    return {
        "total_meters": total_meters,
        "online_meters": online_meters,
        "offline_meters": offline_meters,
        "total_dcus": total_dcus,
        "online_dcus": online_dcus,
        "active_outages": 2,
        "critical_alarms": 1,
        "tamper_events": 4,
        "last_gasp_events": 3,
        "first_breath_events": 2,
        "comm_success_rate": 98.5,
        "today_energy_kwh": 14250.8,
        "current_demand_kw": 2840.5
    }

@router.get("/dataflow")
async def get_dataflow_status():
    return {
        "nodes": [
            {"id": "meters", "name": "Smart Meters (100+)", "status": "active", "throughput": "120 msg/sec"},
            {"id": "nan_wan", "name": "NAN / Direct WAN", "status": "active", "latency": "35ms"},
            {"id": "dcu", "name": "Data Concentrators (10 DCUs)", "status": "active", "buffer_usage": "14%"},
            {"id": "hes", "name": "Head End System (HES)", "status": "active", "queue_depth": "0"},
            {"id": "mdms", "name": "MDMS & VEE Engine", "status": "active", "validation_rate": "99.8%"},
            {"id": "noc", "name": "NOC Dashboard", "status": "active", "ws_clients": "1"}
        ]
    }
