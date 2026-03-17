from app.data.mock_search_results import MOCK_SEARCH_RESULTS
from app.schemas.search import SearchRequest, SearchResponse, SearchResult


def search_clinical_evidence_service(request: SearchRequest) -> SearchResponse:
    filtered_results = []

    for item in MOCK_SEARCH_RESULTS:
        if request.filters.domestic_only and item["origin"] != "domestic":
            continue

        if request.filters.cited_foreign_only and item["origin"] != "foreign":
            continue

        if not request.filters.rare_disease_expand and item["origin"] == "foreign":
            continue

        filtered_results.append(SearchResult(**item))

    return SearchResponse(
        summary=f"'{request.query}'에 대한 예시 검색 결과입니다.",
        results=filtered_results,
    )