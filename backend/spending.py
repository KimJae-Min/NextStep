### backend/spending.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import SessionLocal, SpendingRecord
from backend.schemas import SpendingCreate, SpendingOut
from backend.auth import oauth2_scheme, read_users_me
from backend.database import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[SpendingOut], tags=["spendings"])
def read_spendings(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = read_users_me(token, db)
    return db.query(SpendingRecord).filter(SpendingRecord.user_id == user.id).all()

@router.post("/", response_model=SpendingOut, status_code=status.HTTP_201_CREATED, tags=["spendings"])
def create_spending(item: SpendingCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = read_users_me(token, db)
    record = SpendingRecord(
        user_id=user.id,
        date=item.date,
        amount=item.amount,
        category=item.category
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.put("/{spending_id}", response_model=SpendingOut, tags=["spendings"])
def update_spending(spending_id: int, item: SpendingCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = read_users_me(token, db)
    record = db.query(SpendingRecord).filter(
        SpendingRecord.id == spending_id,
        SpendingRecord.user_id == user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Spending record not found")
    record.date = item.date
    record.amount = item.amount
    record.category = item.category
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{spending_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["spendings"])
def delete_spending(spending_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = read_users_me(token, db)
    record = db.query(SpendingRecord).filter(
        SpendingRecord.id == spending_id,
        SpendingRecord.user_id == user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Spending record not found")
    db.delete(record)
    db.commit()