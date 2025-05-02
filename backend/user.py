### backend/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from backend.database import SessionLocal, User
from backend.schemas import UserOut
from backend.auth import oauth2_scheme, read_users_me

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=UserOut)
def get_my_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return read_users_me(token, db)

@router.put("/me", response_model=UserOut)
def update_my_profile(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.email = email
    db.commit()
    db.refresh(user)
    return user