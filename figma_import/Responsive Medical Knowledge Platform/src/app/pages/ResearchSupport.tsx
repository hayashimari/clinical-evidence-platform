import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FlaskConical,
  Search,
  Brain,
  FileText,
  BarChart2,
  Network,
  BookOpen,
  Download,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCcw,
  Filter,
  Layers,
  TrendingUp,
  Lightbulb,
  Quote,
  Database,
  PieChart,
  ArrowUpRight,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ANALYSIS_TYPES = [
  { id: "literature", label: "Literature Review", icon: BookOpen, desc: "Summarize evidence across studies" },
  { id: "meta", label: "Meta-Analysis Support", icon: BarChart2, desc: "Forest plots & heterogeneity" },
  { id: "pico", label: "PICO Analysis", icon: Layers, desc: "Structure clinical questions" },
  { id: "network", label: "Evidence Network", icon: Network, desc: "Compare interventions indirectly" },
  { id: "bias", label: "Bias Assessment", icon: CheckCircle, desc: "Risk of bias evaluation" },
  { id: "data", label: "Data Extraction", icon: Database, desc: "Extract outcomes from papers" },
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
  { outcome: "All-cause mortality", treatment: -18, control: 0, rr: 0.82, ci: "0.74-0.91", p: "<0.001", studies: 8 },
  { outcome: "CV death", treatment: -22, control: 0, rr: 0.78, ci: "0.69-0.88", p: "<0.001", studies: 6 },
  { outcome: "HF hospitalization", treatment: -31, control: 0, rr: 0.69, ci: "0.61-0.78", p: "<0.001", studies: 10 },
  { outcome: "eGFR decline", treatment: -15, control: 0, rr: 0.85, ci: "0.79-0.92", p: "<0.001", studies: 5 },
  { outcome: "Weight change (kg)", treatment: -2.1, control: -0.3, rr: null, ci: "−2.4 to −1.8", p: "<0.001", studies: 7 },
];

const INCLUDED_PAPERS = [
  { id: "p1", title: "EMPEROR-Reduced: Empagliflozin in HFrEF", journal: "NEJM", year: 2020, n: 3730, quality: "High" },
  { id: "p2", title: "DAPA-HF: Dapagliflozin in HFrEF", journal: "NEJM", year: 2019, n: 4744, quality: "High" },
  { id: "p3", title: "EMPEROR-Preserved: HFpEF", journal: "NEJM", year: 2021, n: 5988, quality: "High" },
  { id: "p4", title: "DELIVER: Dapagliflozin in HFpEF", journal: "NEJM", year: 2022, n: 6263, quality: "High" },
  { id: "p5", title: "EMPACT-MI: Post-MI HF", journal: "NEJM", year: 2024, n: 6522, quality: "Moderate" },
];

type AnalysisState = "setup" | "processing" | "complete";

export function ResearchSupport() {
  const navigate = useNavigate();
  const [selectedAnalysis, setSelectedAnalysis] = useState("literature");
  const [query, setQuery] = useState("SGLT2 inhibitors in heart failure outcomes meta-analysis");
  const [analysisState, setAnalysisState] = useState<AnalysisState>("complete");
  const [activeResultTab, setActiveResultTab] = useState<"summary" | "data" | "charts" | "papers">("summary");
  const [picoParts, setPicoParts] = useState({
    P: "Adults with heart failure (HFrEF or HFpEF)",
    I: "SGLT2 inhibitors (empagliflozin or dapagliflozin)",
    C: "Placebo or standard care",
    O: "All-cause mortality, CV death, HF hospitalization, renal outcomes",
  });
  const [excludedPapers, setExcludedPapers] = useState<Set<string>>(new Set());

  const handleRunAnalysis = () => {
    setAnalysisState("processing");
    setTimeout(() => setAnalysisState("complete"), 2000);
  };

  const toggleExclude = (id: string) => {
    setExcludedPapers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-800 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-teal-600" />
            Research Support
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">AI-powered literature analysis, evidence synthesis, and research tools</p>
        </div>
        {analysisState === "complete" && (
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left config panel */}
        <div className="xl:col-span-1 space-y-4">
          {/* Analysis type */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-slate-700 mb-3 text-sm font-medium">Analysis Type</h4>
            <div className="space-y-1.5">
              {ANALYSIS_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAnalysis(type.id)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all ${
                      selectedAnalysis === type.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${selectedAnalysis === type.id ? "text-blue-600" : "text-slate-400"}`} />
                    <div>
                      <p className={`text-xs font-medium ${selectedAnalysis === type.id ? "text-blue-700" : "text-slate-700"}`}>
                        {type.label}
                      </p>
                      <p className="text-xs text-slate-400">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-slate-700 mb-3 text-sm font-medium flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Filters
            </h4>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Year Range</label>
                <div className="flex items-center gap-2">
                  <input defaultValue="2015" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">–</span>
                  <input defaultValue="2025" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Study Design</label>
                <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>All Designs</option>
                  <option>RCT Only</option>
                  <option>Observational</option>
                  <option>Meta-analyses</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Min Sample Size</label>
                <input defaultValue="100" className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Database</label>
                <select className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>All Databases</option>
                  <option>PubMed/MEDLINE</option>
                  <option>Cochrane</option>
                  <option>Embase</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div className="xl:col-span-3">
          {/* Query input */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
            <label className="text-sm text-slate-600 mb-2 block font-medium">Research Question / Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            />

            {/* PICO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {(["P", "I", "C", "O"] as const).map((part) => (
                <div key={part}>
                  <label className="text-xs text-slate-500 mb-1 block">
                    <span className="font-semibold text-blue-600">{part}</span>
                    {" – "}
                    {part === "P" ? "Population" : part === "I" ? "Intervention" : part === "C" ? "Comparison" : "Outcome"}
                  </label>
                  <input
                    value={picoParts[part]}
                    onChange={(e) => setPicoParts((prev) => ({ ...prev, [part]: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4" />
                {analysisState === "processing" ? "Analyzing..." : "Run Analysis"}
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                <RefreshCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <div className="flex-1" />
              <span className="text-xs text-slate-400">47 sources · Last updated Mar 15, 2026</span>
            </div>
          </div>

          {/* Processing state */}
          {analysisState === "processing" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-slate-700 font-medium mb-1">Analyzing Literature</p>
              <p className="text-slate-500 text-sm">Searching 260,000+ resources across 12 databases...</p>
              <div className="mt-4 space-y-2 max-w-xs mx-auto">
                {["Retrieving 47 relevant papers", "Assessing evidence quality", "Extracting outcome data", "Generating synthesis"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-left">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < 2 ? "bg-teal-500" : i === 2 ? "bg-blue-400 animate-pulse" : "bg-slate-200"}`}>
                      {i < 2 && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-xs ${i < 2 ? "text-slate-600" : i === 2 ? "text-blue-600" : "text-slate-400"}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {analysisState === "complete" && (
            <div>
              {/* Status bar */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <p className="text-sm text-teal-700">Analysis complete · 47 papers included · 5 excluded (quality criteria)</p>
                <span className="ml-auto text-xs text-teal-600">Completed 10:32 AM</span>
              </div>

              {/* Result tabs */}
              <div className="flex gap-1 mb-4 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
                {(["summary", "data", "charts", "papers"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveResultTab(tab)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                      activeResultTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "summary" ? "AI Summary" : tab === "data" ? "Outcomes Data" : tab === "charts" ? "Visualizations" : "Included Papers"}
                  </button>
                ))}
              </div>

              {/* SUMMARY TAB */}
              {activeResultTab === "summary" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-slate-800 mb-0.5">AI Synthesis Summary</h3>
                        <p className="text-xs text-slate-500">Based on 47 included studies (N = 38,247 patients)</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                      <p>SGLT2 inhibitors (empagliflozin and dapagliflozin) demonstrate consistent, clinically meaningful benefits across the spectrum of heart failure, irrespective of ejection fraction or diabetes status.</p>
                      <p><strong className="text-slate-800">Primary Outcomes:</strong> Both agents significantly reduce the composite of cardiovascular death and worsening heart failure events (NNT ≈ 21-28 over ~18 months). All-cause mortality reduction was consistent across HFrEF trials (RR 0.82, 95% CI 0.74-0.91) but less pronounced in HFpEF trials.</p>
                      <p><strong className="text-slate-800">Renal Protection:</strong> SGLT2 inhibitors consistently slow eGFR decline and reduce the risk of clinically meaningful renal endpoints, effects that appear independent of their glycemic actions.</p>
                      <p><strong className="text-slate-800">Safety:</strong> Genital mycotic infections are more common (NNH ≈ 67). Euglycemic DKA risk is low in HF populations. Volume depletion and hypotension require monitoring in frail or elderly patients.</p>
                      <p><strong className="text-slate-800">Heterogeneity:</strong> I² = 18% for primary composite outcome (low), suggesting consistent effects across study populations.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5">
                      {[
                        { label: "Studies Included", value: "47", sub: "5 excluded" },
                        { label: "Total Patients", value: "38,247", sub: "N across all studies" },
                        { label: "Median Follow-up", value: "19 mo.", sub: "Range: 12-26 mo." },
                      ].map((m) => (
                        <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                          <p className="text-lg font-semibold text-blue-600">{m.value}</p>
                          <p className="text-xs text-slate-700">{m.label}</p>
                          <p className="text-xs text-slate-400">{m.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-700 font-medium mb-1">Limitations & Caveats</p>
                        <ul className="text-sm text-amber-600 space-y-0.5 list-disc list-inside">
                          <li>Most trials excluded patients with eGFR &lt;20 mL/min/1.73m²</li>
                          <li>Limited data in NYHA Class IV patients</li>
                          <li>Head-to-head comparison between empagliflozin and dapagliflozin not available</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DATA TAB */}
              {activeResultTab === "data" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-slate-800">Outcome Summary Table</h3>
                    <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {["Outcome", "RR / MD", "95% CI", "P-value", "Studies (N)"].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {OUTCOME_DATA.map((row) => (
                          <tr key={row.outcome} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-700 font-medium">{row.outcome}</td>
                            <td className="px-4 py-3">
                              {row.rr !== null ? (
                                <span className={`font-mono text-sm ${row.rr < 1 ? "text-teal-600" : "text-slate-600"}`}>
                                  RR {row.rr.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-slate-600 text-sm font-mono">MD {row.treatment}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.ci}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-mono">{row.p}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{row.studies}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CHARTS TAB */}
              {activeResultTab === "charts" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-slate-700 mb-3 text-sm font-medium">Publication Trend</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={PUBLICATION_TREND} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }} />
                        <Bar dataKey="count" fill="#2563EB" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-slate-700 mb-3 text-sm font-medium">Study Design Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <RePieChart>
                        <Pie data={EVIDENCE_DIST} dataKey="value" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                          {EVIDENCE_DIST.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:col-span-2">
                    <h4 className="text-slate-700 mb-1 text-sm font-medium">Forest Plot – All-Cause Mortality</h4>
                    <p className="text-xs text-slate-500 mb-4">Risk ratio vs. placebo. Values &lt;1 favor SGLT2 inhibitor</p>
                    <div className="space-y-3">
                      {[
                        { study: "EMPEROR-Reduced (2020)", rr: 0.92, ci: [0.77, 1.10], n: 3730, weight: "22%" },
                        { study: "DAPA-HF (2019)", rr: 0.83, ci: [0.71, 0.97], n: 4744, weight: "28%" },
                        { study: "EMPEROR-Preserved (2021)", rr: 0.91, ci: [0.76, 1.09], n: 5988, weight: "24%" },
                        { study: "DELIVER (2022)", rr: 0.87, ci: [0.74, 1.02], n: 6263, weight: "26%" },
                      ].map((study) => {
                        const scale = (v: number) => ((v - 0.5) / 0.8) * 100;
                        return (
                          <div key={study.study} className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-56 flex-shrink-0">{study.study}</span>
                            <div className="flex-1 relative h-5 bg-slate-50 rounded border border-slate-100">
                              {/* Null line at RR=1 */}
                              <div className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: `${scale(1)}%` }} />
                              {/* CI line */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-blue-300"
                                style={{ left: `${scale(study.ci[0])}%`, width: `${scale(study.ci[1]) - scale(study.ci[0])}%` }}
                              />
                              {/* RR diamond */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rotate-45"
                                style={{ left: `${scale(study.rr)}%`, marginLeft: -6 }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-20 text-right flex-shrink-0">
                              {study.rr.toFixed(2)} [{study.ci[0].toFixed(2)}-{study.ci[1].toFixed(2)}]
                            </span>
                          </div>
                        );
                      })}
                      {/* Pooled */}
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-800 font-semibold w-56 flex-shrink-0">Pooled Estimate</span>
                        <div className="flex-1 relative h-5">
                          <div className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-teal-300" style={{ left: "39%", width: "18%" }} />
                          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 rotate-45" style={{ left: "47%", marginLeft: -8 }} />
                        </div>
                        <span className="text-xs text-teal-700 font-semibold w-20 text-right flex-shrink-0">0.82 [0.74-0.91]</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Heterogeneity: I² = 18%, Cochran Q p = 0.31 · Fixed effects model</p>
                  </div>
                </div>
              )}

              {/* PAPERS TAB */}
              {activeResultTab === "papers" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-slate-800">Included Papers ({INCLUDED_PAPERS.length - excludedPapers.size} / {INCLUDED_PAPERS.length})</h3>
                    <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                      <Plus className="w-3.5 h-3.5" /> Add Paper
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {INCLUDED_PAPERS.map((paper) => {
                      const excluded = excludedPapers.has(paper.id);
                      return (
                        <div key={paper.id} className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${excluded ? "opacity-50" : "hover:bg-slate-50"}`}>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${excluded ? "line-through text-slate-400" : "text-slate-700"}`}>{paper.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              <span className="text-teal-600">{paper.journal}</span> · {paper.year} · N = {paper.n.toLocaleString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${paper.quality === "High" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                            {paper.quality} Quality
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => navigate(`/resource/${paper.id}`)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleExclude(paper.id)}
                              className={`p-1.5 rounded-lg transition-colors ${excluded ? "text-teal-600 hover:bg-teal-50" : "text-slate-400 hover:text-red-500 hover:bg-red-50"}`}
                            >
                              {excluded ? <Plus className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
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