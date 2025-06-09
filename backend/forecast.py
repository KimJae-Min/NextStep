from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db, ForecastLog, User
from backend.schemas import ForecastRequestSchema, ForecastResponseItem
from backend.auth import get_current_user
import pandas as pd
from prophet import Prophet

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.post("/", response_model=List[ForecastResponseItem], summary="지출 예측")
async def forecast(
    req: ForecastRequestSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        df = pd.DataFrame([item.dict() for item in req.data])
        df["ds"] = pd.to_datetime(df["ds"])
    except Exception:
        raise HTTPException(status_code=400, detail="잘못된 시계열 데이터입니다.")

    m = Prophet()
    m.fit(df)
    future = m.make_future_dataframe(periods=req.periods)
    fc = m.predict(future)

    recent = fc[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(req.periods)
    response_list = [
        ForecastResponseItem(
            ds=row["ds"].to_pydatetime(),
            yhat=float(row["yhat"]),
            yhat_lower=float(row["yhat_lower"]),
            yhat_upper=float(row["yhat_upper"]),
        )
        for _, row in recent.iterrows()
    ]
    try:
        log_entry = ForecastLog(
            user_id=current_user.id,
            request_data=req.json(),
            response_data=[item.dict() for item in response_list],
        )
        db.add(log_entry)
        await db.commit()
    except Exception:
        await db.rollback()
    return response_list
