"use client";

import { RefreshCcw, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import type { SearchFilters } from "./types";

const FILTER_CONFIG: Array<{
  key: keyof SearchFilters;
  label: string;
  description: string;
}> = [
  {
    key: "domestic_only",
    label: "국내 근거만 보기",
    description: "국내 임상 환경과 직접 연결되는 자료를 우선 확인합니다.",
  },
  {
    key: "include_domestic_cases",
    label: "국내 증례 포함 보기",
    description: "국내 증례와 case report를 함께 포함해 검색 폭을 유지합니다.",
  },
  {
    key: "cited_foreign_only",
    label: "국내 논문에서 인용된 해외 논문만 보기",
    description: "국내 맥락에서 이미 검토된 해외 근거로 범위를 좁힙니다.",
  },
  {
    key: "rare_disease_expand",
    label: "희귀질환 확장 검색 보기",
    description: "동의어, 관련 질환, 드문 키워드까지 확장해 후보를 넓힙니다.",
  },
];

type SearchFilterPanelProps = {
  filters: SearchFilters;
  disabled?: boolean;
  onReset: () => void;
  onToggleFilter: (key: keyof SearchFilters) => void;
};

export function SearchFilterPanel({
  filters,
  disabled,
  onReset,
  onToggleFilter,
}: SearchFilterPanelProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="sticky top-6 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              Search filters
            </CardTitle>
            <CardDescription className="mt-2">
              기존 FastAPI 검색 요청에 전달되는 실제 필터만 노출합니다.
            </CardDescription>
          </div>
          <Badge variant={activeCount > 0 ? "blue" : "outline"}>
            {activeCount} active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {FILTER_CONFIG.map((filter, index) => (
          <div key={filter.key}>
            {index > 0 && <Separator className="mb-4" />}
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={filters[filter.key]}
                onChange={() => onToggleFilter(filter.key)}
                disabled={disabled}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium text-slate-800">
                  {filter.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  {filter.description}
                </span>
              </span>
            </label>
          </div>
        ))}

        <Separator />

        <div className="rounded-2xl bg-blue-50/80 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Safe merge note
              </p>
              <p className="mt-1 text-sm leading-6 text-blue-700">
                이 패널은 기존 필터 동작만 유지합니다. Figma mock filter는
                아직 API와 연결하지 않았습니다.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={onReset}
          disabled={disabled}
        >
          <RefreshCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
