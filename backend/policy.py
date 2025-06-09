from fastapi import APIRouter, Depends, Query
from typing import List
from backend.auth import get_current_user, User
from backend.schemas import PolicyRecommendationOut
import numpy as np
import faiss
import json
from transformers import AutoTokenizer, AutoModel
import torch
from backend.query_expansion import query_expand

torch.set_num_threads(1)
torch.set_num_interop_threads(1)

tokenizer = AutoTokenizer.from_pretrained("monologg/kobert", trust_remote_code=True)
model = AutoModel.from_pretrained("monologg/kobert", trust_remote_code=True)
model.eval()

DATA_DIR = "data"
EMBEDDINGS_FILE = f"{DATA_DIR}/policy_embeddings.npy"
INDEX_FILE = f"{DATA_DIR}/policy_index.faiss"
META_FILE = f"{DATA_DIR}/policy_meta.json"

policy_embeddings = np.load(EMBEDDINGS_FILE)
policy_index = faiss.read_index(INDEX_FILE)
with open(META_FILE, encoding="utf-8") as f:
    policy_meta = json.load(f)

router = APIRouter()

def embed_text_with_expansion(text: str) -> np.ndarray:
    expanded_tags = query_expand(text)
    text_full = text + " " + " ".join(expanded_tags)
    inputs = tokenizer(text_full, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        out = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy()
        out = out / (np.linalg.norm(out) + 1e-10)
    return out.reshape(1, -1).astype("float32")

def search_similar_policies(query_embedding: np.ndarray, top_k: int = 5):
    D, I = policy_index.search(query_embedding, top_k)
    return I[0].tolist()

def rerank_with_tags(results, query_tags):
    def score(policy):
        policy_tags = policy.get("trgterIndvdlArray", "")
        s = sum([1 for tag in query_tags if tag in policy_tags])
        return s
    return sorted(results, key=lambda p: score(p), reverse=True)

@router.get("/recommend", response_model=List[PolicyRecommendationOut])
async def recommend_policies(
    query: str = Query(..., description="정책 추천을 위한 사용자 자연어/상황"),
    top_k: int = Query(5, description="추천 정책 개수"),
    current_user: User = Depends(get_current_user)
):
    query_tags = query_expand(query)
    query_vec = embed_text_with_expansion(query)
    indices = search_similar_policies(query_vec, top_k=top_k*2)
    results = [policy_meta[i] for i in indices]
    results_reranked = rerank_with_tags(results, query_tags)
    return results_reranked[:top_k]
