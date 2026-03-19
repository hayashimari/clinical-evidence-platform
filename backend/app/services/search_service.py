from sqlalchemy.orm import Session
from app.models.resource import Resource, ResourceSegment
from app.models.search_query import SearchQuery, SearchQueryResult

def search(db: Session, query: str, user_id: int):
    if not query or not query.strip():
        return {
            "query_id": None,
            "total": 0,
            "results": []
        }

def calculate_score(query: str, text: str) -> float:
    query_terms = query.lower().split()
    text_lower = text.lower()

    score = 0.0
    for term in query_terms:
        if term in text_lower:
            score += 1.0
    return score


def make_snippet(text: str, query: str) -> str:
    text_lower = text.lower()
    query_terms = query.lower().split()

    for term in query_terms:
        idx = text_lower.find(term)
        if idx != -1:
            start = max(0, idx - 50)
            end = idx + 50
            return text[start:end]

    return text[:100]


def search(db: Session, query: str, user_id: int):
    # 1. 검색 기록 저장
    search_query = SearchQuery(
        user_id=user_id,
        query_text=query
    )
    db.add(search_query)
    db.commit()
    db.refresh(search_query)

    # 2. resource 조회
    resources = db.query(Resource).all()

    results = []
    seen_resource_ids = set()

    for resource in resources:
        segments = db.query(ResourceSegment).filter(
            ResourceSegment.resource_id == resource.id
        ).all()

        best_score = 0.0
        best_snippet = ""

        for segment in segments:
            score = (
                calculate_score(query, resource.title or "") +
                calculate_score(query, resource.abstract or "") +
                calculate_score(query, segment.content or "")
            )

            if score > best_score:
                best_score = score
                best_snippet = make_snippet(segment.content or "", query)

        if best_score > 0 and resource.id not in seen_resource_ids:
            seen_resource_ids.add(resource.id)
            results.append({
                "resource": resource,
                "score": best_score,
                "snippet": best_snippet
             })

    # 3. 정렬
    results.sort(key=lambda x: x["score"], reverse=True)
    results = results[:5]

    # 4. DB 저장
    for rank, r in enumerate(results, start=1):
        result_row = SearchQueryResult(
            search_query_id=search_query.id,
            resource_id=r["resource"].id,
            rank=rank,
            score=r["score"],
            snippet=r["snippet"]
        )
        db.add(result_row)

    db.commit()

    # 5. response
    return {
        "query_id": search_query.id,
        "total": len(results),
        "results": [
            {
                "resource_id": r["resource"].id,
                "title": r["resource"].title,
                "abstract": r["resource"].abstract,
                "score": r["score"],
                "snippet": r["snippet"]
            }
            for r in results
        ]
    }