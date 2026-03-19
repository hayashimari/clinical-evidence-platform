from sqlalchemy.orm import Session

from app.models.resource import Resource, ResourceSegment
from app.models.search_query import SearchQuery, SearchQueryResult


PER_PAGE = 5


def calculate_score(query: str, text: str) -> float:
    if not text:
        return 0.0

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
            end = min(len(text), idx + len(term) + 50)
            return text[start:end]

    return text[:100]


def search(db: Session, query: str, user_id: int):
    normalized_query = " ".join((query or "").strip().lower().split())

    if not normalized_query:
        return {
            "query_id": None,
            "summary": "검색어가 비어 있습니다.",
            "total": 0,
            "page": 1,
            "per_page": PER_PAGE,
            "results": [],
        }

    search_query = SearchQuery(
        user_id=user_id,
        query_text=normalized_query,
    )
    db.add(search_query)
    db.commit()
    db.refresh(search_query)

    resources = db.query(Resource).all()

    results = []
    seen_resource_ids = set()

    for resource in resources:
        segments = (
            db.query(ResourceSegment)
            .filter(ResourceSegment.resource_id == resource.id)
            .all()
        )

        best_score = 0.0
        best_snippet = ""
        best_segment_id = None

        if not segments:
            fallback_score = (
                calculate_score(normalized_query, resource.title or "") * 3
                + calculate_score(normalized_query, resource.abstract or "") * 2
            )
            if fallback_score > 0:
                best_score = fallback_score
                best_snippet = make_snippet(resource.abstract or "", normalized_query)

        for segment in segments:
            score = (
                calculate_score(normalized_query, resource.title or "") * 3
                + calculate_score(normalized_query, resource.abstract or "") * 2
                + calculate_score(normalized_query, segment.content or "")
            )

            if score > best_score:
                best_score = score
                best_snippet = make_snippet(
                    segment.content or resource.abstract or "",
                    normalized_query,
                )
                best_segment_id = segment.id

        if best_score > 0 and resource.id not in seen_resource_ids:
            seen_resource_ids.add(resource.id)
            results.append(
                {
                    "resource": resource,
                    "score": best_score,
                    "snippet": best_snippet,
                    "matched_segment_id": best_segment_id,
                }
            )

    results.sort(key=lambda x: x["score"], reverse=True)
    results = results[:PER_PAGE]

    for rank, item in enumerate(results, start=1):
        db.add(
            SearchQueryResult(
                search_query_id=search_query.id,
                resource_id=item["resource"].id,
                rank=rank,
                score=item["score"],
                snippet=item["snippet"],
            )
        )

    db.commit()

    total = len(results)
    summary = f"'{normalized_query}'에 대해 총 {total}건의 결과를 찾았습니다."

    return {
        "query_id": search_query.id,
        "summary": summary,
        "total": total,
        "page": 1,
        "per_page": PER_PAGE,
        "results": [
            {
                "resource_id": item["resource"].id,
                "title": item["resource"].title,
                "resource_type": item["resource"].resource_type,
                "origin_region": None,
                "language": None,
                "publication_date": None,
                "abstract_text": item["resource"].abstract,
                "source_url": item["resource"].source_url,
                "matched_segment_id": item["matched_segment_id"],
                "matched_text_preview": item["snippet"],
                "relevance_score": item["score"],
            }
            for item in results
        ],
    }