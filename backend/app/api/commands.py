from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timezone
import uuid, json

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.system import Command, CommandResult

router = APIRouter()

@router.get("")
async def list_commands(skip: int = 0, limit: int = 50, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    total = (await db.execute(select(func.count(Command.id)))).scalar() or 0
    result = await db.execute(select(Command).order_by(desc(Command.created_at)).offset(skip).limit(limit))
    commands = result.scalars().all()
    return {
        "items": [{
            "id": c.id, "command_id": c.command_id, "meter_id": c.meter_id,
            "command_type": c.command_type, "status": c.status,
            "created_at": c.created_at.isoformat() if c.created_at else None
        } for c in commands],
        "total": total
    }

@router.post("")
async def issue_command(data: dict, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    meter_id = data.get("meter_id", 1)
    command_type = data.get("command_type", "READ_METER")
    cmd = Command(
        command_id=f"CMD-{uuid.uuid4().hex[:8].upper()}",
        meter_id=meter_id,
        command_type=command_type,
        status="executed",
        executed_at=datetime.now(timezone.utc)
    )
    db.add(cmd)
    return {"command_id": cmd.command_id, "status": "success", "message": f"Command {command_type} acknowledged (120ms)"}
