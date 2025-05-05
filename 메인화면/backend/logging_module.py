### backend/logging_module.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import datetime

from backend.database import SessionLocal, RecommendLog, ForecastLog

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RecommendLogOut(BaseModel):
    id: int
    user_id: int
    timestamp: datetime.datetime
    query: str
    class Config:
        orm_mode = True

class ForecastLogOut(BaseModel):
    id: int
    user_id: int
    timestamp: datetime.datetime
    data_points: int
    class Config:
        orm_mode = True

@router.get("/recommend", response_model=List[RecommendLogOut], tags=["logs"])
def read_recommend_logs(db: Session = Depends(get_db)):
    return db.query(RecommendLog).all()

@router.get("/forecast", response_model=List[ForecastLogOut], tags=["logs"])
def read_forecast_logs(db: Session = Depends(get_db)):
    return db.query(ForecastLog).all()