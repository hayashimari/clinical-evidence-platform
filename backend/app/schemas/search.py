from pydantic import BaseModel
from typing import List


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