import numpy as np
import faiss
from pathlib import Path

DATA_DIR = Path("data")
EMBEDDINGS_FILE = DATA_DIR / "policy_embeddings.npy"
INDEX_FILE = DATA_DIR / "policy_index.faiss"

if __name__ == '__main__':
    embs = np.load(EMBEDDINGS_FILE)
    dim = embs.shape[1]
    index = faiss.IndexFlatIP(dim)  # Cosine similarity (L2 정규화된 벡터)
    index.add(embs)
    faiss.write_index(index, str(INDEX_FILE))
    print(f"Built Faiss index ({embs.shape[0]} vectors) → {INDEX_FILE}")
