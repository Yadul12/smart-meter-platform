from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.billing import Tariff, TariffSlab

router = APIRouter()

@router.get("")
async def list_tariffs(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Tariff))
    tariffs = result.scalars().all()
    items = []
    for t in tariffs:
        slabs_res = await db.execute(select(TariffSlab).where(TariffSlab.tariff_id == t.id).order_by(TariffSlab.slab_order))
        slabs = slabs_res.scalars().all()
        items.append({
            "id": t.id, "tariff_code": t.tariff_code, "name": t.name,
            "category": t.category, "description": t.description,
            "fixed_charge": t.fixed_charge, "tax_rate_percent": t.tax_rate_percent,
            "is_tou_enabled": t.is_tou_enabled,
            "slabs": [{
                "id": s.id, "slab_type": s.slab_type, "start_time": s.start_time,
                "end_time": s.end_time, "rate_per_unit": s.rate_per_unit
            } for s in slabs]
        })
    return {"items": items}
