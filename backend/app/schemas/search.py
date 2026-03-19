from typing import List, Optional

from pydantic import BaseModel, Field


class SearchResultItem(BaseModel):
    resource_id: int
    title: str
    resource_type: Optional[str] = None
    origin_region: Optional[str] = None
    language: Optional[str] = None
    publication_date: Optional[str] = None
    abstract_text: Optional[str] = None
    source_url: Optional[str] = None
    matched_segment_id: Optional[int] = None
    matched_text_preview: Optional[str] = None
    relevance_score: float


class SearchResponse(BaseModel):
    query_id: Optional[int] = None
    summary: str
    total: int
    page: int = 1
    per_page: int = 5
    results: List[SearchResultItem] = Field(default_factory=list)