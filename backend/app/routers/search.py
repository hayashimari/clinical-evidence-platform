from fastapi import APIRouter

from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_clinical_evidence_service

router = APIRouter(prefix="/api/v1", tags=["search"])


@router.get("/filters")
def get_filters():
    return {
        "filters": {
            "domestic_only": "국내 근거만 보기",
            "include_domestic_cases": "국내 증례 포함 보기",
            "cited_foreign_only": "국내 논문에서 인용된 해외 논문만 보기",
            "rare_disease_expand": "희귀질환 확장 검색 보기",
        }
    }


@router.post("/search", response_model=SearchResponse)
def search_clinical_evidence(request: SearchRequest):
    return search_clinical_evidence_service(request)