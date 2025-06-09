from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import get_db, User
from backend.schemas import UserOut
from backend.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=list[UserOut])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(User))
    return result.scalars().all()
