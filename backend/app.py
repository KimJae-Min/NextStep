# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import router as auth_router
from backend.user import router as user_router
from backend.spending import router as spending_router
from backend.policy import router as policy_router
from backend.forecast import router as forecast_router
from backend.logging_module import router as log_router
from backend.tasks import router as tasks_router
import uvicorn

app = FastAPI(title="NextStep API")

# CORS 설정 (개발 단계: allow_origins=["*"], 운영 시 엄격히 제한)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 연결
app.include_router(auth_router,       prefix="/auth",       tags=["auth"])
app.include_router(user_router,       prefix="/users",      tags=["users"])
app.include_router(spending_router,   prefix="/spendings",  tags=["spendings"])
app.include_router(policy_router,     prefix="/recommend",  tags=["recommend"])
app.include_router(forecast_router,   prefix="/forecast",   tags=["forecast"])
app.include_router(log_router,        prefix="/logs",       tags=["logs"])
app.include_router(tasks_router,      prefix="/tasks",      tags=["tasks"])

if __name__ == "__main__":
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
