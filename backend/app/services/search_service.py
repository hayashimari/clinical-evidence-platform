from __future__ import annotations

from typing import Any

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models import User, Resource, ResourceSegment, SearchQuery, SearchQueryResult
from app.schemas.search import SearchRequest, SearchResponse, SearchResultItem

def search(db: Session, query: str, user_id: int):
    if not query or not query.strip():
        return {
            "query_id": None,
            "total": 0,
            "results": []
        }

def _safe_preview(text: str | None, max_len: int = 180) -> str | None:
    if not text:
        return None
    text = " ".join(text.split())
    if len(text) <= max_len:
        return text
    return text[:max_len] + "..."


def _build_summary(query: str, total: int, results: list[SearchResultItem]) -> str:
    if total == 0:
        return f"'{query}'와 관련된 자료를 찾지 못했습니다."
    top_types = []
    for r in results[:5]:
        if r.resource_type and r.resource_type not in top_types:
            top_types.append(r.resource_type)
    type_text = ", ".join(top_types) if top_types else "자료"
    return f"'{query}'에 대해 총 {total}건의 결과를 찾았습니다. 주요 자료 유형은 {type_text}입니다."


def search_clinical_evidence_service(db: Session, request: SearchRequest) -> SearchResponse:
    query = request.query.strip()
    if not query:
        raise ValueError("query must not be empty")

    like_query = f"%{query}%"
    normalized_query = query.lower()

    demo_user = db.execute(
        select(User).order_by(User.id.asc())
    ).scalar_one_or_none()

    if demo_user is None:
        raise ValueError("No demo user found in database")

    search_query = SearchQuery(
        user_id=demo_user.id,
        query_text=query,
    )
    db.add(search_query)
    db.flush()

    resource_stmt = select(Resource).where(
        or_(
            Resource.title.ilike(like_query),
            Resource.abstract.ilike(like_query),
        )
    )

    if request.filters.resource_types:
        resource_stmt = resource_stmt.where(Resource.resource_type.in_(request.filters.resource_types))

    resource_rows = db.execute(resource_stmt).scalars().all()

    segment_stmt = (
        select(ResourceSegment, Resource)
        .join(Resource, Resource.id == ResourceSegment.resource_id)
        .where(ResourceSegment.content.ilike(like_query))
    )

    if request.filters.resource_types:
        segment_stmt = segment_stmt.where(Resource.resource_type.in_(request.filters.resource_types))

    segment_rows = db.execute(segment_stmt).all()

    scored: dict[int, dict[str, Any]] = {}

    for resource in resource_rows:
        score = 0.0
        if resource.title and normalized_query in resource.title.lower():
            score += 5.0
        if resource.abstract and normalized_query in resource.abstract.lower():
            score += 2.0

        scored[resource.id] = {
            "resource": resource,
            "score": score,
            "matched_segment_id": None,
            "matched_text_preview": _safe_preview(resource.abstract),
        }

    for segment, resource in segment_rows:
        if resource.id not in scored:
            scored[resource.id] = {
                "resource": resource,
                "score": 0.0,
                "matched_segment_id": segment.id,
                "matched_text_preview": _safe_preview(segment.content),
            }

        scored[resource.id]["score"] += 3.0
        scored[resource.id]["matched_segment_id"] = segment.id
        scored[resource.id]["matched_text_preview"] = _safe_preview(segment.content)

    items = list(scored.values())

    if request.filters.sort == "latest":
        items.sort(
            key=lambda x: (
                x["resource"].created_at is not None,
                x["resource"].created_at,
            ),
            reverse=True,
        )
    else:
        items.sort(key=lambda x: x["score"], reverse=True)

    total = len(items)
    page = max(request.filters.page, 1)
    per_page = max(request.filters.per_page, 1)
    start = (page - 1) * per_page
    end = start + per_page
    paged_items = items[start:end]

    response_results: list[SearchResultItem] = []

    for idx, item in enumerate(paged_items, start=1):
        resource = item["resource"]

        result_row = SearchQueryResult(
            search_query_id=search_query.id,
            resource_id=resource.id,
            rank=start + idx,
            score=float(item["score"]),
            snippet=item["matched_text_preview"],
        )
        db.add(result_row)

        response_results.append(
            SearchResultItem(
                resource_id=resource.id,
                title=resource.title,
                resource_type=resource.resource_type,
                origin_region=None,
                language=None,
                publication_date=None,
                abstract_text=_safe_preview(resource.abstract),
                source_url=resource.source_url,
                matched_segment_id=item["matched_segment_id"],
                matched_text_preview=item["matched_text_preview"],
                relevance_score=float(item["score"]),
            )
        )

    db.commit()

    summary = _build_summary(query, total, response_results)

    return SearchResponse(
        query_id=search_query.id,
        summary=summary,
        total=total,
        page=page,
        per_page=per_page,
        results=response_results,
    )
