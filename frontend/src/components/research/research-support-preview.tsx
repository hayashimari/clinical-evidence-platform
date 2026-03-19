"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BarChart2,
  BookOpen,
  Brain,
  Check,
  CheckCircle,
  Database,
  Download,
  ExternalLink,
  Filter,
  FlaskConical,
  Layers,
  Network,
  Plus,
  RefreshCcw,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ANALYSIS_TYPES = [
  {
    id: "literature",
    label: "Literature Review",
    icon: BookOpen,
    desc: "Summarize evidence across studies",
  },
  {
    id: "meta",
    label: "Meta-Analysis Support",
    icon: BarChart2,
    desc: "Forest plots & heterogeneity",
  },
  {
    id: "pico",
    label: "PICO Analysis",
    icon: Layers,
    desc: "Structure clinical questions",
  },
  {
    id: "network",
    label: "Evidence Network",
    icon: Network,
    desc: "Compare interventions indirectly",
  },
  {
    id: "bias",
    label: "Bias Assessment",
    icon: CheckCircle,
    desc: "Risk of bias evaluation",
  },
  {
    id: "data",
    label: "Data Extraction",
    icon: Database,
    desc: "Extract outcomes from papers",
  },
];

const PUBLICATION_TREND = [
  { year: "2018", count: 142 },
  { year: "2019", count: 189 },
  { year: "2020", count: 267 },
  { year: "2021", count: 412 },
  { year: "2022", count: 538 },
  { year: "2023", count: 621 },
  { year: "2024", count: 584 },
];

const EVIDENCE_DIST = [
  { name: "RCT", value: 28, color: "#2563EB" },
  { name: "Cohort", value: 34, color: "#0D9488" },
  { name: "Case-Control", value: 18, color: "#7C3AED" },
  { name: "RCT Meta-analysis", value: 12, color: "#F59E0B" },
  { name: "Expert Opinion", value: 8, color: "#94A3B8" },
];

const OUTCOME_DATA = [
  {
    outcome: "All-cause mortality",
    treatment: -18,
    control: 0,
    rr: 0.82,
    ci: "0.74-0.91",
    p: "<0.001",
    studies: 8,
  },
  {
    outcome: "CV death",
    treatment: -22,
    control: 0,
    rr: 0.78,
    ci: "0.69-0.88",
    p: "<0.001",
    studies: 6,
  },
  {
    outcome: "HF hospitalization",
    treatment: -31,
    control: 0,
    rr: 0.69,
    ci: "0.61-0.78",
    p: "<0.001",
    studies: 10,
  },
  {
    outcome: "eGFR decline",
    treatment: -15,
    control: 0,
    rr: 0.85,
    ci: "0.79-0.92",
    p: "<0.001",
    studies: 5,
  },
  {
    outcome: "Weight change (kg)",
    treatment: -2.1,
    control: -0.3,
    rr: null,
    ci: "−2.4 to −1.8",
    p: "<0.001",
    studies: 7,
  },
];

const INCLUDED_PAPERS = [
  {
    id: "p1",
    title: "EMPEROR-Reduced: Empagliflozin in HFrEF",
    journal: "NEJM",
    year: 2020,
    n: 3730,
    quality: "High",
  },
  {
    id: "p2",
    title: "DAPA-HF: Dapagliflozin in HFrEF",
    journal: "NEJM",
    year: 2019,
    n: 4744,
    quality: "High",
  },
  {
    id: "p3",
    title: "EMPEROR-Preserved: HFpEF",
    journal: "NEJM",
    year: 2021,
    n: 5988,
    quality: "High",
  },
  {
    id: "p4",
    title: "DELIVER: Dapagliflozin in HFpEF",
    journal: "NEJM",
    year: 2022,
    n: 6263,
    quality: "High",
  },
  {
    id: "p5",
    title: "EMPACT-MI: Post-MI HF",
    journal: "NEJM",
    year: 2024,
    n: 6522,
    quality: "Moderate",
  },
];

type AnalysisState = "setup" | "processing" | "complete";

export function ResearchSupportPreview() {
  const router = useRouter();
  const [selectedAnalysis, setSelectedAnalysis] = useState("literature");
  const [query, setQuery] = useState(
    "SGLT2 inhibitors in heart failure outcomes meta-analysis",
  );
  const [analysisState, setAnalysisState] = useState<AnalysisState>("complete");
  const [activeResultTab, setActiveResultTab] = useState<
    "summary" | "data" | "charts" | "papers"
  >("summary");
  const [picoParts, setPicoParts] = useState({
    P: "Adults with heart failure (HFrEF or HFpEF)",
    I: "SGLT2 inhibitors (empagliflozin or dapagliflozin)",
    C: "Placebo or standard care",
    O: "All-cause mortality, CV death, HF hospitalization, renal outcomes",
  });
  const [excludedPapers, setExcludedPapers] = useState<Set<string>>(new Set());

  const navigate = (href: string) => {
    router.push(href);
  };

  const handleRunAnalysis = () => {
    setAnalysisState("processing");
    window.setTimeout(() => setAnalysisState("complete"), 2000);
  };

  const toggleExclude = (id: string) => {
    setExcludedPapers((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-slate-800">
            <FlaskConical className="h-6 w-6 text-teal-600" />
            Research Support
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            AI-powered literature analysis, evidence synthesis, and research tools
          </p>
        </div>
        {analysisState === "complete" && (
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-medium text-slate-700">
              Analysis Type
            </h4>
            <div className="space-y-1.5">
              {ANALYSIS_TYPES.map((type) => {
                const Icon = type.icon;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedAnalysis(type.id)}
                    className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                      selectedAnalysis === type.id
                        ? "border-blue-200 bg-blue-50"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${selectedAnalysis === type.id ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${selectedAnalysis === type.id ? "text-blue-700" : "text-slate-700"}`}
                      >
                        {type.label}
                      </p>
                      <p className="text-xs text-slate-400">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Filter className="h-3.5 w-3.5" /> Filters
            </h4>
            <div className="space-y-2.5">
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Year Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    defaultValue="2015"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400">–</span>
                  <input
                    defaultValue="2025"
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Study Design
                </label>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>All Designs</option>
                  <option>RCT Only</option>
                  <option>Observational</option>
                  <option>Meta-analyses</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Min Sample Size
                </label>
                <input
                  defaultValue="100"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Database
                </label>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>All Databases</option>
                  <option>PubMed/MEDLINE</option>
                  <option>Cochrane</option>
                  <option>Embase</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Research Question / Query
            </label>
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              rows={2}
              className="mb-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["P", "I", "C", "O"] as const).map((part) => (
                <div key={part}>
                  <label className="mb-1 block text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">{part}</span>
                    {" – "}
                    {part === "P"
                      ? "Population"
                      : part === "I"
                        ? "Intervention"
                        : part === "C"
                          ? "Comparison"
                          : "Outcome"}
                  </label>
                  <input
                    value={picoParts[part]}
                    onChange={(event) =>
                      setPicoParts((previous) => ({
                        ...previous,
                        [part]: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Zap className="h-4 w-4" />
                {analysisState === "processing" ? "Analyzing..." : "Run Analysis"}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <div className="flex-1" />
              <span className="text-xs text-slate-400">
                47 sources · Last updated Mar 15, 2026
              </span>
            </div>
          </div>

          {analysisState === "processing" && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mb-1 font-medium text-slate-700">
                Analyzing Literature
              </p>
              <p className="text-sm text-slate-500">
                Searching 260,000+ resources across 12 databases...
              </p>
              <div className="mx-auto mt-4 max-w-xs space-y-2">
                {[
                  "Retrieving 47 relevant papers",
                  "Assessing evidence quality",
                  "Extracting outcome data",
                  "Generating synthesis",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-left">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full ${
                        index < 2
                          ? "bg-teal-500"
                          : index === 2
                            ? "animate-pulse bg-blue-400"
                            : "bg-slate-200"
                      }`}
                    >
                      {index < 2 && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <span
                      className={`text-xs ${
                        index < 2
                          ? "text-slate-600"
                          : index === 2
                            ? "text-blue-600"
                            : "text-slate-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisState === "complete" && (
            <div>
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 p-3">
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-teal-600" />
                <p className="text-sm text-teal-700">
                  Analysis complete · 47 papers included · 5 excluded (quality
                  criteria)
                </p>
                <span className="ml-auto text-xs text-teal-600">
                  Completed 10:32 AM
                </span>
              </div>

              <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
                {(["summary", "data", "charts", "papers"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveResultTab(tab)}
                    className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm capitalize transition-all ${
                      activeResultTab === tab
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "summary"
                      ? "AI Summary"
                      : tab === "data"
                        ? "Outcomes Data"
                        : tab === "charts"
                          ? "Visualizations"
                          : "Included Papers"}
                  </button>
                ))}
              </div>

              {activeResultTab === "summary" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="mb-0.5 text-slate-800">
                          AI Synthesis Summary
                        </h3>
                        <p className="text-xs text-slate-500">
                          Based on 47 included studies (N = 38,247 patients)
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                      <p>
                        SGLT2 inhibitors (empagliflozin and dapagliflozin)
                        demonstrate consistent, clinically meaningful benefits
                        across the spectrum of heart failure, irrespective of
                        ejection fraction or diabetes status.
                      </p>
                      <p>
                        <strong className="text-slate-800">
                          Primary Outcomes:
                        </strong>{" "}
                        Both agents significantly reduce the composite of
                        cardiovascular death and worsening heart failure events
                        (NNT ≈ 21-28 over ~18 months). All-cause mortality
                        reduction was consistent across HFrEF trials (RR 0.82,
                        95% CI 0.74-0.91) but less pronounced in HFpEF trials.
                      </p>
                      <p>
                        <strong className="text-slate-800">
                          Renal Protection:
                        </strong>{" "}
                        SGLT2 inhibitors consistently slow eGFR decline and
                        reduce the risk of clinically meaningful renal endpoints,
                        effects that appear independent of their glycemic
                        actions.
                      </p>
                      <p>
                        <strong className="text-slate-800">Safety:</strong>{" "}
                        Genital mycotic infections are more common (NNH ≈ 67).
                        Euglycemic DKA risk is low in HF populations. Volume
                        depletion and hypotension require monitoring in frail or
                        elderly patients.
                      </p>
                      <p>
                        <strong className="text-slate-800">Heterogeneity:</strong>{" "}
                        I² = 18% for primary composite outcome (low), suggesting
                        consistent effects across study populations.
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {[
                        { label: "Studies Included", value: "47", sub: "5 excluded" },
                        {
                          label: "Total Patients",
                          value: "38,247",
                          sub: "N across all studies",
                        },
                        {
                          label: "Median Follow-up",
                          value: "19 mo.",
                          sub: "Range: 12-26 mo.",
                        },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center"
                        >
                          <p className="text-lg font-semibold text-blue-600">
                            {metric.value}
                          </p>
                          <p className="text-xs text-slate-700">{metric.label}</p>
                          <p className="text-xs text-slate-400">{metric.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                      <div>
                        <p className="mb-1 text-sm font-medium text-amber-700">
                          Limitations & Caveats
                        </p>
                        <ul className="list-inside list-disc space-y-0.5 text-sm text-amber-600">
                          <li>
                            Most trials excluded patients with eGFR &lt;20
                            mL/min/1.73m²
                          </li>
                          <li>Limited data in NYHA Class IV patients</li>
                          <li>
                            Head-to-head comparison between empagliflozin and
                            dapagliflozin not available
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeResultTab === "data" && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 p-4">
                    <h3 className="text-slate-800">Outcome Summary Table</h3>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-3.5 w-3.5" /> Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                          {[
                            "Outcome",
                            "RR / MD",
                            "95% CI",
                            "P-value",
                            "Studies (N)",
                          ].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 py-3 text-left text-xs font-medium text-slate-500"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {OUTCOME_DATA.map((row) => (
                          <tr
                            key={row.outcome}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-medium text-slate-700">
                              {row.outcome}
                            </td>
                            <td className="px-4 py-3">
                              {row.rr !== null ? (
                                <span
                                  className={`font-mono text-sm ${row.rr < 1 ? "text-teal-600" : "text-slate-600"}`}
                                >
                                  RR {row.rr.toFixed(2)}
                                </span>
                              ) : (
                                <span className="font-mono text-sm text-slate-600">
                                  MD {row.treatment}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                              {row.ci}
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-teal-50 px-2 py-0.5 font-mono text-xs text-teal-700">
                                {row.p}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {row.studies}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeResultTab === "charts" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-3 text-sm font-medium text-slate-700">
                      Publication Trend
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={PUBLICATION_TREND} margin={{ left: -10 }}>
                        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "11px",
                          }}
                        />
                        <Bar dataKey="count" fill="#2563EB" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-3 text-sm font-medium text-slate-700">
                      Study Design Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <RePieChart>
                        <Pie
                          data={EVIDENCE_DIST}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          label={({ name, percent }) =>
                            `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                          fontSize={10}
                        >
                          {EVIDENCE_DIST.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
                    <h4 className="mb-1 text-sm font-medium text-slate-700">
                      Forest Plot – All-Cause Mortality
                    </h4>
                    <p className="mb-4 text-xs text-slate-500">
                      Risk ratio vs. placebo. Values &lt;1 favor SGLT2 inhibitor
                    </p>
                    <div className="space-y-3">
                      {[
                        {
                          study: "EMPEROR-Reduced (2020)",
                          rr: 0.92,
                          ci: [0.77, 1.1] as const,
                        },
                        {
                          study: "DAPA-HF (2019)",
                          rr: 0.83,
                          ci: [0.71, 0.97] as const,
                        },
                        {
                          study: "EMPEROR-Preserved (2021)",
                          rr: 0.91,
                          ci: [0.76, 1.09] as const,
                        },
                        {
                          study: "DELIVER (2022)",
                          rr: 0.87,
                          ci: [0.74, 1.02] as const,
                        },
                      ].map((study) => {
                        const scale = (value: number) => ((value - 0.5) / 0.8) * 100;

                        return (
                          <div key={study.study} className="flex items-center gap-3">
                            <span className="w-56 flex-shrink-0 text-xs text-slate-600">
                              {study.study}
                            </span>
                            <div className="relative h-5 flex-1 rounded border border-slate-100 bg-slate-50">
                              <div
                                className="absolute bottom-0 top-0 w-px bg-slate-300"
                                style={{ left: `${scale(1)}%` }}
                              />
                              <div
                                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-blue-300"
                                style={{
                                  left: `${scale(study.ci[0])}%`,
                                  width: `${scale(study.ci[1]) - scale(study.ci[0])}%`,
                                }}
                              />
                              <div
                                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-blue-600"
                                style={{ left: `${scale(study.rr)}%`, marginLeft: -6 }}
                              />
                            </div>
                            <span className="w-20 flex-shrink-0 text-right text-xs text-slate-500">
                              {study.rr.toFixed(2)} [{study.ci[0].toFixed(2)}-
                              {study.ci[1].toFixed(2)}]
                            </span>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-3 border-t border-slate-200 pt-2">
                        <span className="w-56 flex-shrink-0 text-xs font-semibold text-slate-800">
                          Pooled Estimate
                        </span>
                        <div className="relative h-5 flex-1">
                          <div
                            className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-teal-300"
                            style={{ left: "39%", width: "18%" }}
                          />
                          <div
                            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-teal-600"
                            style={{ left: "47%", marginLeft: -8 }}
                          />
                        </div>
                        <span className="w-20 flex-shrink-0 text-right text-xs font-semibold text-teal-700">
                          0.82 [0.74-0.91]
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Heterogeneity: I² = 18%, Cochran Q p = 0.31 · Fixed effects
                      model
                    </p>
                  </div>
                </div>
              )}

              {activeResultTab === "papers" && (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 p-4">
                    <h3 className="text-slate-800">
                      Included Papers ({INCLUDED_PAPERS.length - excludedPapers.size} /{" "}
                      {INCLUDED_PAPERS.length})
                    </h3>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Paper
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {INCLUDED_PAPERS.map((paper) => {
                      const excluded = excludedPapers.has(paper.id);

                      return (
                        <div
                          key={paper.id}
                          className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${
                            excluded ? "opacity-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${
                                excluded
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700"
                              }`}
                            >
                              {paper.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              <span className="text-teal-600">{paper.journal}</span>{" "}
                              · {paper.year} · N = {paper.n.toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${
                              paper.quality === "High"
                                ? "bg-teal-50 text-teal-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {paper.quality} Quality
                          </span>
                          <div className="flex flex-shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(`/resource/${paper.id}`)}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleExclude(paper.id)}
                              className={`rounded-lg p-1.5 transition-colors ${
                                excluded
                                  ? "text-teal-600 hover:bg-teal-50"
                                  : "text-slate-400 hover:bg-red-50 hover:text-red-500"
                              }`}
                            >
                              {excluded ? (
                                <Plus className="h-3.5 w-3.5" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
