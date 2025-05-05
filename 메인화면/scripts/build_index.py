# scripts/build_index.py
# Usage: python scripts/build_index.py
# Builds a Faiss index for fast similarity search

import numpy as np
import faiss
from pathlib import Path

# 프로젝트 루트 기준 디렉토리
BASE_DIR = Path(__file__).resolve().parent.parent

# Paths
EMBEDDINGS_FILE = BASE_DIR / "data" / "policy_embeddings.npy"
INDEX_FILE      = BASE_DIR / "data" / "policy_index.faiss"

if __name__ == '__main__':
    # 임베딩 배열 로드
    embs = np.load(EMBEDDINGS_FILE)
    dim  = embs.shape[1]

    # Faiss 인덱스 생성 (Inner-product / cosine 유사도)
    index = faiss.IndexFlatIP(dim)
    index.add(embs)

    # 결과 저장 폴더 생성
    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)

    # 인덱스 직렬화
    faiss.write_index(index, str(INDEX_FILE))
    print(f"Built Faiss index with {embs.shape[0]} vectors")