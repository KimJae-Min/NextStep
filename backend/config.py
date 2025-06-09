import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
BANK_CLIENT_ID = os.getenv("BANK_CLIENT_ID")
BANK_CLIENT_SECRET = os.getenv("BANK_CLIENT_SECRET")
BANK_REDIRECT_URI = os.getenv("BANK_REDIRECT_URI")
BOKJIRO_API_KEY = os.getenv("BOKJIRO_API_KEY")
