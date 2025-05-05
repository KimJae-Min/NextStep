### backend/policy.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import numpy as np
import json
import faiss
import torch
from transformers import BertTokenizer, BertModel
from pathlib import Path
from backend.auth import oauth2_scheme, read_users_me
from backend.database import SessionLocal

# 라우터 설정
router = APIRouter()

# 모델 및 토크나이저 로드
tokenizer = BertTokenizer.from_pretrained("monologg/kobert")
model = BertModel.from_pretrained("monologg/kobert")
model.eval()

# 임베딩 및 메타 로드
EMBEDDINGS_FILE = Path("data/policy_embeddings.npy")
META_FILE = Path("data/policy_meta.json")
INDEX_FILE = Path("data/policy_index.faiss")
embs = np.load(EMBEDDINGS_FILE)
meta = json.loads(META_FILE.read_text(encoding="utf-8"))
index = faiss.read_index(str(INDEX_FILE))

class RecommendRequest(BaseModel):
    user_profile: str
    top_k: int = 5

class RecommendResponse(BaseModel):
    policy_name: str
    url: str | None = None

@router.post("/", response_model=list[RecommendResponse], tags=["recommend"])
def recommend(req: RecommendRequest, token: str = Depends(oauth2_scheme)):
    # 사용자 인증 및 프로필 검증
    db = SessionLocal()
    user = read_users_me(token, db)
    db.close()

    # 프로필 임베딩 함수
    inputs = tokenizer(req.user_profile, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        vec = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy().astype('float32')

    # Faiss 유사도 검색
    D, I = index.search(vec.reshape(1, -1), req.top_k)
    results = []
    for idx in I[0]:
        info = meta[idx]
        results.append(RecommendResponse(
            policy_name=info["policy_name"],
            url=info.get("url")
        ))
    return results