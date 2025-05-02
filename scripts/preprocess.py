import os
import json
from pathlib import Path
import fitz  # PyMuPDF
from bs4 import BeautifulSoup
from keybert import KeyBERT

# Adjust these paths as needed
RAW_DIR = Path("raw_policies")
PARSED_DIR = Path("parsed_policies")
STRUCTURED_DIR = Path("structured_policies")

# Ensure output directories exist
PARSED_DIR.mkdir(parents=True, exist_ok=True)
STRUCTURED_DIR.mkdir(parents=True, exist_ok=True)

# Initialize keyword model
kw_model = KeyBERT()

def extract_text_from_pdf(pdf_path: Path) -> str:
    doc = fitz.open(str(pdf_path))
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_text_from_html(html_path: Path) -> str:
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    # Adjust selector to your source structure
    content = soup.get_text(separator="\n")
    return content

def clean_and_split(text: str) -> list[str]:
    # Basic cleaning
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    # Split into paragraphs (simple)
    paragraphs = "\n".join(lines).split("\n\n")
    return paragraphs

def extract_keywords(text: str, top_n: int = 5) -> list[str]:
    keywords = kw_model.extract_keywords(text, top_n=top_n)
    return [kw for kw, score in keywords]

def process_document(input_path: Path, collector: str):
    # Extract raw text
    if input_path.suffix.lower() == ".pdf":
        raw_text = extract_text_from_pdf(input_path)
    elif input_path.suffix.lower() in {".html", ".htm"}:
        raw_text = extract_text_from_html(input_path)
    else:
        return

    # Save parsed text
    parsed_folder = PARSED_DIR / collector
    parsed_folder.mkdir(parents=True, exist_ok=True)
    parsed_path = parsed_folder / (input_path.stem + ".txt")
    parsed_path.write_text(raw_text, encoding="utf-8")

    # Clean and split
    paragraphs = clean_and_split(raw_text)

    # Extract fields (naive approach: first lines as title, keywords from full text)
    policy_name = paragraphs[0] if paragraphs else input_path.stem
    keywords = extract_keywords(raw_text)

    # Dummy parsing for other fields (to be manually refined)
    target = ""
    deadline = ""
    benefit = ""
    # Lookup paragraphs for keywords
    for para in paragraphs[:5]:
        if "만" in para and "세" in para:
            target = para
        if "원" in para and "개월" in para:
            benefit = para
        if "마감" in para or "기한" in para:
            deadline = para

    # Build JSON structure
    structured = {
        "policy_name": policy_name,
        "target": target,
        "deadline": deadline,
        "benefit": benefit,
        "keywords": keywords,
        "source": input_path.parent.name,
        "file_format": input_path.suffix.replace(".", "").upper()
    }

    # Save structured JSON
    struct_folder = STRUCTURED_DIR / collector
    struct_folder.mkdir(parents=True, exist_ok=True)
    json_path = struct_folder / (input_path.stem + ".json")
    json_path.write_text(json.dumps(structured, ensure_ascii=False, indent=2), encoding="utf-8")

# Main bulk processing
if __name__ == "__main__":
    # Expect subfolders per collector
    for collector_dir in RAW_DIR.iterdir():
        if collector_dir.is_dir():
            for doc in collector_dir.iterdir():
                process_document(doc, collector_dir.name)

print("Bulk preprocessing complete. Parsed texts and structured JSON files are available.")
