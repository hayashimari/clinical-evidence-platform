import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  ClipboardList,
  Stethoscope,
  Microscope,
  Dna,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  X,
  Star,
  Calendar,
  Users,
  Download,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
} from "lucide-react";

const RESOURCE_TYPE_CONFIG = {
  all: { label: "All Resources", icon: Search, color: "bg-slate-100 text-slate-600" },
  paper: { label: "Research Papers", icon: FileText, color: "bg-violet-100 text-violet-700" },
  guideline: { label: "Guidelines", icon: ClipboardList, color: "bg-teal-100 text-teal-700" },
  textbook: { label: "Textbooks", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
  case: { label: "Case Reports", icon: Stethoscope, color: "bg-amber-100 text-amber-700" },
  conference: { label: "Conference", icon: Microscope, color: "bg-pink-100 text-pink-700" },
  data: { label: "Research Data", icon: Dna, color: "bg-indigo-100 text-indigo-700" },
};

const SPECIALTIES = ["Internal Medicine", "Cardiology", "Neurology", "Oncology", "Infectious Disease", "Pulmonology", "Nephrology", "Endocrinology"];

const EVIDENCE_LEVELS = [
  { label: "Level I – RCT Meta-analysis", count: 1240 },
  { label: "Level II – Individual RCT", count: 4820 },
  { label: "Level III – Cohort Study", count: 8340 },
  { label: "Level IV – Case-control", count: 6120 },
  { label: "Level V – Expert Opinion", count: 2180 },
];

const SOURCES = ["PubMed/MEDLINE", "Cochrane Library", "UpToDate", "ClinicalKey", "DynaMed", "WHO", "CDC", "AHA/ACC", "ESC"];

const MOCK_RESULTS = [
  {
    id: "1",
    type: "paper",
    title: "Efficacy and Safety of Semaglutide 2.4 mg vs. Placebo in Adults with Overweight or Obesity: STEP 1 Trial Results",
    authors: "Wilding JPH, Batterham RL, Calanna S, et al.",
    journal: "New England Journal of Medicine",
    year: 2021,
    volume: "384(11)",
    pages: "989-1002",
    doi: "10.1056/NEJMoa2032183",
    abstract: "In this 68-week, randomized, double-blind trial, participants with a BMI ≥30 received semaglutide 2.4mg once weekly or placebo. The mean change in body weight was −14.9% with semaglutide versus −2.4% with placebo...",
    tags: ["GLP-1", "Obesity", "Semaglutide", "RCT"],
    evidenceLevel: "Level I",
    citations: 4820,
    impact: 91.2,
    saved: false,
    open_access: true,
  },
  {
    id: "2",
    type: "guideline",
    title: "2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure",
    authors: "Heidenreich PA, Bozkurt B, Aguilar D, et al.",
    journal: "Journal of the American College of Cardiology",
    year: 2023,
    volume: "81(17)",
    pages: "e123-e202",
    doi: "10.1016/j.jacc.2021.12.012",
    abstract: "This guideline provides recommendations for the evaluation and management of adult patients with heart failure. Key updates include expanded use of SGLT2 inhibitors across HF subtypes and updated device therapy indications...",
    tags: ["Heart Failure", "HFrEF", "Guideline", "SGLT2"],
    evidenceLevel: "Guideline",
    citations: 9340,
    impact: 24.9,
    saved: true,
    open_access: false,
  },
  {
    id: "3",
    type: "case",
    title: "Atypical Presentation of Anti-NMDA Receptor Encephalitis with Prominent Psychiatric Features in a 28-Year-Old Female",
    authors: "Martinez-Hernandez E, Rosenfeld MR, Dalmau J",
    journal: "BMJ Case Reports",
    year: 2024,
    volume: "17(3)",
    pages: "e258441",
    doi: "10.1136/bcr-2024-258441",
    abstract: "We report a case of anti-NMDA receptor encephalitis presenting with acute psychosis and behavioral changes in a young female. Initial psychiatric admission delayed diagnosis by 6 weeks. MRI was unremarkable; CSF analysis revealed lymphocytic pleocytosis...",
    tags: ["Encephalitis", "NMDAR", "Autoimmune", "Neurology"],
    evidenceLevel: "Level V",
    citations: 28,
    impact: null,
    saved: false,
    open_access: true,
  },
  {
    id: "4",
    type: "textbook",
    title: "Harrison's Principles of Internal Medicine – Chapter 48: Diabetes Mellitus: Management and Complications",
    authors: "Powers AC, Stafford JM, Rickels MR",
    journal: "Harrison's Principles of Internal Medicine, 22nd Ed.",
    year: 2024,
    volume: "Chapter 48",
    pages: "2850-2902",
    doi: null,
    abstract: "Comprehensive overview of diabetes management including glycemic targets, pharmacological agents (metformin, GLP-1 agonists, SGLT2 inhibitors, insulin regimens), and prevention and treatment of microvascular and macrovascular complications...",
    tags: ["Diabetes", "Endocrinology", "Pharmacology", "Textbook"],
    evidenceLevel: "Reference",
    citations: null,
    impact: null,
    saved: false,
    open_access: false,
  },
  {
    id: "5",
    type: "paper",
    title: "EMPACT-MI Trial: Empagliflozin in Patients with Acute Myocardial Infarction",
    authors: "Butler J, Jones WS, Udell JA, et al.",
    journal: "New England Journal of Medicine",
    year: 2024,
    volume: "390(15)",
    pages: "1455-1466",
    doi: "10.1056/NEJMoa2314213",
    abstract: "In patients stabilized after acute MI with reduced ejection fraction or new onset HF, empagliflozin 10mg daily did not significantly reduce the primary composite of hospitalization for HF or all-cause death at 18 months...",
    tags: ["SGLT2", "Myocardial Infarction", "Empagliflozin", "RCT"],
    evidenceLevel: "Level I",
    citations: 892,
    impact: 91.2,
    saved: false,
    open_access: false,
  },
  {
    id: "6",
    type: "conference",
    title: "Novel Biomarkers for Early Detection of Acute Kidney Injury in ICU Patients: Results from BIOMARK-ICU Study",
    authors: "Kidney Disease: Improving Global Outcomes (KDIGO)",
    journal: "ASN Kidney Week 2024",
    year: 2024,
    volume: "Oral Presentation",
    pages: "Abstract #FR-OR22",
    doi: null,
    abstract: "Presentation of the BIOMARK-ICU prospective multicenter study evaluating NGAL, KIM-1, and novel urinary biomarkers for early AKI detection in 2,400 ICU patients across 12 centers...",
    tags: ["AKI", "Biomarkers", "ICU", "Nephrology"],
    evidenceLevel: "Level III",
    citations: 0,
    impact: null,
    saved: false,
    open_access: true,
  },
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "Diabetes GLP-1 management";
  const initialType = searchParams.get("type") || "all";

  const [activeType, setActiveType] = useState(initialType);
  const [searchInput, setSearchInput] = useState(query);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set(["2"]));
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<Set<string>>(new Set());
  const [yearFrom, setYearFrom] = useState("2020");
  const [yearTo, setYearTo] = useState("2025");
  const [expandedFilters, setExpandedFilters] = useState({
    specialty: true,
    evidence: true,
    date: true,
    source: false,
  });

  const toggleSaved = (id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredResults = MOCK_RESULTS.filter((r) =>
    activeType === "all" ? true : r.type === activeType
  );

  const typeCounts = Object.keys(RESOURCE_TYPE_CONFIG).reduce((acc, type) => {
    acc[type] = type === "all" ? MOCK_RESULTS.length : MOCK_RESULTS.filter((r) => r.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  const toggleFilter = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const typeConfig = (type: string) => RESOURCE_TYPE_CONFIG[type as keyof typeof RESOURCE_TYPE_CONFIG] || RESOURCE_TYPE_CONFIG.paper;

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <aside className={`${showFilters ? "w-64" : "w-0"} flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 hidden md:block`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Filters
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-700">Clear all</button>
          </div>

          {/* Date Range */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full mb-2"
              onClick={() => setExpandedFilters((p) => ({ ...p, date: !p.date }))}
            >
              <span className="text-sm text-slate-700 font-medium">Publication Year</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedFilters.date ? "rotate-180" : ""}`} />
            </button>
            {expandedFilters.date && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="number"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 my-3" />

          {/* Specialty */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full mb-2"
              onClick={() => setExpandedFilters((p) => ({ ...p, specialty: !p.specialty }))}
            >
              <span className="text-sm text-slate-700 font-medium">Specialty</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedFilters.specialty ? "rotate-180" : ""}`} />
            </button>
            {expandedFilters.specialty && (
              <div className="space-y-1.5">
                {SPECIALTIES.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedSpecialties.has(s)
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300 group-hover:border-blue-400"
                      }`}
                      onClick={() => toggleFilter(selectedSpecialties, s, setSelectedSpecialties)}
                    >
                      {selectedSpecialties.has(s) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs text-slate-600 group-hover:text-slate-800">{s}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 my-3" />

          {/* Evidence Level */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full mb-2"
              onClick={() => setExpandedFilters((p) => ({ ...p, evidence: !p.evidence }))}
            >
              <span className="text-sm text-slate-700 font-medium">Evidence Level</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedFilters.evidence ? "rotate-180" : ""}`} />
            </button>
            {expandedFilters.evidence && (
              <div className="space-y-1.5">
                {EVIDENCE_LEVELS.map((ev) => (
                  <label key={ev.label} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          selectedEvidenceLevels.has(ev.label)
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-300 group-hover:border-blue-400"
                        }`}
                        onClick={() => toggleFilter(selectedEvidenceLevels, ev.label, setSelectedEvidenceLevels)}
                      >
                        {selectedEvidenceLevels.has(ev.label) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="text-xs text-slate-600 group-hover:text-slate-800">{ev.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{ev.count.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 my-3" />

          {/* Source */}
          <div className="mb-4">
            <button
              className="flex items-center justify-between w-full mb-2"
              onClick={() => setExpandedFilters((p) => ({ ...p, source: !p.source }))}
            >
              <span className="text-sm text-slate-700 font-medium">Source Database</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedFilters.source ? "rotate-180" : ""}`} />
            </button>
            {expandedFilters.source && (
              <div className="space-y-1.5">
                {SOURCES.map((src) => (
                  <label key={src} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-blue-400 flex items-center justify-center transition-colors">
                    </div>
                    <span className="text-xs text-slate-600">{src}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors mt-2">
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Search bar */}
          <div className="mb-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/search?q=${encodeURIComponent(searchInput)}`);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Resource type tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 hide-scrollbar">
            {Object.entries(RESOURCE_TYPE_CONFIG).map(([type, cfg]) => {
              const Icon = cfg.icon;
              const count = typeCounts[type] || 0;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                    activeType === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeType === type ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results meta */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-800">
                <span className="font-semibold">24,820</span> results for{" "}
                <span className="text-blue-600">"{query}"</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Showing {filteredResults.length} curated results · Sorted by relevance</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="citations">Most Cited</option>
                <option value="impact">Impact Factor</option>
              </select>
            </div>
          </div>

          {/* Results list */}
          <div className="space-y-3">
            {filteredResults.map((result) => {
              const cfg = typeConfig(result.type);
              const Icon = cfg.icon;
              const isSaved = savedItems.has(result.id);

              return (
                <div
                  key={result.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{result.evidenceLevel}</span>
                        {result.open_access && (
                          <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full border border-teal-100">Open Access</span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/resource/${result.id}`)}
                        className="text-left block mb-1.5 group/title"
                      >
                        <h4 className="text-slate-800 group-hover/title:text-blue-600 transition-colors leading-snug">
                          {result.title}
                        </h4>
                      </button>
                      <p className="text-xs text-slate-500 mb-2">
                        {result.authors} · <span className="text-teal-600">{result.journal}</span> · {result.year}
                        {result.volume && ` · ${result.volume}`}
                        {result.pages && `, ${result.pages}`}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">{result.abstract}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {result.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      {result.citations !== null && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">{result.citations.toLocaleString()} citations</span>
                        </div>
                      )}
                      {result.impact && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs text-slate-500">IF: {result.impact}</span>
                        </div>
                      )}
                      {result.doi && (
                        <a
                          href={`https://doi.org/${result.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                          DOI
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/resource/${result.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleSaved(result.id)}
                        className={`p-1.5 rounded-lg transition-colors ${isSaved ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40" disabled>
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 248].map((p, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-lg text-sm transition-colors ${p === 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
