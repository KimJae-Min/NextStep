# scripts/embed_policies.py
# Usage: python scripts/embed_policies.py
# Generates policy embeddings from structured JSON files and saves them

import json
import numpy as np
from pathlib import Path
from transformers import BertTokenizer, BertModel
import torch

# 프로젝트 루트 경로 계산
BASE_DIR = Path(__file__).resolve().parent.parent

# Paths
STRUCTURED_DIR   = BASE_DIR / "structured_policies"
EMBEDDINGS_FILE  = BASE_DIR / "data" / "policy_embeddings.npy"
META_FILE        = BASE_DIR / "data" / "policy_meta.json"

# Initialize model & tokenizer
tokenizer = BertTokenizer.from_pretrained("monologg/kobert")
model     = BertModel.from_pretrained("monologg/kobert")
model.eval()

def embed_text(text: str) -> np.ndarray:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        out = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy()
    return out

if __name__ == "__main__":
    embeddings = []
    meta       = []

    # structured_policies 아래 JSON 파일을 모두 순회
    for collector_dir in STRUCTURED_DIR.iterdir():
        if not collector_dir.is_dir():
            continue
        for json_file in collector_dir.glob("*.json"):
            data = json.loads(json_file.read_text(encoding="utf-8"))
            # benefit + target 텍스트 조합
            text = f"{data.get('benefit','')} {data.get('target','')}"
            vec  = embed_text(text)
            embeddings.append(vec)
            meta.append({
                "collector":     collector_dir.name,
                "file":          json_file.name,
                "policy_name":   data.get("policy_name"),
                "url":           data.get("url", "")
            })

    # 결과 저장 전용 폴더 생성
    EMBEDDINGS_FILE.parent.mkdir(parents=True, exist_ok=True)

    # NumPy 임베딩 배열 저장
    np.save(EMBEDDINGS_FILE, np.stack(embeddings))

    # 메타 JSON 저장
    META_FILE.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Saved {len(embeddings)} embeddings to {EMBEDDINGS_FILE}")
