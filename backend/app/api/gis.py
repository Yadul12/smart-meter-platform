from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.meter import Meter
from app.models.dcu import DCU
from app.models.event import Outage

router = APIRouter()

@router.get("/meters")
async def get_gis_meters(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Meter).where(Meter.deleted_at.is_(None)))
    meters = result.scalars().all()
    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [m.longitude or 77.2090, m.latitude or 28.6139]},
            "properties": {
                "id": m.id, "meter_id": m.meter_id, "status": m.status,
                "phase": m.phase, "voltage": m.voltage, "active_power": m.active_power,
                "topology": m.topology
            }
        } for m in meters]
    }

@router.get("/dcus")
async def get_gis_dcus(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(DCU).where(DCU.deleted_at.is_(None)))
    dcus = result.scalars().all()
    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [d.longitude or 77.2090, d.latitude or 28.6139]},
            "properties": {
                "id": d.id, "dcu_id": d.dcu_id, "name": d.name, "status": d.status,
                "total_connected_meters": d.total_connected_meters
            }
        } for d in dcus]
    }

@router.get("/outages")
async def get_gis_outages(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    return {"type": "FeatureCollection", "features": []}
