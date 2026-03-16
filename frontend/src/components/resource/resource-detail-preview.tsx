"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Info,
  Lightbulb,
  Link2,
  MessageSquare,
  Quote,
  Share2,
  Star,
  Stethoscope,
  Tag,
  Users,
} from "lucide-react";

const ARTICLE = {
  id: "2",
  type: "guideline",
  title: "2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure",
  authors: [
    "Paul A. Heidenreich, MD, MS",
    "Biykem Bozkurt, MD, PhD",
    "David Aguilar, MD, MS",
    "Larry A. Allen, MD, MHS",
    "Jai Anand, PhD",
    "Mamas A. Mamas, BMBCh, MA, DPhil",
  ],
  journal: "Journal of the American College of Cardiology",
  year: 2023,
  volume: "81(17)",
  pages: "e123-e202",
  doi: "10.1016/j.jacc.2021.12.012",
  issn: "0735-1097",
  impact_factor: 24.9,
  citations: 9340,
  open_access: false,
  tags: [
    "Heart Failure",
    "HFrEF",
    "HFpEF",
    "Guideline",
    "SGLT2 inhibitors",
    "Cardiomyopathy",
  ],
  specialty: "Cardiology",
  evidence_level: "Clinical Practice Guideline",
  abstract: `This focused update to the 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure addresses emerging data and new treatments across the spectrum of heart failure subtypes. Key updates include expanded indications for SGLT2 inhibitors (empagliflozin and dapagliflozin) in all symptomatic patients with HFrEF regardless of diabetic status, updated device therapy recommendations including expanded criteria for ICD implantation, and new guidance on the use of finerenone in HFpEF patients with diabetes and chronic kidney disease.

The guideline now formally incorporates the four pillars of guideline-directed medical therapy (GDMT) for HFrEF: ACE-I/ARB/ARNI, beta-blocker, MRA, and SGLT2 inhibitor. Practitioners are encouraged to initiate all four classes simultaneously in appropriate patients, with dose titration following initiation.`,
  sections: [
    {
      id: "s1",
      title: "1. Introduction and Evidence Review Methodology",
      content:
        "This guideline was developed by the Writing Committee using evidence grading methodology consistent with the ACC/AHA Clinical Practice Guideline methodology. Class I recommendations indicate that benefits strongly outweigh risks (should be performed). Class IIa recommendations indicate that benefits outweigh risks (is reasonable). Class IIb indicates that benefits may outweigh risks (may be considered). Class III recommendations indicate that risks outweigh benefits (no benefit or harm).",
    },
    {
      id: "s2",
      title: "2. Definition, Classification, and Staging of Heart Failure",
      content:
        "Heart failure is a clinical syndrome resulting from structural or functional cardiac abnormality that impairs ventricular filling or ejection. The universal definition emphasizes hemodynamic, structural, and symptomatic criteria. HF is staged using the A-D classification (at risk → pre-HF → symptomatic HF → advanced HF). LVEF categories include HFrEF (EF ≤40%), HFmrEF (EF 41-49%), and HFpEF (EF ≥50%).",
    },
    {
      id: "s3",
      title: "3. Guideline-Directed Medical Therapy for HFrEF",
      content:
        "For patients with HFrEF (LVEF ≤40%) with NYHA Class II-IV symptoms: (1) ARNI (sacubitril-valsartan) is recommended over ACE-I or ARB (Class I, Level A); (2) Evidence-based beta-blocker (carvedilol, metoprolol succinate, bisoprolol) is recommended (Class I, Level A); (3) MRA (spironolactone or eplerenone) is recommended in patients with NYHA II-IV who are tolerating ACEI/ARB/ARNI (Class I, Level A); (4) SGLT2 inhibitor (dapagliflozin or empagliflozin) is recommended to reduce HF hospitalization and cardiovascular death (Class I, Level A).",
    },
    {
      id: "s4",
      title: "4. Device Therapy",
      content:
        "ICD implantation is recommended for primary prevention of sudden cardiac death in patients with symptomatic HF (NYHA II-III) and LVEF ≤35% on GDMT for ≥3 months, with expected survival >1 year. CRT is recommended for patients with LVEF ≤35%, sinus rhythm, LBBB with QRS ≥150ms, and NYHA class II-III (Class I, Level A).",
    },
  ],
  references: [
    "McMurray JJ, et al. Angiotensin–neprilysin inhibition versus enalapril in heart failure. NEJM 2014.",
    "Zinman B, et al. Empagliflozin, cardiovascular outcomes, and mortality in type 2 diabetes. NEJM 2015.",
    "McMurray JJV, et al. Dapagliflozin in patients with heart failure and reduced ejection fraction. NEJM 2019.",
    "Packer M, et al. Cardiovascular and renal outcomes with empagliflozin in heart failure. NEJM 2020.",
    "Anker SD, et al. Empagliflozin in heart failure with a preserved ejection fraction. NEJM 2021.",
  ],
};

const RELATED = [
  {
    id: "1",
    title: "Empagliflozin and Outcomes in Heart Failure with Preserved Ejection Fraction",
    type: "paper",
    journal: "NEJM",
  },
  {
    id: "3",
    title: "Sacubitril-Valsartan vs. Enalapril in Heart Failure: PARADIGM-HF Trial",
    type: "paper",
    journal: "NEJM",
  },
  {
    id: "4",
    title: "Harrison's – Chapter 56: Heart Failure and Cor Pulmonale",
    type: "textbook",
    journal: "Harrison's 22e",
  },
  {
    id: "5",
    title: "ESC 2021 Guidelines on Heart Failure",
    type: "guideline",
    journal: "European Heart Journal",
  },
];

const TYPE_COLORS: Record<string, string> = {
  guideline: "bg-teal-100 text-teal-700",
  paper: "bg-violet-100 text-violet-700",
  textbook: "bg-blue-100 text-blue-700",
  case: "bg-amber-100 text-amber-700",
};

const TYPE_ICONS: Record<string, typeof FileText> = {
  guideline: ClipboardList,
  paper: FileText,
  textbook: BookOpen,
  case: Stethoscope,
};

export function ResourceDetailPreview({
  resourceId,
}: {
  resourceId: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState("abstract");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["s1", "s2"]),
  );
  const [copied, setCopied] = useState(false);
  const [showCiteModal, setShowCiteModal] = useState(false);

  const navigate = (href: string | number) => {
    if (typeof href === "number") {
      router.back();
      return;
    }

    router.push(href);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((previous) => {
      const next = new Set(previous);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const Vancouver = `Heidenreich PA, Bozkurt B, Aguilar D, et al. 2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure. J Am Coll Cardiol. 2023;81(17):e123-e202. doi:10.1016/j.jacc.2021.12.012`;
  const APA = `Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2023). 2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure. Journal of the American College of Cardiology, 81(17), e123–e202.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(Vancouver);
    } catch {}

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div key={resourceId} className="mx-auto max-w-7xl p-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="transition-colors hover:text-blue-600"
        >
          Home
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="transition-colors hover:text-blue-600"
        >
          Search
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="max-w-xs truncate text-slate-800">
          2023 ACC/AHA Heart Failure Guideline
        </span>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group mb-5 flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to results
      </button>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_COLORS[ARTICLE.type]}`}
                >
                  {ARTICLE.evidence_level}
                </span>
                {ARTICLE.open_access && (
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs text-teal-600">
                    Open Access
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {ARTICLE.specialty}
                </span>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className={`rounded-lg p-2 transition-colors ${saved ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-100"}`}
                >
                  {saved ? (
                    <BookmarkCheck className="h-[18px] w-[18px]" />
                  ) : (
                    <Bookmark className="h-[18px] w-[18px]" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <Share2 className="h-[18px] w-[18px]" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <Download className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            <h1 className="mb-3 leading-snug text-slate-800">{ARTICLE.title}</h1>

            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              {ARTICLE.authors.slice(0, 3).map((author) => (
                <button
                  key={author}
                  type="button"
                  className="text-sm text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                >
                  {author}
                </button>
              ))}
              {ARTICLE.authors.length > 3 && (
                <span className="text-slate-400">
                  +{ARTICLE.authors.length - 3} more
                </span>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-teal-600">{ARTICLE.journal}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {ARTICLE.year} · Vol. {ARTICLE.volume} · pp. {ARTICLE.pages}
                </span>
              </div>
              {ARTICLE.doi && (
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`https://doi.org/${ARTICLE.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {ARTICLE.doi}
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <Users className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {ARTICLE.citations.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Citations</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <Star className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {ARTICLE.impact_factor}
                  </p>
                  <p className="text-xs text-slate-500">Impact Factor</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <Info className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {ARTICLE.evidence_level}
                  </p>
                  <p className="text-xs text-slate-500">Evidence Type</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ARTICLE.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex overflow-x-auto border-b border-slate-100">
              {["abstract", "full-text", "references", "similar"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSection(tab)}
                  className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-sm capitalize transition-colors ${
                    activeSection === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeSection === "abstract" && (
                <div>
                  <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                      <div>
                        <p className="mb-1 text-sm font-medium text-blue-700">
                          AI Clinical Summary
                        </p>
                        <p className="text-sm leading-relaxed text-blue-600">
                          This 2023 ACC/AHA guideline update formally establishes
                          4-pillar GDMT for HFrEF: ARNI + beta-blocker + MRA +
                          SGLT2i. SGLT2 inhibitors (dapagliflozin,
                          empagliflozin) now carry Class I recommendation for
                          all HFrEF patients regardless of diabetes status,
                          reducing HF hospitalizations and CV death.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-3 text-slate-800">Abstract</h3>
                  {ARTICLE.abstract.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-3 text-sm leading-relaxed text-slate-600 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activeSection === "full-text" && (
                <div>
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                    <p className="text-xs text-amber-700">
                      Full text available via institutional access. Showing
                      structured section summaries.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {ARTICLE.sections.map((section) => (
                      <div
                        key={section.id}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
                        >
                          <h4 className="pr-4 text-slate-800">{section.title}</h4>
                          {expandedSections.has(section.id) ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.has(section.id) && (
                          <div className="border-t border-slate-100 px-4 pb-4">
                            <p className="pt-3 text-sm leading-relaxed text-slate-600">
                              {section.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "references" && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-slate-800">
                      References ({ARTICLE.references.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCiteModal(true)}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <Quote className="h-3.5 w-3.5" /> Cite this article
                    </button>
                  </div>
                  <ol className="space-y-3">
                    {ARTICLE.references.map((reference, index) => (
                      <li
                        key={index}
                        className="group flex items-start gap-3"
                      >
                        <span className="mt-0.5 w-6 flex-shrink-0 font-mono text-xs text-slate-400">
                          {index + 1}.
                        </span>
                        <p className="flex-1 text-sm leading-relaxed text-slate-600">
                          {reference}
                        </p>
                        <button
                          type="button"
                          className="flex-shrink-0 p-1 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:text-blue-500"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeSection === "similar" && (
                <div>
                  <h3 className="mb-4 text-slate-800">
                    Similar & Related Resources
                  </h3>
                  <div className="space-y-3">
                    {RELATED.map((item) => {
                      const Icon = TYPE_ICONS[item.type] || FileText;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigate(`/resource/${item.id}`)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all hover:border-blue-200 hover:bg-slate-50"
                        >
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLORS[item.type]}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm text-slate-700 group-hover:text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-teal-600">
                              {item.journal}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-medium text-slate-700">Actions</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/learning?topic=heart-failure")}
                className="flex w-full items-center gap-2.5 rounded-lg bg-blue-600 px-3 py-2.5 text-sm text-white transition-colors hover:bg-blue-700"
              >
                <GraduationCap className="h-4 w-4" />
                Generate Quiz from Article
              </button>
              <button
                type="button"
                onClick={() => navigate("/research")}
                className="flex w-full items-center gap-2.5 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2.5 text-sm text-teal-700 transition-colors hover:bg-teal-100"
              >
                <FlaskConical className="h-4 w-4" />
                Analyze with AI
              </button>
              <button
                type="button"
                onClick={() => setShowCiteModal(true)}
                className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Quote className="h-4 w-4" />
                Cite Article
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100"
              >
                <MessageSquare className="h-4 w-4" />
                Add Note
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-medium text-slate-700">
              Publication Details
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ISSN</span>
                <span className="font-mono text-slate-700">{ARTICLE.issn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volume/Issue</span>
                <span className="text-slate-700">{ARTICLE.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pages</span>
                <span className="text-slate-700">{ARTICLE.pages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Year</span>
                <span className="text-slate-700">{ARTICLE.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Impact Factor</span>
                <span className="font-medium text-amber-600">
                  {ARTICLE.impact_factor}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 text-sm font-medium text-slate-700">
              Related Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Heart Failure",
                "SGLT2 Inhibitors",
                "Cardiomyopathy",
                "Cardiac Resynchronization",
                "ICD Therapy",
                "BNP/NT-proBNP",
                "ARNI",
              ].map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(topic)}`)
                  }
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-slate-800">
                <Quote className="h-5 w-5 text-blue-600" /> Cite this Article
              </h3>
              <button
                type="button"
                onClick={() => setShowCiteModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Vancouver / NLM
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                  {Vancouver}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  APA 7th
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                  {APA}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  Export to Zotero
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-slate-100 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Export RIS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
