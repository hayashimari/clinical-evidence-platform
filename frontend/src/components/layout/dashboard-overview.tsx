"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Clock,
  Dna,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Microscope,
  Search,
  Stethoscope,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const activityData = [
  { day: "Mon", searches: 12, reads: 5 },
  { day: "Tue", searches: 19, reads: 8 },
  { day: "Wed", searches: 8, reads: 12 },
  { day: "Thu", searches: 24, reads: 10 },
  { day: "Fri", searches: 17, reads: 14 },
  { day: "Sat", searches: 6, reads: 3 },
  { day: "Sun", searches: 9, reads: 7 },
];

const RESOURCE_TYPES = [
  {
    icon: BookOpen,
    label: "Textbooks",
    count: "2,840",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    type: "textbook",
  },
  {
    icon: FileText,
    label: "Research Papers",
    count: "184,200+",
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-100",
    type: "paper",
  },
  {
    icon: ClipboardList,
    label: "Guidelines",
    count: "3,120",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
    type: "guideline",
  },
  {
    icon: Stethoscope,
    label: "Case Reports",
    count: "47,500+",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    type: "case",
  },
  {
    icon: Microscope,
    label: "Conference",
    count: "18,900+",
    color: "bg-pink-50 text-pink-600",
    border: "border-pink-100",
    type: "conference",
  },
  {
    icon: Dna,
    label: "Research Data",
    count: "9,400+",
    color: "bg-indigo-50 text-indigo-600",
    border: "border-indigo-100",
    type: "data",
  },
];

const RECENT_SEARCHES = [
  "Atrial fibrillation anticoagulation guidelines 2024",
  "Type 2 diabetes GLP-1 receptor agonists meta-analysis",
  "Sepsis management protocol ICU",
  "PCSK9 inhibitors cardiovascular outcomes",
];

const TRENDING = [
  {
    id: "1",
    title:
      "Updated ACC/AHA Guidelines for Management of Heart Failure with Reduced Ejection Fraction",
    type: "Guideline",
    typeColor: "bg-teal-100 text-teal-700",
    journal: "JACC",
    date: "Mar 2025",
    reads: "12.4K",
  },
  {
    id: "2",
    title:
      "Efficacy of Semaglutide 2.4mg vs Tirzepatide in Obesity: Systematic Review and Network Meta-analysis",
    type: "Paper",
    typeColor: "bg-violet-100 text-violet-700",
    journal: "NEJM",
    date: "Feb 2025",
    reads: "9.8K",
  },
  {
    id: "3",
    title:
      "Rare Presentation of Anti-NMDA Receptor Encephalitis in 34-year-old Male: Case Report",
    type: "Case",
    typeColor: "bg-amber-100 text-amber-700",
    journal: "BMJ Case Reports",
    date: "Mar 2025",
    reads: "3.2K",
  },
  {
    id: "4",
    title: "2025 ESC Guidelines on Acute Coronary Syndromes",
    type: "Guideline",
    typeColor: "bg-teal-100 text-teal-700",
    journal: "European Heart Journal",
    date: "Jan 2025",
    reads: "21.7K",
  },
];

const RECENTLY_VIEWED = [
  {
    id: "1",
    title: "Harrison's Principles of Internal Medicine, 22e – Chapter 31: Chest Pain",
    type: "Textbook",
    icon: BookOpen,
    iconColor: "text-blue-600 bg-blue-50",
    time: "2h ago",
  },
  {
    id: "2",
    title: "RECOVERY Trial: Dexamethasone in Hospitalized COVID-19 Patients",
    type: "Paper",
    icon: FileText,
    iconColor: "text-violet-600 bg-violet-50",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "WHO Guidelines on Malaria Treatment 2023",
    type: "Guideline",
    icon: ClipboardList,
    iconColor: "text-teal-600 bg-teal-50",
    time: "2 days ago",
  },
];

const STATS = [
  {
    label: "Resources Accessed",
    value: "248",
    change: "+12%",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    label: "Searches This Month",
    value: "94",
    change: "+8%",
    icon: Search,
    color: "text-teal-600",
  },
  {
    label: "Saved Items",
    value: "37",
    change: "+5",
    icon: BookMarked,
    color: "text-violet-600",
  },
  {
    label: "Quiz Score Avg",
    value: "82%",
    change: "+4pts",
    icon: Award,
    color: "text-amber-600",
  },
];

export function DashboardOverview() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (href: string) => {
    router.push(href);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-white" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 translate-y-1/2 rounded-full bg-teal-400" />
        </div>
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm text-blue-200">Good morning,</span>
            <span className="rounded-full border border-teal-400/30 bg-teal-500/30 px-2 py-0.5 text-xs text-teal-200">
              Internal Medicine
            </span>
          </div>
          <h1 className="mb-1 text-white">Dr. Rachel Chen</h1>
          <p className="mb-5 max-w-lg text-sm text-blue-200">
            Access 260,000+ medical resources across textbooks, papers,
            guidelines, and research data in one unified platform.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search all medical resources..."
                className="w-full rounded-xl bg-white/95 py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm text-white shadow-lg transition-colors hover:bg-teal-400"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-xs text-teal-600">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-slate-800">Browse by Resource Type</h2>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {RESOURCE_TYPES.map((resourceType) => {
              const Icon = resourceType.icon;

              return (
                <button
                  key={resourceType.type}
                  type="button"
                  onClick={() => navigate(`/search?type=${resourceType.type}`)}
                  className={`group rounded-xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${resourceType.border}`}
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${resourceType.color}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {resourceType.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {resourceType.count} resources
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-slate-800">Quick Tools</h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/learning")}
              className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <GraduationCap className="h-[18px] w-[18px] text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    Learning & Quiz
                  </p>
                  <p className="text-xs text-slate-500">
                    Generate adaptive quizzes
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-500" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate("/research")}
              className="group w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50">
                  <FlaskConical className="h-[18px] w-[18px] text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    Research Support
                  </p>
                  <p className="text-xs text-slate-500">
                    AI-powered analysis
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal-500" />
              </div>
            </button>
            <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  AI Summary
                </span>
                <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-xs text-teal-600">
                  New
                </span>
              </div>
              <p className="mb-3 text-xs text-slate-600">
                Summarize any article instantly with our clinical AI assistant
              </p>
              <button
                type="button"
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-teal-700"
              >
                Try it now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-slate-800">Weekly Activity</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Searches & reads this week
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-500">Searches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-500">Reads</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={activityData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#475569", fontWeight: 500 }}
              />
              <Area
                type="monotone"
                dataKey="searches"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#colorSearches)"
              />
              <Area
                type="monotone"
                dataKey="reads"
                stroke="#0D9488"
                strokeWidth={2}
                fill="url(#colorReads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-slate-800">Recent Searches</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {RECENT_SEARCHES.map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="group flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-slate-50"
              >
                <Search className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-colors group-hover:text-blue-500" />
                <span className="line-clamp-2 text-sm text-slate-600 transition-colors group-hover:text-slate-800">
                  {query}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="mt-3 w-full rounded-lg border border-blue-100 py-1 text-center text-xs text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
          >
            View search history
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h3 className="text-slate-800">Trending in Internal Medicine</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {TRENDING.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/resource/${item.id}`)}
                className="group flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="mt-0.5 w-6 flex-shrink-0 text-lg font-semibold text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.typeColor}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">{item.journal}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-700 transition-colors group-hover:text-slate-900">
                    {item.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Users className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {item.reads} reads
                    </span>
                  </div>
                </div>
                <ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 p-4">
              <Clock className="h-4 w-4 text-slate-400" />
              <h3 className="text-slate-800">Recently Viewed</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {RECENTLY_VIEWED.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/resource/${item.id}`)}
                    className="group flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs text-slate-700 group-hover:text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium text-blue-100">
                CME Credit Tracker
              </span>
            </div>
            <p className="mb-0.5 text-xl font-semibold text-white">18 / 50 CME</p>
            <p className="mb-3 text-xs text-blue-200">
              Credits earned this year
            </p>
            <div className="mb-3 h-2 rounded-full bg-blue-800/40">
              <div
                className="h-2 rounded-full bg-teal-400"
                style={{ width: "36%" }}
              />
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-white/15 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/25"
            >
              View CME Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
