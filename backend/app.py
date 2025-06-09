from fastapi import FastAPI
from backend.user import router as user_router
from backend.spending import router as spending_router
from backend.forecast import router as forecast_router
from backend.policy import router as policy_router
from backend.admin import router as admin_router
from backend.bank import router as bank_router
from backend.auth import router as auth_router


app = FastAPI()
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(spending_router)
app.include_router(forecast_router)
app.include_router(policy_router)
app.include_router(admin_router)
app.include_router(bank_router)

@app.get("/")
async def root():
    return {"msg": "NextStep API is running!"}
