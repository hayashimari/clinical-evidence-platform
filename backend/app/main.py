from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


app = FastAPI(
    title="Clinical Evidence Platform API",
    version="0.1.0"
)


class SearchFilters(BaseModel):
    domestic_only: bool = False
    include_domestic_cases: bool = True
    cited_foreign_only: bool = False
    rare_disease_expand: bool = False


class SearchRequest(BaseModel):
    query: str
    filters: SearchFilters


class SearchResult(BaseModel):
    title: str
    source_type: str
    origin: str
    published_at: str
    url: str


class SearchResponse(BaseModel):
    summary: str
    results: List[SearchResult]


@app.get("/")
def read_root():
    return {"message": "Clinical Evidence Platform API"}


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/v1/filters")
def get_filters():
    return {
        "filters": {
            "domestic_only": "국내 근거만 보기",
            "include_domestic_cases": "국내 증례 포함 보기",
            "cited_foreign_only": "국내 논문에서 인용된 해외 논문만 보기",
            "rare_disease_expand": "희귀질환 확장 검색 보기"
        }
    }


@app.post("/api/v1/search", response_model=SearchResponse)
def search_clinical_evidence(request: SearchRequest):
    return SearchResponse(
        summary=f"'{request.query}'에 대한 예시 검색 결과입니다.",
        results=[
            SearchResult(
                title="식후 저혈당 관련 국내 증례 예시",
                source_type="case_report",
                origin="domestic",
                published_at="2024-01-01",
                url="https://example.com/case-report"
            ),
            SearchResult(
                title="저혈당 진료 관련 가이드라인 예시",
                source_type="guideline",
                origin="domestic",
                published_at="2023-06-01",
                url="https://example.com/guideline"
            )
        ]
    )