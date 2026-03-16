export type SearchFilters = {
  domestic_only: boolean;
  include_domestic_cases: boolean;
  cited_foreign_only: boolean;
  rare_disease_expand: boolean;
};

export type SearchResult = {
  title: string;
  source_type: string;
  origin: string;
  published_at: string;
  url: string;
};

export type SearchResponse = {
  summary: string;
  results: SearchResult[];
};
