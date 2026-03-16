import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookmarkCheck,
  Bookmark,
  Download,
  Share2,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Tag,
  Quote,
  ChevronRight,
  FileText,
  ClipboardList,
  BookOpen,
  Stethoscope,
  MessageSquare,
  GraduationCap,
  FlaskConical,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Link2,
  Info,
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
  tags: ["Heart Failure", "HFrEF", "HFpEF", "Guideline", "SGLT2 inhibitors", "Cardiomyopathy"],
  specialty: "Cardiology",
  evidence_level: "Clinical Practice Guideline",
  abstract: `This focused update to the 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure addresses emerging data and new treatments across the spectrum of heart failure subtypes. Key updates include expanded indications for SGLT2 inhibitors (empagliflozin and dapagliflozin) in all symptomatic patients with HFrEF regardless of diabetic status, updated device therapy recommendations including expanded criteria for ICD implantation, and new guidance on the use of finerenone in HFpEF patients with diabetes and chronic kidney disease.

The guideline now formally incorporates the four pillars of guideline-directed medical therapy (GDMT) for HFrEF: ACE-I/ARB/ARNI, beta-blocker, MRA, and SGLT2 inhibitor. Practitioners are encouraged to initiate all four classes simultaneously in appropriate patients, with dose titration following initiation.`,
  sections: [
    {
      id: "s1",
      title: "1. Introduction and Evidence Review Methodology",
      content: "This guideline was developed by the Writing Committee using evidence grading methodology consistent with the ACC/AHA Clinical Practice Guideline methodology. Class I recommendations indicate that benefits strongly outweigh risks (should be performed). Class IIa recommendations indicate that benefits outweigh risks (is reasonable). Class IIb indicates that benefits may outweigh risks (may be considered). Class III recommendations indicate that risks outweigh benefits (no benefit or harm).",
    },
    {
      id: "s2",
      title: "2. Definition, Classification, and Staging of Heart Failure",
      content: "Heart failure is a clinical syndrome resulting from structural or functional cardiac abnormality that impairs ventricular filling or ejection. The universal definition emphasizes hemodynamic, structural, and symptomatic criteria. HF is staged using the A-D classification (at risk → pre-HF → symptomatic HF → advanced HF). LVEF categories include HFrEF (EF ≤40%), HFmrEF (EF 41-49%), and HFpEF (EF ≥50%).",
    },
    {
      id: "s3",
      title: "3. Guideline-Directed Medical Therapy for HFrEF",
      content: "For patients with HFrEF (LVEF ≤40%) with NYHA Class II-IV symptoms: (1) ARNI (sacubitril-valsartan) is recommended over ACE-I or ARB (Class I, Level A); (2) Evidence-based beta-blocker (carvedilol, metoprolol succinate, bisoprolol) is recommended (Class I, Level A); (3) MRA (spironolactone or eplerenone) is recommended in patients with NYHA II-IV who are tolerating ACEI/ARB/ARNI (Class I, Level A); (4) SGLT2 inhibitor (dapagliflozin or empagliflozin) is recommended to reduce HF hospitalization and cardiovascular death (Class I, Level A).",
    },
    {
      id: "s4",
      title: "4. Device Therapy",
      content: "ICD implantation is recommended for primary prevention of sudden cardiac death in patients with symptomatic HF (NYHA II-III) and LVEF ≤35% on GDMT for ≥3 months, with expected survival >1 year. CRT is recommended for patients with LVEF ≤35%, sinus rhythm, LBBB with QRS ≥150ms, and NYHA class II-III (Class I, Level A).",
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
  { id: "1", title: "Empagliflozin and Outcomes in Heart Failure with Preserved Ejection Fraction", type: "paper", journal: "NEJM" },
  { id: "3", title: "Sacubitril-Valsartan vs. Enalapril in Heart Failure: PARADIGM-HF Trial", type: "paper", journal: "NEJM" },
  { id: "4", title: "Harrison's – Chapter 56: Heart Failure and Cor Pulmonale", type: "textbook", journal: "Harrison's 22e" },
  { id: "5", title: "ESC 2021 Guidelines on Heart Failure", type: "guideline", journal: "European Heart Journal" },
];

const TYPE_COLORS: Record<string, string> = {
  guideline: "bg-teal-100 text-teal-700",
  paper: "bg-violet-100 text-violet-700",
  textbook: "bg-blue-100 text-blue-700",
  case: "bg-amber-100 text-amber-700",
};

const TYPE_ICONS: Record<string, any> = {
  guideline: ClipboardList,
  paper: FileText,
  textbook: BookOpen,
  case: Stethoscope,
};

export function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(true);
  const [activeSection, setActiveSection] = useState("abstract");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["s1", "s2"]));
  const [copied, setCopied] = useState(false);
  const [showCiteModal, setShowCiteModal] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Vancouver = `Heidenreich PA, Bozkurt B, Aguilar D, et al. 2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure. J Am Coll Cardiol. 2023;81(17):e123-e202. doi:10.1016/j.jacc.2021.12.012`;
  const APA = `Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2023). 2023 ACC/AHA Guideline for the Diagnosis and Management of Heart Failure. Journal of the American College of Cardiology, 81(17), e123–e202.`;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <button onClick={() => navigate("/")} className="hover:text-blue-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate("/search")} className="hover:text-blue-600 transition-colors">Search</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 truncate max-w-xs">2023 ACC/AHA Heart Failure Guideline</span>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-5 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to results
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main article */}
        <div className="xl:col-span-3">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[ARTICLE.type]}`}>
                  {ARTICLE.evidence_level}
                </span>
                {ARTICLE.open_access && (
                  <span className="text-xs bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full border border-teal-100">Open Access</span>
                )}
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{ARTICLE.specialty}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2 rounded-lg transition-colors ${saved ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:bg-slate-100"}`}
                >
                  {saved ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <Share2 className="w-4.5 h-4.5" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <Download className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <h1 className="text-slate-800 mb-3 leading-snug">{ARTICLE.title}</h1>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-slate-500">
              {ARTICLE.authors.slice(0, 3).map((author, i) => (
                <button key={i} className="text-teal-600 hover:text-teal-700 hover:underline text-sm transition-colors">
                  {author}
                </button>
              ))}
              {ARTICLE.authors.length > 3 && (
                <span className="text-slate-400">+{ARTICLE.authors.length - 3} more</span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-teal-600">{ARTICLE.journal}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{ARTICLE.year} · Vol. {ARTICLE.volume} · pp. {ARTICLE.pages}</span>
              </div>
              {ARTICLE.doi && (
                <div className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`https://doi.org/${ARTICLE.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {ARTICLE.doi}
                  </a>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <Users className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{ARTICLE.citations.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Citations</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <Star className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{ARTICLE.impact_factor}</p>
                  <p className="text-xs text-slate-500">Impact Factor</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <Info className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{ARTICLE.evidence_level}</p>
                  <p className="text-xs text-slate-500">Evidence Type</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {ARTICLE.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {["abstract", "full-text", "references", "similar"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`px-5 py-3.5 text-sm capitalize whitespace-nowrap transition-colors border-b-2 ${
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
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">AI Clinical Summary</p>
                        <p className="text-sm text-blue-600 leading-relaxed">
                          This 2023 ACC/AHA guideline update formally establishes 4-pillar GDMT for HFrEF: ARNI + beta-blocker + MRA + SGLT2i. SGLT2 inhibitors (dapagliflozin, empagliflozin) now carry Class I recommendation for all HFrEF patients regardless of diabetes status, reducing HF hospitalizations and CV death.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-slate-800 mb-3">Abstract</h3>
                  {ARTICLE.abstract.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              )}

              {activeSection === "full-text" && (
                <div>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700">Full text available via institutional access. Showing structured section summaries.</p>
                  </div>
                  <div className="space-y-2">
                    {ARTICLE.sections.map((section) => (
                      <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <h4 className="text-slate-800 pr-4">{section.title}</h4>
                          {expandedSections.has(section.id) ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {expandedSections.has(section.id) && (
                          <div className="px-4 pb-4 border-t border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed pt-3">{section.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "references" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800">References ({ARTICLE.references.length})</h3>
                    <button
                      onClick={() => setShowCiteModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Quote className="w-3.5 h-3.5" /> Cite this article
                    </button>
                  </div>
                  <ol className="space-y-3">
                    {ARTICLE.references.map((ref, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <span className="text-xs text-slate-400 font-mono w-6 flex-shrink-0 mt-0.5">{i + 1}.</span>
                        <p className="text-sm text-slate-600 leading-relaxed flex-1">{ref}</p>
                        <button className="flex-shrink-0 p-1 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeSection === "similar" && (
                <div>
                  <h3 className="text-slate-800 mb-4">Similar & Related Resources</h3>
                  <div className="space-y-3">
                    {RELATED.map((item) => {
                      const Icon = TYPE_ICONS[item.type] || FileText;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(`/resource/${item.id}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-left transition-all group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 group-hover:text-slate-900 line-clamp-2">{item.title}</p>
                            <p className="text-xs text-teal-600 mt-0.5">{item.journal}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-slate-700 mb-3 text-sm font-medium">Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/learning?topic=heart-failure")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                Generate Quiz from Article
              </button>
              <button
                onClick={() => navigate("/research")}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-teal-50 text-teal-700 rounded-lg text-sm hover:bg-teal-100 transition-colors border border-teal-100"
              >
                <FlaskConical className="w-4 h-4" />
                Analyze with AI
              </button>
              <button
                onClick={() => setShowCiteModal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <Quote className="w-4 h-4" />
                Cite Article
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                <MessageSquare className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Article info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-slate-700 mb-3 text-sm font-medium">Publication Details</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ISSN</span>
                <span className="text-slate-700 font-mono">{ARTICLE.issn}</span>
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
                <span className="text-amber-600 font-medium">{ARTICLE.impact_factor}</span>
              </div>
            </div>
          </div>

          {/* Related topics */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="text-slate-700 mb-3 text-sm font-medium">Related Topics</h4>
            <div className="flex flex-wrap gap-1.5">
              {["Heart Failure", "SGLT2 Inhibitors", "Cardiomyopathy", "Cardiac Resynchronization", "ICD Therapy", "BNP/NT-proBNP", "ARNI"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(topic)}`)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      {showCiteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800 flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue-600" /> Cite this Article
              </h3>
              <button onClick={() => setShowCiteModal(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Vancouver / NLM</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                  {Vancouver}
                </div>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 mt-1.5">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">APA 7th</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                  {APA}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors">
                  Export to Zotero
                </button>
                <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm hover:bg-slate-200 transition-colors">
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
