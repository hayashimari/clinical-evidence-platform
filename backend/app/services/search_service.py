from sqlalchemy.orm import Session

from app.models.resource import Resource, ResourceSegment
from app.models.search_query import SearchQuery, SearchQueryResult
from app.schemas.search import SearchResponse, SearchResultItem


def calculate_score(query: str, text: str) -> float:
    query_terms = query.lower().split()
    text_lower = text.lower()

    score = 0.0
    for term in query_terms:
        if term in text_lower:
            score += 1.0
    return score


def make_snippet(text: str, query: str) -> str:
    if not text:
        return ""

    text_lower = text.lower()
    query_terms = query.lower().split()

    for term in query_terms:
        idx = text_lower.find(term)
        if idx != -1:
            start = max(0, idx - 50)
            end = idx + 50
            return text[start:end]

    return text[:100]


def build_summary(query: str, total: int) -> str:
    if total == 0:
        return f"'{query}'와 관련된 자료를 찾지 못했습니다."
    return f"'{query}'에 대해 총 {total}건의 결과를 찾았습니다."


def search(db: Session, query: str, user_id: int) -> SearchResponse:
    normalized_query = query.strip()
    if not normalized_query:
        return SearchResponse(
            query_id=0,
            summary="검색어가 비어 있습니다.",
            total=0,
            page=1,
            per_page=5,
            results=[],
        )

    search_query = SearchQuery(
        user_id=user_id,
        query_text=normalized_query,
    )
    db.add(search_query)
    db.flush()

    resources = db.query(Resource).all()
    results: list[dict] = []

    for resource in resources:
        base_score = (
            calculate_score(normalized_query, resource.title or "")
            + calculate_score(normalized_query, resource.abstract or "")
        )
        best_score = base_score
        best_snippet = make_snippet(resource.abstract or resource.title or "", normalized_query)
        matched_segment_id = None

        segments = db.query(ResourceSegment).filter(
            ResourceSegment.resource_id == resource.id
        ).all()

        for segment in segments:
            score = base_score + calculate_score(normalized_query, segment.content or "")
            if score > best_score:
                best_score = score
                best_snippet = make_snippet(segment.content or "", normalized_query)
                matched_segment_id = segment.id

        if best_score > 0:
            results.append(
                {
                    "resource": resource,
                    "score": best_score,
                    "snippet": best_snippet,
                    "matched_segment_id": matched_segment_id,
                }
            )

    results.sort(key=lambda item: item["score"], reverse=True)
    results = results[:5]

    for rank, result in enumerate(results, start=1):
        db.add(
            SearchQueryResult(
                search_query_id=search_query.id,
                resource_id=result["resource"].id,
                rank=rank,
                score=result["score"],
                snippet=result["snippet"],
            )
        )

    db.commit()

    response_results = [
        SearchResultItem(
            resource_id=result["resource"].id,
            title=result["resource"].title,
            resource_type=result["resource"].resource_type,
            abstract_text=result["resource"].abstract,
            source_url=result["resource"].source_url,
            matched_segment_id=result["matched_segment_id"],
            matched_text_preview=result["snippet"],
            relevance_score=float(result["score"]),
        )
        for result in results
    ]

    return SearchResponse(
        query_id=search_query.id,
        summary=build_summary(normalized_query, len(response_results)),
        total=len(response_results),
        page=1,
        per_page=5,
        results=response_results,
    )
