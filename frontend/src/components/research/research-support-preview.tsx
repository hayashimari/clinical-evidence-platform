import Link from "next/link";
import {
  BarChart3,
  Database,
  FlaskConical,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ANALYSIS_BLOCKS = [
  {
    title: "Literature Review",
    description: "Summarize the evidence landscape across included papers.",
    icon: Search,
  },
  {
    title: "PICO structuring",
    description: "Prepare population, intervention, comparison, and outcome inputs.",
    icon: Layers,
  },
  {
    title: "Data extraction",
    description: "Reserve space for structured outcome tables and metadata.",
    icon: Database,
  },
  {
    title: "Charts",
    description: "Placeholder cards for synthesis visuals once data is real.",
    icon: BarChart3,
  },
];

export function ResearchSupportPreview() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 text-white">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-white/15 bg-white/10 text-white">
              Research support preview
            </Badge>
            <Badge className="border-white/15 bg-cyan-200/20 text-cyan-50">
              Mock analysis shell
            </Badge>
          </div>
          <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
            Research tooling layout is prepared without risky backend assumptions
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-50">
            Figma `ResearchSupport.tsx`의 좌측 설정 패널과 결과 영역 구조를
            간결하게 이식했습니다. 실제 분석 파이프라인이 준비되면 이 페이지를
            그대로 확장할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Prepared analysis form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Research question
            </label>
            <Textarea
              defaultValue="SGLT2 inhibitors in heart failure outcomes"
              className="min-h-28"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input defaultValue="Adults with heart failure" />
              <Input defaultValue="SGLT2 inhibitors" />
              <Input defaultValue="Standard care" />
              <Input defaultValue="Mortality and hospitalization" />
            </div>

            <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-5 text-sm leading-6 text-slate-500">
              This form is intentionally not wired yet. It exists so we can attach
              real analysis endpoints later without redesigning the page.
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            {ANALYSIS_BLOCKS.map((block) => {
              const Icon = block.icon;

              return (
                <Card key={block.title}>
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-slate-900">
                      {block.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {block.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Safe next step
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <p className="min-w-0 flex-1 text-sm leading-6 text-slate-600">
                Define the first research API contract before wiring tabs, chart
                data, or included-paper lists. That keeps the merge incremental and
                easy to review.
              </p>
              <Link
                href="/search"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                <FlaskConical className="h-4 w-4" />
                Search workspace
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
