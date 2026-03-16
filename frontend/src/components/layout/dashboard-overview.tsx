import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  FlaskConical,
  GraduationCap,
  Search,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const RESOURCE_CARDS = [
  {
    title: "Guidelines",
    count: "3,120",
    description: "Clinical guidance and consensus updates",
    icon: ClipboardList,
    href: "/search",
    tone: "teal" as const,
  },
  {
    title: "Research Papers",
    count: "184K+",
    description: "Primary studies and literature reviews",
    icon: FileText,
    href: "/search",
    tone: "violet" as const,
  },
  {
    title: "Case Reports",
    count: "47K+",
    description: "Real-world clinical presentation references",
    icon: Stethoscope,
    href: "/search",
    tone: "amber" as const,
  },
  {
    title: "Textbooks",
    count: "2,840",
    description: "Core reference chapters and summaries",
    icon: BookOpen,
    href: "/search",
    tone: "blue" as const,
  },
];

const RECENT_SEARCHES = [
  "식후 저혈당 관련 국내 증례",
  "2024 심부전 가이드라인",
  "희귀질환 확장 검색 예시",
];

export function DashboardOverview() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-900 via-blue-900 to-teal-700 text-white">
        <CardContent className="relative p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-white/15 bg-white/10 text-white">
                Figma dashboard reference
              </Badge>
              <Badge className="border-white/15 bg-teal-400/20 text-teal-50">
                Static preview route
              </Badge>
            </div>
            <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
              Dashboard UI is prepared without replacing your working search page
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
              이 화면은 Figma Dashboard 레이아웃을 참고한 준비 단계입니다.
              실제 동작은 검색 페이지와 API 연결을 우선으로 유지했습니다.
            </p>

            <form action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                name="q"
                placeholder="질문을 입력하고 Search로 이동"
                className="h-12 rounded-2xl border-white/10 bg-white/95"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 text-sm font-medium text-white transition hover:bg-teal-400"
              >
                <Search className="h-4 w-4" />
                Open search
              </button>
            </form>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {RESOURCE_CARDS.map((resource) => {
          const Icon = resource.icon;

          return (
            <Link key={resource.title} href={resource.href}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant={resource.tone}>{resource.count}</Badge>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-900">
                    {resource.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link
              href="/learning"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Learning & Quiz</p>
                  <p className="text-sm text-slate-500">
                    Static UI prepared from the Figma reference
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/research"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Research Support</p>
                  <p className="text-sm text-slate-500">
                    Analysis workflow shell is ready for API wiring
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent search ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_SEARCHES.map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                <span>{item}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
            <Link
              href="/search"
              className={buttonStyles({ variant: "outline", size: "default" })}
            >
              Open search workspace
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
