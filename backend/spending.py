from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import get_db, SpendingRecord
from backend.schemas import SpendingRecordCreate, SpendingRecordOut
from backend.auth import get_current_user

router = APIRouter(prefix="/spending", tags=["spending"])

@router.post("/", response_model=SpendingRecordOut)
async def create_spending(
    record: SpendingRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_record = SpendingRecord(
        date=record.date,
        amount=record.amount,
        category=record.category,
        user_id=current_user.id,
    )
    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)
    return db_record

@router.get("/", response_model=list[SpendingRecordOut])
async def get_spending(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(SpendingRecord).where(SpendingRecord.user_id == current_user.id)
    )
    return result.scalars().all()
