from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.core.database import get_session
from app.core.security import (
    hash_password, verify_password, create_access_token,
    get_current_user, RoleChecker, ADMIN_ROLES, ALL_ROLES
)
from app.models.user import User, Role, UserRole

router = APIRouter()

@router.post("/login")
async def login(data: dict, db: AsyncSession = Depends(get_session)):
    username = data.get("username", "")
    password = data.get("password", "")
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    
    role_result = await db.execute(
        select(Role.name).join(UserRole).where(UserRole.user_id == user.id)
    )
    roles = [r[0] for r in role_result.fetchall()]
    token = create_access_token({"sub": str(user.id), "username": user.username, "roles": roles})
    return {
        "access_token": token, "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "full_name": user.full_name,
                 "email": user.email, "roles": roles}
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_session)):
    role_result = await db.execute(
        select(Role.name).join(UserRole).where(UserRole.user_id == current_user.id)
    )
    roles = [r[0] for r in role_result.fetchall()]
    return {
        "id": current_user.id, "username": current_user.username,
        "full_name": current_user.full_name, "email": current_user.email,
        "phone": current_user.phone, "is_active": current_user.is_active,
        "roles": roles, "consumer_id": current_user.consumer_id
    }

@router.get("/users")
async def list_users(
    skip: int = 0, limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    result = await db.execute(select(User).offset(skip).limit(limit))
    users = result.scalars().all()
    return {"items": [{"id": u.id, "username": u.username, "full_name": u.full_name,
                       "email": u.email, "is_active": u.is_active} for u in users],
            "total": len(users)}
