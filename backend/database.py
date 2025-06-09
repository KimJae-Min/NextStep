from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, JSON
from datetime import datetime
from backend.config import DATABASE_URL

Base = declarative_base()
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    spending_records = relationship("SpendingRecord", back_populates="user")
    bank_accounts = relationship("BankAccount", back_populates="user")

class SpendingRecord(Base):
    __tablename__ = "spending_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float)
    category = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="spending_records")

class ForecastLog(Base):
    __tablename__ = "forecast_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    request_data = Column(String)      # 입력값(JSON string)
    response_data = Column(JSON)       # 결과값(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")

class RecommendLog(Base):
    __tablename__ = "recommend_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recommended_policy = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")

class BankAccount(Base):
    __tablename__ = "bank_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    bank_name = Column(String)
    account_number = Column(String)
    balance = Column(Float, default=0.0)
    provider = Column(String, default="sample")   # "sample" or 실제 API 제공자
    external_id = Column(String, nullable=True)   # 실제 연동 시 계좌 식별자
    external_token = Column(String, nullable=True)
    user = relationship("User", back_populates="bank_accounts")
    transactions = relationship("Transaction", back_populates="account")


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    bank_account_id = Column(Integer, ForeignKey("bank_accounts.id"))
    amount = Column(Float)
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    account = relationship("BankAccount", back_populates="transactions")
