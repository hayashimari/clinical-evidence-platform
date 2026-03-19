import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  FileText,
  ClipboardList,
  Stethoscope,
  Microscope,
  Dna,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Search,
  BookMarked,
  GraduationCap,
  FlaskConical,
  ChevronRight,
  ExternalLink,
  Activity,
  Users,
  Award,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  { icon: BookOpen, label: "Textbooks", count: "2,840", color: "bg-blue-50 text-blue-600", border: "border-blue-100", type: "textbook" },
  { icon: FileText, label: "Research Papers", count: "184,200+", color: "bg-violet-50 text-violet-600", border: "border-violet-100", type: "paper" },
  { icon: ClipboardList, label: "Guidelines", count: "3,120", color: "bg-teal-50 text-teal-600", border: "border-teal-100", type: "guideline" },
  { icon: Stethoscope, label: "Case Reports", count: "47,500+", color: "bg-amber-50 text-amber-600", border: "border-amber-100", type: "case" },
  { icon: Microscope, label: "Conference", count: "18,900+", color: "bg-pink-50 text-pink-600", border: "border-pink-100", type: "conference" },
  { icon: Dna, label: "Research Data", count: "9,400+", color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100", type: "data" },
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
    title: "Updated ACC/AHA Guidelines for Management of Heart Failure with Reduced Ejection Fraction",
    type: "Guideline",
    typeColor: "bg-teal-100 text-teal-700",
    journal: "JACC",
    date: "Mar 2025",
    reads: "12.4K",
  },
  {
    id: "2",
    title: "Efficacy of Semaglutide 2.4mg vs Tirzepatide in Obesity: Systematic Review and Network Meta-analysis",
    type: "Paper",
    typeColor: "bg-violet-100 text-violet-700",
    journal: "NEJM",
    date: "Feb 2025",
    reads: "9.8K",
  },
  {
    id: "3",
    title: "Rare Presentation of Anti-NMDA Receptor Encephalitis in 34-year-old Male: Case Report",
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
  { id: "1", title: "Harrison's Principles of Internal Medicine, 22e – Chapter 31: Chest Pain", type: "Textbook", icon: BookOpen, iconColor: "text-blue-600 bg-blue-50", time: "2h ago" },
  { id: "2", title: "RECOVERY Trial: Dexamethasone in Hospitalized COVID-19 Patients", type: "Paper", icon: FileText, iconColor: "text-violet-600 bg-violet-50", time: "Yesterday" },
  { id: "3", title: "WHO Guidelines on Malaria Treatment 2023", type: "Guideline", icon: ClipboardList, iconColor: "text-teal-600 bg-teal-50", time: "2 days ago" },
];

const STATS = [
  { label: "Resources Accessed", value: "248", change: "+12%", icon: BookOpen, color: "text-blue-600" },
  { label: "Searches This Month", value: "94", change: "+8%", icon: Search, color: "text-teal-600" },
  { label: "Saved Items", value: "37", change: "+5", icon: BookMarked, color: "text-violet-600" },
  { label: "Quiz Score Avg", value: "82%", change: "+4pts", icon: Award, color: "text-amber-600" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-teal-400 translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-200 text-sm">Good morning,</span>
            <span className="bg-teal-500/30 text-teal-200 text-xs px-2 py-0.5 rounded-full border border-teal-400/30">Internal Medicine</span>
          </div>
          <h1 className="text-white mb-1">Dr. Rachel Chen</h1>
          <p className="text-blue-200 text-sm mb-5 max-w-lg">
            Access 260,000+ medical resources across textbooks, papers, guidelines, and research data in one unified platform.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all medical resources..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/95 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-medium transition-colors shadow-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <p className="text-2xl text-slate-800 font-semibold">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Resource Types */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-800">Browse by Resource Type</h2>
            <button onClick={() => navigate("/search")} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RESOURCE_TYPES.map((rt) => {
              const Icon = rt.icon;
              return (
                <button
                  key={rt.type}
                  onClick={() => navigate(`/search?type=${rt.type}`)}
                  className={`bg-white border ${rt.border} rounded-xl p-4 text-left hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
                >
                  <div className={`w-9 h-9 rounded-lg ${rt.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{rt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rt.count} resources</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools */}
        <div>
          <h2 className="text-slate-800 mb-3">Quick Tools</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/learning")}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-left hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium">Learning & Quiz</p>
                  <p className="text-xs text-slate-500">Generate adaptive quizzes</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </button>
            <button
              onClick={() => navigate("/research")}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-left hover:shadow-md hover:border-teal-200 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <FlaskConical className="w-4.5 h-4.5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium">Research Support</p>
                  <p className="text-xs text-slate-500">AI-powered analysis</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
              </div>
            </button>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span className="text-sm text-teal-700 font-medium">AI Summary</span>
                <span className="text-xs bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded-full">New</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">Summarize any article instantly with our clinical AI assistant</p>
              <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors">
                Try it now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Weekly activity */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-800">Weekly Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Searches & reads this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-500">Searches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="text-slate-500">Reads</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#475569", fontWeight: 500 }}
              />
              <Area type="monotone" dataKey="searches" stroke="#2563EB" strokeWidth={2} fill="url(#colorSearches)" />
              <Area type="monotone" dataKey="reads" stroke="#0D9488" strokeWidth={2} fill="url(#colorReads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Searches */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800">Recent Searches</h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {RECENT_SEARCHES.map((q, i) => (
              <button
                key={i}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-left transition-colors group"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 line-clamp-2 transition-colors">{q}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/search")}
            className="mt-3 w-full text-center text-xs text-blue-600 hover:text-blue-700 py-1 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View search history
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trending */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-slate-800">Trending in Internal Medicine</h3>
            </div>
            <button onClick={() => navigate("/search")} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {TRENDING.map((item, index) => (
              <button
                key={item.id}
                onClick={() => navigate(`/resource/${item.id}`)}
                className="w-full flex items-start gap-3 p-4 hover:bg-slate-50 text-left transition-colors group"
              >
                <span className="text-lg text-slate-300 font-semibold w-6 flex-shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.typeColor}`}>{item.type}</span>
                    <span className="text-xs text-slate-400">{item.journal}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 group-hover:text-slate-900 line-clamp-2 transition-colors">{item.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{item.reads} reads</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recently Viewed + Recommendation */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-slate-800">Recently Viewed</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {RECENTLY_VIEWED.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/resource/${item.id}`)}
                    className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 text-left transition-colors group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 group-hover:text-slate-900 line-clamp-2">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">CME Credit Tracker</span>
            </div>
            <p className="text-white text-xl font-semibold mb-0.5">18 / 50 CME</p>
            <p className="text-blue-200 text-xs mb-3">Credits earned this year</p>
            <div className="bg-blue-800/40 rounded-full h-2 mb-3">
              <div className="bg-teal-400 h-2 rounded-full" style={{ width: "36%" }} />
            </div>
            <button className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-colors w-full">
              View CME Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
