"use client";

import { useState } from "react";

type SearchFilters = {
  domestic_only: boolean;
  include_domestic_cases: boolean;
  cited_foreign_only: boolean;
  rare_disease_expand: boolean;
};

type SearchResult = {
  title: string;
  source_type: string;
  origin: string;
  published_at: string;
  url: string;
};

type SearchResponse = {
  summary: string;
  results: SearchResult[];
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<SearchFilters>({
    domestic_only: false,
    include_domestic_cases: true,
    cited_foreign_only: false,
    rare_disease_expand: false,
  });

  const handleFilterChange = (key: keyof SearchFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("임상 질문을 입력해주세요.");
      return;
    }

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
          query,
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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Clinical Evidence Platform
          </h1>
          <p className="mt-2 text-slate-600">
            한국 임상 환경에 맞춘 근거 탐색 및 연구 지원 플랫폼
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            임상 질문
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 식후에도 저혈당이 지속된 케이스가 있나?"
            className="min-h-[120px] w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-slate-500"
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.domestic_only}
                onChange={() => handleFilterChange("domestic_only")}
              />
              국내 근거만 보기
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.include_domestic_cases}
                onChange={() => handleFilterChange("include_domestic_cases")}
              />
              국내 증례 포함 보기
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.cited_foreign_only}
                onChange={() => handleFilterChange("cited_foreign_only")}
              />
              국내 논문에서 인용된 해외 논문만 보기
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.rare_disease_expand}
                onChange={() => handleFilterChange("rare_disease_expand")}
              />
              희귀질환 확장 검색 보기
            </label>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "검색 중..." : "검색하기"}
          </button>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>

        {data && (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">AI 요약</h2>
              <p className="mt-3 text-slate-700">{data.summary}</p>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">검색 결과</h2>
              <div className="mt-4 space-y-4">
                {data.results.length === 0 ? (
                  <p className="text-slate-500">검색 결과가 없습니다.</p>
                ) : (
                  data.results.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {item.source_type}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {item.origin}
                        </span>
                        <span className="text-sm text-slate-500">
                          {item.published_at}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-blue-600 underline"
                      >
                        원문 보기
                      </a>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
