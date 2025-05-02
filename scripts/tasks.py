### scripts/tasks.py

from celery import Celery
import os
import subprocess

# Celery 브로커 설정 (Redis 사용 예시)
BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
app = Celery("scripts_tasks", broker=BROKER_URL)

# 배치 작업 스케줄러: 매일 00:00에 임베딩/인덱스 재빌드
app.conf.beat_schedule = {
    'daily_rebuild_embeddings': {
        'task': 'scripts.tasks.rebuild_embeddings',
        'schedule': 24 * 3600.0,
    },
    'daily_rebuild_index': {
        'task': 'scripts.tasks.rebuild_index',
        'schedule': 24 * 3600.0,
    },
}

@app.task(name='scripts.tasks.rebuild_embeddings')
def rebuild_embeddings():
    # 임베딩 생성 스크립트 실행
    subprocess.run(['python', 'scripts/embed_policies.py'], check=True)

@app.task(name='scripts.tasks.rebuild_index')
def rebuild_index():
    # 인덱스 빌드 스크립트 실행
    subprocess.run(['python', 'scripts/build_index.py'], check=True)