# query_expansion.py
from typing import List

QUERY_EXPANSION_DICT = {
    "배달": ["플랫폼 노동자", "비정규직", "저소득층"],
    "알바": ["비정규직", "청년"],
    "프리랜서": ["비정규직", "플랫폼 노동자"],
    "임산부": ["임산부", "여성"],
    "청년": ["청년"],
    "중장년": ["중장년"],
    "노인": ["노년", "노인"],
    "장애": ["장애인"],
    "독거": ["1인가구", "저소득층"],
    # 필요한 만큼 추가 확장
}

def query_expand(user_text: str) -> List[str]:
    user_text = user_text.lower()
    tags = set()
    for k, v in QUERY_EXPANSION_DICT.items():
        if k in user_text:
            tags.update(v)
    return list(tags)
