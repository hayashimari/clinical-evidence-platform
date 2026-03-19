"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Dna,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Microscope,
  Search,
  SlidersHorizontal,
  Star,
  Stethoscope,
  Users,
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

const SPECIALTIES = [
  "Internal Medicine",
  "Cardiology",
  "Neurology",
  "Oncology",
  "Infectious Disease",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
];

const EVIDENCE_LEVELS = [
  { label: "Level I – RCT Meta-analysis", count: 1240 },
  { label: "Level II – Individual RCT", count: 4820 },
  { label: "Level III – Cohort Study", count: 8340 },
  { label: "Level IV – Case-control", count: 6120 },
  { label: "Level V – Expert Opinion", count: 2180 },
];

const SOURCES = [
  "PubMed/MEDLINE",
  "Cochrane Library",
  "UpToDate",
  "ClinicalKey",
  "DynaMed",
  "WHO",
  "CDC",
  "AHA/ACC",
  "ESC",
];

const MOCK_RESULTS = [
  {
    id: "1",
    type: "paper",
    title:
      "Efficacy and Safety of Semaglutide 2.4 mg vs. Placebo in Adults with Overweight or Obesity: STEP 1 Trial Results",
    authors: "Wilding JPH, Batterham RL, Calanna S, et al.",
    journal: "New England Journal of Medicine",
    year: 2021,
    volume: "384(11)",
    pages: "989-1002",
    doi: "10.1056/NEJMoa2032183",
    abstract:
      "In this 68-week, randomized, double-blind trial, participants with a BMI ≥30 received semaglutide 2.4mg once weekly or placebo. The mean change in body weight was −14.9% with semaglutide versus −2.4% with placebo...",
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
    abstract:
      "This guideline provides recommendations for the evaluation and management of adult patients with heart failure. Key updates include expanded use of SGLT2 inhibitors across HF subtypes and updated device therapy indications...",
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
    title:
      "Atypical Presentation of Anti-NMDA Receptor Encephalitis with Prominent Psychiatric Features in a 28-Year-Old Female",
    authors: "Martinez-Hernandez E, Rosenfeld MR, Dalmau J",
    journal: "BMJ Case Reports",
    year: 2024,
    volume: "17(3)",
    pages: "e258441",
    doi: "10.1136/bcr-2024-258441",
    abstract:
      "We report a case of anti-NMDA receptor encephalitis presenting with acute psychosis and behavioral changes in a young female. Initial psychiatric admission delayed diagnosis by 6 weeks. MRI was unremarkable; CSF analysis revealed lymphocytic pleocytosis...",
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
    title:
      "Harrison's Principles of Internal Medicine – Chapter 48: Diabetes Mellitus: Management and Complications",
    authors: "Powers AC, Stafford JM, Rickels MR",
    journal: "Harrison's Principles of Internal Medicine, 22nd Ed.",
    year: 2024,
    volume: "Chapter 48",
    pages: "2850-2902",
    doi: null,
    abstract:
      "Comprehensive overview of diabetes management including glycemic targets, pharmacological agents (metformin, GLP-1 agonists, SGLT2 inhibitors, insulin regimens), and prevention and treatment of microvascular and macrovascular complications...",
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
    abstract:
      "In patients stabilized after acute MI with reduced ejection fraction or new onset HF, empagliflozin 10mg daily did not significantly reduce the primary composite of hospitalization for HF or all-cause death at 18 months...",
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
    title:
      "Novel Biomarkers for Early Detection of Acute Kidney Injury in ICU Patients: Results from BIOMARK-ICU Study",
    authors: "Kidney Disease: Improving Global Outcomes (KDIGO)",
    journal: "ASN Kidney Week 2024",
    year: 2024,
    volume: "Oral Presentation",
    pages: "Abstract #FR-OR22",
    doi: null,
    abstract:
      "Presentation of the BIOMARK-ICU prospective multicenter study evaluating NGAL, KIM-1, and novel urinary biomarkers for early AKI detection in 2,400 ICU patients across 12 centers...",
    tags: ["AKI", "Biomarkers", "ICU", "Nephrology"],
    evidenceLevel: "Level III",
    citations: 0,
    impact: null,
    saved: false,
    open_access: true,
  },
];

export function SearchWorkspace() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Diabetes GLP-1 management";
  const initialType = searchParams.get("type") || "all";

  return (
    <SearchWorkspaceContent
      key={`${query}:${initialType}`}
      query={query}
      initialType={initialType}
    />
  );
}

function SearchWorkspaceContent({
  query,
  initialType,
}: {
  query: string;
  initialType: string;
}) {
  const router = useRouter();

  const [activeType, setActiveType] = useState(initialType);
  const [searchInput, setSearchInput] = useState(query);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set(["2"]));
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(
    new Set(),
  );
  const [selectedEvidenceLevels, setSelectedEvidenceLevels] =
    useState<Set<string>>(new Set());
  const [yearFrom, setYearFrom] = useState("2020");
  const [yearTo, setYearTo] = useState("2025");
  const [expandedFilters, setExpandedFilters] = useState({
    specialty: true,
    evidence: true,
    date: true,
    source: false,
  });

  const buildSearchHref = (nextQuery: string, nextType = activeType) => {
    const params = new URLSearchParams();

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextType !== "all") {
      params.set("type", nextType);
    }

    const nextParams = params.toString();
    return nextParams ? `/search?${nextParams}` : "/search";
  };

  const toggleSaved = (id: string) => {
    setSavedItems((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredResults = MOCK_RESULTS.filter((result) =>
    activeType === "all" ? true : result.type === activeType,
  );

  const typeCounts = Object.keys(RESOURCE_TYPE_CONFIG).reduce(
    (counts, type) => {
      counts[type] =
        type === "all"
          ? MOCK_RESULTS.length
          : MOCK_RESULTS.filter((result) => result.type === type).length;
      return counts;
    },
    {} as Record<string, number>,
  );

  const toggleFilter = (
    currentSet: Set<string>,
    value: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    const next = new Set(currentSet);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setter(next);
  };

  const typeConfig = (type: string) =>
    RESOURCE_TYPE_CONFIG[type as keyof typeof RESOURCE_TYPE_CONFIG] ||
    RESOURCE_TYPE_CONFIG.paper;

  return (
    <div className="flex h-full">
      <aside
        className={`${showFilters ? "w-64" : "w-0"} hidden flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white transition-all duration-300 md:block`}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-slate-800">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" /> Filters
            </h3>
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              className="mb-2 flex w-full items-center justify-between"
              onClick={() =>
                setExpandedFilters((previous) => ({
                  ...previous,
                  date: !previous.date,
                }))
              }
            >
              <span className="text-sm font-medium text-slate-700">
                Publication Year
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expandedFilters.date ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.date && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={yearFrom}
                  onChange={(event) => setYearFrom(event.target.value)}
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="number"
                  value={yearTo}
                  onChange={(event) => setYearTo(event.target.value)}
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="my-3 border-t border-slate-100" />

          <div className="mb-4">
            <button
              type="button"
              className="mb-2 flex w-full items-center justify-between"
              onClick={() =>
                setExpandedFilters((previous) => ({
                  ...previous,
                  specialty: !previous.specialty,
                }))
              }
            >
              <span className="text-sm font-medium text-slate-700">
                Specialty
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expandedFilters.specialty ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.specialty && (
              <div className="space-y-1.5">
                {SPECIALTIES.map((specialty) => (
                  <label
                    key={specialty}
                    className="group flex cursor-pointer items-center gap-2"
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        selectedSpecialties.has(specialty)
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300 group-hover:border-blue-400"
                      }`}
                      onClick={() =>
                        toggleFilter(
                          selectedSpecialties,
                          specialty,
                          setSelectedSpecialties,
                        )
                      }
                    >
                      {selectedSpecialties.has(specialty) && (
                        <Check className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                    <span className="text-xs text-slate-600 group-hover:text-slate-800">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="my-3 border-t border-slate-100" />

          <div className="mb-4">
            <button
              type="button"
              className="mb-2 flex w-full items-center justify-between"
              onClick={() =>
                setExpandedFilters((previous) => ({
                  ...previous,
                  evidence: !previous.evidence,
                }))
              }
            >
              <span className="text-sm font-medium text-slate-700">
                Evidence Level
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expandedFilters.evidence ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.evidence && (
              <div className="space-y-1.5">
                {EVIDENCE_LEVELS.map((evidenceLevel) => (
                  <label
                    key={evidenceLevel.label}
                    className="group flex cursor-pointer items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          selectedEvidenceLevels.has(evidenceLevel.label)
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300 group-hover:border-blue-400"
                        }`}
                        onClick={() =>
                          toggleFilter(
                            selectedEvidenceLevels,
                            evidenceLevel.label,
                            setSelectedEvidenceLevels,
                          )
                        }
                      >
                        {selectedEvidenceLevels.has(evidenceLevel.label) && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-slate-600 group-hover:text-slate-800">
                        {evidenceLevel.label}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {evidenceLevel.count.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="my-3 border-t border-slate-100" />

          <div className="mb-4">
            <button
              type="button"
              className="mb-2 flex w-full items-center justify-between"
              onClick={() =>
                setExpandedFilters((previous) => ({
                  ...previous,
                  source: !previous.source,
                }))
              }
            >
              <span className="text-sm font-medium text-slate-700">
                Source Database
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expandedFilters.source ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.source && (
              <div className="space-y-1.5">
                {SOURCES.map((source) => (
                  <label
                    key={source}
                    className="group flex cursor-pointer items-center gap-2"
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded border border-slate-300 transition-colors group-hover:border-blue-400" />
                    <span className="text-xs text-slate-600">{source}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="mb-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                router.push(buildSearchHref(searchInput));
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
              >
                <Filter className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="hide-scrollbar mb-4 flex items-center gap-1.5 overflow-x-auto pb-2">
            {Object.entries(RESOURCE_TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              const count = typeCounts[type] || 0;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveType(type);
                    router.push(buildSearchHref(searchInput, type));
                  }}
                  className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-all ${
                    activeType === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {config.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${activeType === type ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-800">
                <span className="font-semibold">24,820</span> results for{" "}
                <span className="text-blue-600">&quot;{query}&quot;</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Showing {filteredResults.length} curated results · Sorted by
                relevance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="citations">Most Cited</option>
                <option value="impact">Impact Factor</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredResults.map((result) => {
              const config = typeConfig(result.type);
              const Icon = config.icon;
              const isSaved = savedItems.has(result.id);

              return (
                <div
                  key={result.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${config.color}`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                        >
                          {config.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {result.evidenceLevel}
                        </span>
                        {result.open_access && (
                          <span className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs text-teal-600">
                            Open Access
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(`/resource/${result.id}`)}
                        className="group/title mb-1.5 block text-left"
                      >
                        <h4 className="leading-snug text-slate-800 transition-colors group-hover/title:text-blue-600">
                          {result.title}
                        </h4>
                      </button>
                      <p className="mb-2 text-xs text-slate-500">
                        {result.authors} ·{" "}
                        <span className="text-teal-600">{result.journal}</span> ·{" "}
                        {result.year}
                        {result.volume && ` · ${result.volume}`}
                        {result.pages && `, ${result.pages}`}
                      </p>
                      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {result.abstract}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-4">
                      {result.citations !== null && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {result.citations.toLocaleString()} citations
                          </span>
                        </div>
                      )}
                      {result.impact && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-xs text-slate-500">
                            IF: {result.impact}
                          </span>
                        </div>
                      )}
                      {result.doi && (
                        <a
                          href={`https://doi.org/${result.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-blue-600"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          DOI
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => router.push(`/resource/${result.id}`)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        View Details <ChevronRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(result.id)}
                        className={`rounded-lg p-1.5 transition-colors ${isSaved ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              disabled
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 248].map((page, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-8 w-8 rounded-lg text-sm transition-colors ${page === 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
