# scripts/fetch_policies.py

import os
import requests
import xml.etree.ElementTree as ET
import json
from pathlib import Path
from urllib.parse import urlencode, quote_plus
from dotenv import load_dotenv

load_dotenv()
SERVICE_KEY = os.getenv("BOKJIRO_API_KEY")
if not SERVICE_KEY:
    raise RuntimeError("`.env`에 BOKJIRO_API_KEY가 설정되어 있지 않습니다.")

# HTTPS 사용
BASE_URL = "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001"

# “원본 키”를 그대로 params에 넣어두면, urlencode가 자동 인코딩해 줍니다.
DEFAULT_PARAMS = {
    "serviceKey": SERVICE_KEY,  # 원본(디코딩된) 키
    "callTp":     "L",
    "pageNo":     1,
    "numOfRows":  500,
    "srchKeyCode":"001",        # “제목” 검색 코드 (필요 시 변경)
}

RAW_DIR = Path("raw_policies/central")
RAW_DIR.mkdir(parents=True, exist_ok=True)


def fetch_welfare_list(page: int = 1, per_page: int = 500) -> dict:
    params = DEFAULT_PARAMS.copy()
    params["pageNo"] = page
    params["numOfRows"] = per_page

    # urlencode가 serviceKey를 포함한 모든 값을 적절히 인코딩해 줍니다.
    url = f"{BASE_URL}?{urlencode(params, quote_via=quote_plus)}"
    resp = requests.get(url)
    resp.raise_for_status()

    xml_root = ET.fromstring(resp.content)
    result = {
        "totalCount": xml_root.findtext("totalCount"),
        "pageNo":     xml_root.findtext("pageNo"),
        "numOfRows":  xml_root.findtext("numOfRows"),
        "resultCode": xml_root.findtext("resultCode"),
        "resultMessage": xml_root.findtext("resultMessage"),
        "servList":   []
    }

    for serv in xml_root.findall("servList"):
        item = {}
        for child in serv:
            item[child.tag] = child.text or ""
        result["servList"].append(item)

    return result


def main():
    first = fetch_welfare_list(page=1, per_page=10)
    total_count = int(first["totalCount"] or 0)
    if total_count == 0:
        print("조회된 서비스가 없습니다:", first.get("resultMessage"))
        return

    per_page = 500
    total_pages = (total_count + per_page - 1) // per_page

    for page in range(1, total_pages + 1):
        data = fetch_welfare_list(page=page, per_page=per_page)
        filename = RAW_DIR / f"welfare_list_page_{page}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved page {page}/{total_pages} → {filename}")

    print("전체 정책 목록 조회 및 저장 완료.")


if __name__ == "__main__":
    main()
