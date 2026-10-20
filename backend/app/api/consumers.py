from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from typing import Optional

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.meter import Consumer

router = APIRouter()

@router.get("")
async def list_consumers(skip: int = 0, limit: int = 50, search: Optional[str] = None,
                         current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    query = select(Consumer).where(Consumer.deleted_at.is_(None))
    if search:
        query = query.where(or_(Consumer.name.ilike(f"%{search}%"), Consumer.consumer_number.ilike(f"%{search}%")))
    total = (await db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0
    result = await db.execute(query.order_by(Consumer.id).offset(skip).limit(limit))
    consumers = result.scalars().all()
    return {"items": [{"id": c.id, "consumer_number": c.consumer_number, "name": c.name,
                       "email": c.email, "phone": c.phone, "address": c.address,
                       "consumer_type": c.consumer_type, "sanctioned_load": c.sanctioned_load,
                       "tariff_id": c.tariff_id} for c in consumers], "total": total}

@router.get("/{consumer_id}")
async def get_consumer(consumer_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Consumer).where(Consumer.id == consumer_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Consumer not found")
    return {
        "id": c.id, "consumer_number": c.consumer_number, "name": c.name,
        "email": c.email, "phone": c.phone, "address": c.address,
        "consumer_type": c.consumer_type, "sanctioned_load": c.sanctioned_load,
        "tariff_id": c.tariff_id
    }
