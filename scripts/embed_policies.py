import json
import numpy as np
from pathlib import Path
from transformers import AutoTokenizer, AutoModel
import torch

STRUCTURED_DIR = Path("structured_policies/central")
DATA_DIR = Path("data")
EMBEDDINGS_FILE = DATA_DIR / "policy_embeddings.npy"
META_FILE = DATA_DIR / "policy_meta.json"

tokenizer = AutoTokenizer.from_pretrained("monologg/kobert", trust_remote_code=True)
model = AutoModel.from_pretrained("monologg/kobert", trust_remote_code=True)
model.eval()

def embed_text(text: str) -> np.ndarray:
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        out = model(**inputs).last_hidden_state.mean(dim=1).squeeze().numpy()
        out = out / (np.linalg.norm(out) + 1e-10)  # L2 정규화(코사인 유사도)
    return out

if __name__ == '__main__':
    embeddings = []
    meta = []
    for json_file in STRUCTURED_DIR.glob("*.json"):
        data = json.load(json_file.open(encoding="utf-8"))
        text = " ".join([
            data.get("benefit", ""),
            data.get("target", ""),
            data.get("trgterIndvdlArray", ""),
            data.get("lifeArray", ""),
            data.get("intrsThemaArray", ""),
        ])
        vec = embed_text(text)
        embeddings.append(vec)
        meta.append({
            "servId": data.get("servId", ""),
            "policy_name": data.get("policy_name", ""),
            "url": data.get("url", ""),
            "trgterIndvdlArray": data.get("trgterIndvdlArray", "")
        })
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    embs = np.stack(embeddings).astype("float32")
    np.save(EMBEDDINGS_FILE, embs)
    META_FILE.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(embeddings)} embeddings → {EMBEDDINGS_FILE}")
