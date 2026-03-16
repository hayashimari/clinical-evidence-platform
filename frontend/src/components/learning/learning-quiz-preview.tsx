import Link from "next/link";
import {
  Brain,
  Clock,
  GraduationCap,
  ListChecks,
  Play,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOPICS = [
  "Cardiology",
  "Endocrinology",
  "Neurology",
  "Infectious Disease",
];

export function LearningQuizPreview() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-white/15 bg-white/10 text-white">
              Learning preview
            </Badge>
            <Badge className="border-white/15 bg-sky-200/20 text-sky-50">
              Static for now
            </Badge>
          </div>
          <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
            Quiz and study workflows are staged for later wiring
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-50">
            Figma `LearningQuiz.tsx`의 탭 구조와 카드 레이아웃을 참고해 준비한
            페이지입니다. 실제 문제 생성과 채점 로직은 아직 연결하지 않았습니다.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Quiz modes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Standard",
                description: "Self-paced question flow",
                icon: ListChecks,
              },
              {
                title: "Timed",
                description: "Per-question countdown",
                icon: Clock,
              },
              {
                title: "Adaptive",
                description: "Difficulty adjusts to performance",
                icon: Brain,
              },
            ].map((mode) => {
              const Icon = mode.icon;

              return (
                <div
                  key={mode.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">{mode.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {mode.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prepared topic grid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TOPICS.map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-800">{topic}</span>
                <Badge variant="blue">Ready for API</Badge>
              </div>
            ))}

            <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-5">
              <p className="text-sm text-slate-600">
                Next wiring targets: generated question list, answer state, and
                quiz result summary.
              </p>
            </div>

            <Link
              href="/search"
              className={buttonStyles({ variant: "primary", size: "default" })}
            >
              <Play className="h-4 w-4" />
              Return to search
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">Why this stays mock for now</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Search is the only working backend flow today, so this route remains
              intentionally static until quiz generation contracts are defined.
            </p>
          </div>
          <Link
            href="/dashboard"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <GraduationCap className="h-4 w-4" />
            Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
