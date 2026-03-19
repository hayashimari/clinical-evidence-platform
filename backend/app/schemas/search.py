from typing import Optional

from pydantic import BaseModel, Field


class SearchFilters(BaseModel):
    resource_types: list[str] = Field(default_factory=list)
    specialty_id: Optional[int] = None
    origin_region: Optional[str] = None
    language: Optional[str] = None
    sort: str = "relevance"
    page: int = 1
    per_page: int = 10


class SearchRequest(BaseModel):
    query: str
    filters: SearchFilters = Field(default_factory=SearchFilters)


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


SearchResult = SearchResultItem


class SearchResponse(BaseModel):
    query_id: int
    summary: str
    total: int
    page: int
    per_page: int
    results: list[SearchResultItem]
