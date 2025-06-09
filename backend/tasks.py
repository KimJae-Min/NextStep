from celery import Celery
import os
import subprocess
from backend.database import AsyncSessionLocal, BankAccount, Transaction
from datetime import datetime

BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery_app = Celery("tasks", broker=BROKER_URL)

celery_app.conf.beat_schedule = {
    'rebuild_embeddings_daily': {
        'task': 'backend.tasks.rebuild_embeddings',
        'schedule': 24 * 3600.0,
    },
    'rebuild_index_daily': {
        'task': 'backend.tasks.rebuild_index',
        'schedule': 24 * 3600.0,
    },
}

EMBED_SCRIPT = os.path.join(os.getcwd(), "scripts", "embed_policies.py")
INDEX_SCRIPT = os.path.join(os.getcwd(), "scripts", "build_index.py")

@celery_app.task(name='backend.tasks.rebuild_embeddings')
def rebuild_embeddings():
    subprocess.run(['python', EMBED_SCRIPT], check=True)

@celery_app.task(name='backend.tasks.rebuild_index')
def rebuild_index():
    subprocess.run(['python', INDEX_SCRIPT], check=True)

@celery_app.task(name='tasks.fetch_transactions_for_account')
def fetch_transactions_for_account(account_id: int):
    db = AsyncSessionLocal()
    try:
        dummy_transactions = [
            {"amount": 10000.0, "description": "더미 입금 내역", "timestamp": datetime.utcnow()},
            {"amount": -5000.0, "description": "더미 지출 내역", "timestamp": datetime.utcnow()},
        ]
        for tx in dummy_transactions:
            new_tx = Transaction(
                bank_account_id=account_id,
                amount=tx["amount"],
                description=tx["description"],
                timestamp=tx["timestamp"]
            )
            db.add(new_tx)
        db.commit()
    finally:
        db.close()
