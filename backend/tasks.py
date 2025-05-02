### backend/tasks.py

from celery import Celery
import os
import subprocess

# Celery 설정
BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
app = Celery("tasks", broker=BROKER_URL)

# 작업 스케줄러 등록 (예: 00:00 매일 재빌드)
app.conf.beat_schedule = {
    'rebuild_embeddings_daily': {
        'task': 'tasks.rebuild_embeddings',
        'schedule': 24 * 3600.0,  # 매 24시간마다
    },
    'rebuild_index_daily': {
        'task': 'tasks.rebuild_index',
        'schedule': 24 * 3600.0,
    },
}

@app.task(name='tasks.rebuild_embeddings')
def rebuild_embeddings():
    # embed_policies 스크립트 실행
    subprocess.run(['python', 'scripts/embed_policies.py'], check=True)

@app.task(name='tasks.rebuild_index')
def rebuild_index():
    # build_index 스크립트 실행
    subprocess.run(['python', 'scripts/build_index.py'], check=True)