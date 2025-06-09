from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import get_db, BankAccount, Transaction
from backend.schemas import BankAccountCreate, BankAccountOut, TransactionCreate, TransactionOut
from backend.auth import get_current_user
from datetime import timezone

router = APIRouter(prefix="/bank", tags=["bank"])

from datetime import datetime

def make_naive(dt: datetime) -> datetime:
    """timezone-aware datetime을 naive(타임존 없는)로 변환"""
    if dt is not None and dt.tzinfo is not None:
        return dt.astimezone(tz=None).replace(tzinfo=None)
    return dt

@router.post("/accounts/", response_model=BankAccountOut)
async def create_account(
    account: BankAccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_account = BankAccount(
        user_id=current_user.id,
        bank_name=account.bank_name,
        account_number=account.account_number
    )
    db.add(db_account)
    await db.commit()
    await db.refresh(db_account)
    return db_account

@router.get("/accounts/", response_model=list[BankAccountOut])
async def get_accounts(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(BankAccount).where(BankAccount.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("/transactions/", response_model=TransactionOut)
async def create_transaction(
    tx: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 1. timestamp가 tz-aware라면 naive로 변환
    timestamp = tx.timestamp
    if timestamp is not None:
        timestamp = make_naive(timestamp)
    else:
        timestamp = datetime.utcnow()

    # 2. 거래 생성
    db_tx = Transaction(
        bank_account_id=tx.bank_account_id,
        amount=tx.amount,
        description=tx.description,
        timestamp=timestamp
    )
    db.add(db_tx)

    # 3. 잔액 갱신
    account = await db.get(BankAccount, tx.bank_account_id)
    if account is not None:
        account.balance += tx.amount
    else:
        raise HTTPException(status_code=404, detail="Bank account not found")

    await db.commit()
    await db.refresh(db_tx)
    return db_tx



@router.get("/transactions/", response_model=list[TransactionOut])
async def get_transactions(
    bank_account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(Transaction).where(Transaction.bank_account_id == bank_account_id)
    )
    return result.scalars().all()
