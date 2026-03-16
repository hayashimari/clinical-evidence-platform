import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Link2,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function titleFromId(resourceId: string) {
  const decoded = decodeURIComponent(resourceId);
  return decoded
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ResourceDetailPreview({
  resourceId,
}: {
  resourceId: string;
}) {
  const title = titleFromId(resourceId) || "Resource Detail";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="teal">Resource detail preview</Badge>
              <Badge variant="outline">Static until API wiring is ready</Badge>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              이 페이지는 Figma `ResourceDetail.tsx` 구조를 참고한 준비용
              레이아웃입니다. 실제 세부 데이터 API가 생기면 현재 컴포넌트 구조에
              맞춰 안전하게 연결할 수 있습니다.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                <ClipboardList className="h-4 w-4 text-teal-600" />
                Guideline-style layout
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Title derived from route slug
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Next safe step</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Introduce a dedicated resource schema from the backend, then swap the
              mock summary, metadata, and section blocks below to real data fields.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/learning"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                <GraduationCap className="h-4 w-4" />
                Learning preview
              </Link>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                External source
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI clinical summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              This placeholder section mirrors the Figma detail page structure and
              is ready to receive summary text once a resource detail endpoint
              exists.
            </p>
            <p>
              Recommended future payload: title, abstract or summary, metadata,
              related resources, citation links, and source URL.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata block</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Type</p>
              <p className="mt-1">Mock guideline detail card</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Suggested fields</p>
              <p className="mt-1">authors, journal, published_at, source_type, url</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium text-slate-900">Routing</p>
              <p className="mt-1 inline-flex items-center gap-2">
                <Link2 className="h-4 w-4 text-slate-400" />
                `/resource/[id]`
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
