from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.core.database import get_session
from app.models.meter import Meter, Consumer
from app.models.dcu import DCU

router = APIRouter()

@router.get("")
async def search(q: str = Query(..., min_length=1), db: AsyncSession = Depends(get_session)):
    pattern = f"%{q}%"
    m_res = await db.execute(select(Meter).where(or_(Meter.meter_id.ilike(pattern), Meter.serial_number.ilike(pattern))).limit(5))
    meters = [{"type": "meter", "id": m.id, "title": m.meter_id, "subtitle": f"Serial: {m.serial_number} | Status: {m.status}", "link": f"/meters/{m.id}"} for m in m_res.scalars().all()]
    
    d_res = await db.execute(select(DCU).where(or_(DCU.dcu_id.ilike(pattern), DCU.name.ilike(pattern))).limit(5))
    dcus = [{"type": "dcu", "id": d.id, "title": d.dcu_id, "subtitle": f"{d.name} | Status: {d.status}", "link": f"/dcus"} for d in d_res.scalars().all()]
    
    return {"query": q, "results": meters + dcus}
