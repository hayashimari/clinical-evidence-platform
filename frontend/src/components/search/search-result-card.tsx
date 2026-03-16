import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  ExternalLink,
  FileText,
  Globe2,
  type LucideIcon,
  MapPinned,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { SearchResult } from "./types";

const SOURCE_TYPE_META: Record<
  string,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"]; icon: LucideIcon }
> = {
  case_report: { label: "Case report", variant: "amber", icon: Stethoscope },
  guideline: { label: "Guideline", variant: "teal", icon: ClipboardList },
  textbook: { label: "Textbook", variant: "blue", icon: BookOpen },
  paper: { label: "Research paper", variant: "violet", icon: FileText },
};

function humanizeSourceType(sourceType: string) {
  return sourceType.replace(/_/g, " ");
}

function getSourceMeta(sourceType: string) {
  return (
    SOURCE_TYPE_META[sourceType] ?? {
      label: humanizeSourceType(sourceType),
      variant: "slate" as const,
      icon: FileText,
    }
  );
}

function getOriginLabel(origin: string) {
  if (origin === "domestic") {
    return { label: "Domestic", variant: "blue" as const, icon: MapPinned };
  }

  if (origin === "foreign") {
    return { label: "Foreign", variant: "outline" as const, icon: Globe2 };
  }

  return { label: origin, variant: "outline" as const, icon: Globe2 };
}

function buildResourcePath(title: string) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/resource/${encodeURIComponent(slug || "resource")}`;
}

export function SearchResultCard({ result }: { result: SearchResult }) {
  const sourceMeta = getSourceMeta(result.source_type);
  const originMeta = getOriginLabel(result.origin);
  const SourceIcon = sourceMeta.icon;
  const OriginIcon = originMeta.icon;

  return (
    <Card className="transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <SourceIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={sourceMeta.variant}>{sourceMeta.label}</Badge>
              <Badge variant={originMeta.variant}>
                <OriginIcon className="h-3 w-3" />
                {originMeta.label}
              </Badge>
            </div>

            <Link
              href={buildResourcePath(result.title)}
              className="mt-4 block text-xl font-semibold leading-8 text-slate-900 transition hover:text-blue-700"
            >
              {result.title}
            </Link>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              기존 백엔드 응답 스키마를 그대로 사용하고 있어, 현재는 제목과
              출처 메타데이터 중심으로 표시합니다.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {result.published_at}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-400" />
                {humanizeSourceType(result.source_type)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={buildResourcePath(result.title)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Detail preview
              </Link>
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Original source
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
