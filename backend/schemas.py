from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Any

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True

class SpendingRecordBase(BaseModel):
    date: datetime
    amount: float
    category: Optional[str] = None

class SpendingRecordCreate(SpendingRecordBase):
    pass

class SpendingRecordOut(SpendingRecordBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True

class ForecastRequestItem(BaseModel):
    ds: datetime
    y: float

class ForecastRequestSchema(BaseModel):
    data: List[ForecastRequestItem]
    periods: int

class ForecastResponseItem(BaseModel):
    ds: datetime
    yhat: float
    yhat_lower: float
    yhat_upper: float

class ForecastLogCreate(BaseModel):
    request_data: str
    response_data: Any

class ForecastLogOut(ForecastLogCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        orm_mode = True

class PolicyRecommendationOut(BaseModel):
    policy_name: str
    servId: str
    url: str
    # 필요하면 score(유사도)도 추가 가능


class RecommendLog(BaseModel):
    id: int
    user_id: int
    recommended_policy: str
    timestamp: datetime
    class Config:
        orm_mode = True

class BankAccountBase(BaseModel):
    bank_name: str
    account_number: str

class BankAccountCreate(BaseModel):
    bank_name: str
    account_number: str
    provider: Optional[str] = "sample"
    external_id: Optional[str] = None
    external_token: Optional[str] = None

class BankAccountOut(BankAccountBase):
    id: int
    balance: float
    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    amount: float
    description: Optional[str]
    timestamp: datetime

class TransactionCreate(TransactionBase):
    bank_account_id: int
    pass

class TransactionOut(TransactionBase):
    id: int
    bank_account_id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
