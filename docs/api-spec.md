# API Spec

## 1. 목적

본 문서는 MVP 기준 백엔드 API 초안을 정의한다.

## 2. 공통 원칙

- 모든 응답은 JSON 형식으로 반환한다.
- 검색 결과는 자료 유형과 출처 정보를 포함해야 한다.
- 국내/해외 자료 구분 값을 포함해야 한다.

## 3. API 목록

### 3.1 임상 질문 검색

- Method: `POST`
- Endpoint: `/api/v1/search`
- Description: 사용자의 임상 질문을 기반으로 논문, 증례, 가이드라인 검색 결과를 반환한다.

#### Request Body

```json
{
  "query": "식후에도 저혈당이 지속된 케이스가 있나?",
  "filters": {
    "domestic_only": false,
    "include_domestic_cases": true,
    "cited_foreign_only": false,
    "rare_disease_expand": false
  }
}

{
  "summary": "검색 결과 요약",
  "results": [
    {
      "title": "자료 제목",
      "source_type": "paper",
      "origin": "domestic",
      "published_at": "2024-01-01",
      "url": "https://example.com"
    }
  ]
}