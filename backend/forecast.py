### backend/forecast.py

from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from pydantic import BaseModel
from typing import List
from prophet import Prophet
import pandas as pd
from backend.auth import oauth2_scheme, read_users_me
from sqlalchemy.orm import Session
from backend.database import SessionLocal, ForecastLog

router = APIRouter()

class ForecastRequest(BaseModel):
    data: List[dict]  # list of {"ds": "YYYY-MM-DD", "y": value}
    periods: int = 7

class ForecastPoint(BaseModel):
    ds: pd.Timestamp
    yhat: float
    yhat_lower: float
    yhat_upper: float

@router.post("/", response_model=List[ForecastPoint], tags=["forecast"])
def forecast(req: ForecastRequest, token: str = Depends(oauth2_scheme)):
    db: Session = SessionLocal()
    user = read_users_me(token, db)
    # 요청 로그 기록
    log = ForecastLog(user_id=user.id, timestamp=pd.Timestamp.now(), data_points=len(req.data))
    db.add(log)
    db.commit()

    # 데이터프레임 생성 및 예측
    df = pd.DataFrame(req.data)
    df["ds"] = pd.to_datetime(df["ds"])
    m = Prophet()
    m.fit(df)
    future = m.make_future_dataframe(periods=req.periods)
    fc = m.predict(future)
    result = fc[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(req.periods)
    db.close()
    return result.to_dict(orient="records")

