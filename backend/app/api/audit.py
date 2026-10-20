from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models.system import AuditLog

router = APIRouter()

@router.get("")
async def list_logs(skip: int = 0, limit: int = 50, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(AuditLog).order_by(desc(AuditLog.timestamp)).offset(skip).limit(limit))
    logs = result.scalars().all()
    return {
        "items": [{
            "id": l.id, "username": l.username, "action": l.action,
            "resource_type": l.resource_type, "resource_id": l.resource_id,
            "ip_address": l.ip_address, "timestamp": l.timestamp.isoformat() if l.timestamp else None,
            "details": l.details
        } for l in logs],
        "total": len(logs)
    }
