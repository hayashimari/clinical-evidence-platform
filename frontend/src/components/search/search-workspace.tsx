"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  LoaderCircle,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { SearchFilterPanel } from "./search-filter-panel";
import { SearchResultCard } from "./search-result-card";
import type { SearchFilters, SearchResponse } from "./types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

const DEFAULT_FILTERS: SearchFilters = {
  domestic_only: false,
  include_domestic_cases: true,
  cited_foreign_only: false,
  rare_disease_expand: false,
};

export function SearchWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    const queryFromUrl = searchParams.get("q") ?? "";
    setQuery((current) => (current === queryFromUrl ? current : queryFromUrl));
  }, [searchParams]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

  const handleFilterChange = (key: keyof SearchFilters) => {
    setFilters((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSearch = async () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setError("임상 질문을 입력해주세요.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", normalizedQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: normalizedQuery,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error("검색 요청에 실패했습니다.");
      }

      const result: SearchResponse = await response.json();
      setData(result);
    } catch (err) {
      setError("서버와 통신하는 중 문제가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white shadow-[0_28px_80px_-42px_rgba(37,99,235,0.65)]">
        <CardContent className="relative p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/15 text-white">
                Figma-inspired search
              </Badge>
              <Badge className="border-white/15 bg-teal-400/20 text-teal-50">
                Backend integration preserved
              </Badge>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Clinical evidence search, safely merged into the existing app
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base">
              검색 상태, 로딩, 에러 처리, FastAPI 요청 형태는 유지하고, Figma
              export의 레이아웃과 시각 구조만 Next.js App Router 환경에 맞춰
              옮겼습니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-50">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Stethoscope className="h-4 w-4" />
                Search-first migration
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Sparkles className="h-4 w-4" />
                Minimal safe component transplant
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SearchFilterPanel
          filters={filters}
          disabled={loading}
          onReset={handleResetFilters}
          onToggleFilter={handleFilterChange}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    Search request
                  </CardTitle>
                  <CardDescription className="mt-2">
                    기존 페이지의 검색 로직을 그대로 사용하면서 Figma 스타일로
                    재배치했습니다.
                  </CardDescription>
                </div>
                <Badge variant={activeFilterCount > 0 ? "blue" : "outline"}>
                  {activeFilterCount} filters
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                임상 질문
              </label>
              <Textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="예: 식후에도 저혈당이 지속된 케이스가 있나?"
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      검색 중...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      검색하기
                    </>
                  )}
                </Button>
                <p className="text-sm text-slate-500">
                  `POST /api/v1/search` 요청과 필터 payload는 변경하지 않았습니다.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {data && (
            <Card className="border-blue-100 bg-blue-50/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-700">{data.summary}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription className="mt-2">
                    {data
                      ? `${data.results.length}개의 결과를 현재 응답에서 표시 중입니다.`
                      : "검색을 실행하면 결과 카드가 이 영역에 표시됩니다."}
                  </CardDescription>
                </div>
                {data && (
                  <Badge variant="outline">{data.results.length} items</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 p-6"
                  >
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 w-28 rounded bg-slate-200" />
                      <div className="h-6 w-4/5 rounded bg-slate-200" />
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="h-4 w-full rounded bg-slate-100" />
                    </div>
                  </div>
                ))}

              {!loading && !data && (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                  <p className="text-base font-medium text-slate-700">
                    Search-ready interface
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Figma SearchResults의 카드 구조와 사이드 필터 레이아웃을
                    반영했고, 실제 데이터는 기존 백엔드 응답을 사용합니다.
                  </p>
                </div>
              )}

              {!loading &&
                data &&
                (data.results.length > 0 ? (
                  data.results.map((item, index) => (
                    <SearchResultCard
                      key={`${item.title}-${index}`}
                      result={item}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                    <p className="text-base font-medium text-slate-700">
                      검색 결과가 없습니다.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      검색어를 조금 더 넓게 바꾸거나 필터를 재설정해 보세요.
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
