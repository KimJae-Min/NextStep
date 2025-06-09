import json
from pathlib import Path

STRUCTURED_DIR = Path("structured_policies/central")
TARGET_TAGS = [
    "청년", "중장년", "노년", "장애인", "임산부", "프리랜서", "플랫폼 노동자",
    "저소득층", "노인", "여성", "가정", "아동", "독거", "비정규직", "1인가구"
]

def extract_targets(text):
    tags = []
    for tag in TARGET_TAGS:
        if tag in text:
            tags.append(tag)
    return ",".join(tags)

for json_file in STRUCTURED_DIR.glob("*.json"):
    data = json.load(json_file.open(encoding="utf-8"))
    benefit_target_text = (data.get("benefit", "") + " " + data.get("target", ""))
    if not data.get("trgterIndvdlArray"):
        data["trgterIndvdlArray"] = extract_targets(benefit_target_text)
    json_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
