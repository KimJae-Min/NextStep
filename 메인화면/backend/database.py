### backend/database.py
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

# 환경 변수 또는 기본값으로 데이터베이스 URL 설정
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/nextstep")

# SQLAlchemy 엔진 및 세션 생성
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()

# 모델 정의
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    spending = relationship("SpendingRecord", back_populates="user")

class SpendingRecord(Base):
    __tablename__ = "spending_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    user = relationship("User", back_populates="spending")

class RecommendLog(Base):
    __tablename__ = "recommend_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    query = Column(String, nullable=False)

class ForecastLog(Base):
    __tablename__ = "forecast_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    data_points = Column(Integer, nullable=False)

# 데이터베이스 초기화 함수
def init_db():
    Base.metadata.create_all(bind=engine)