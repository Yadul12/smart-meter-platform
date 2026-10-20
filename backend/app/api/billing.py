from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.billing import Bill

router = APIRouter()

@router.get("")
async def list_bills(skip: int = 0, limit: int = 50, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    query = select(Bill)
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(desc(Bill.bill_date)).offset(skip).limit(limit))
    bills = result.scalars().all()
    return {
        "items": [{
            "id": b.id, "bill_number": b.bill_number, "consumer_id": b.consumer_id,
            "billing_period_start": b.billing_period_start.isoformat(),
            "billing_period_end": b.billing_period_end.isoformat(),
            "total_active_energy": b.total_active_energy,
            "energy_charge": b.energy_charge, "fixed_charge": b.fixed_charge,
            "tax_amount": b.tax_amount, "total_amount": b.total_amount,
            "status": b.status
        } for b in bills],
        "total": total
    }

@router.post("/generate")
async def generate_bills(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    return {"status": "success", "bills_generated": 10}
