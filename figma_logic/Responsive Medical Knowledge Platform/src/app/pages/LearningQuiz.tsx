import { useState } from "react";
import { useNavigate } from "react-router";
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  RotateCcw,
  BookOpen,
  Star,
  Trophy,
  Target,
  Brain,
  Zap,
  Clock,
  BarChart2,
  Lightbulb,
  ChevronDown,
  Play,
  Shuffle,
  ListChecks,
  BookMarked,
  ArrowRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TOPICS = [
  { id: "cardiology", label: "Cardiology", count: 340, icon: "❤️" },
  { id: "endocrinology", label: "Endocrinology", count: 218, icon: "🧬" },
  { id: "neurology", label: "Neurology", count: 285, icon: "🧠" },
  { id: "infectious", label: "Infectious Disease", count: 196, icon: "🔬" },
  { id: "pulmonology", label: "Pulmonology", count: 154, icon: "🫁" },
  { id: "nephrology", label: "Nephrology", count: 132, icon: "🏥" },
  { id: "oncology", label: "Oncology", count: 267, icon: "🧪" },
  { id: "gastro", label: "Gastroenterology", count: 178, icon: "💊" },
];

const QUESTIONS = [
  {
    id: 1,
    question: "A 68-year-old male with HFrEF (LVEF 30%) is currently on carvedilol, lisinopril, and spironolactone. His eGFR is 55 mL/min/1.73m². Which of the following treatments would MOST improve his prognosis?",
    options: [
      "Switch lisinopril to sacubitril-valsartan (ARNI)",
      "Add digoxin 0.125 mg daily",
      "Add empagliflozin 10 mg daily",
      "Increase carvedilol to maximum dose before adding any new medication",
      "Add hydralazine-nitrate combination",
    ],
    correct: 2,
    explanation: "Per 2023 ACC/AHA guidelines, SGLT2 inhibitors (empagliflozin or dapagliflozin) carry a Class I, Level A recommendation for all HFrEF patients to reduce HF hospitalizations and cardiovascular death, regardless of diabetes status. The patient is already on optimal neurohormonal therapy (beta-blocker, ACE-I, MRA), making SGLT2i the most impactful addition. His eGFR of 55 is above the threshold for empagliflozin initiation (≥20). While ARNI is also Class I, switching to sacubitril-valsartan is a different management choice and requires a 36-hour washout from ACE-I.",
    tags: ["Heart Failure", "SGLT2 Inhibitors", "HFrEF", "GDMT"],
    difficulty: "hard",
    source: "2023 ACC/AHA HF Guidelines",
    evidenceLevel: "Class I, Level A",
  },
  {
    id: 2,
    question: "A 52-year-old woman presents with 3 weeks of progressive confusion, behavioral changes, and new-onset seizures. MRI brain shows no acute pathology. CSF analysis shows mild lymphocytic pleocytosis with elevated protein. Which antibody is MOST likely responsible?",
    options: [
      "Anti-MOG (myelin oligodendrocyte glycoprotein)",
      "Anti-NMDA receptor antibody",
      "Anti-LGI1 antibody",
      "Anti-CASPR2 antibody",
      "Anti-GABA-B receptor antibody",
    ],
    correct: 1,
    explanation: "Anti-NMDA receptor encephalitis is the most common autoimmune encephalitis. It characteristically presents in young women with a prodrome followed by psychiatric symptoms, seizures, movement disorders, and autonomic instability. CSF typically shows lymphocytic pleocytosis. Anti-LGI1 encephalitis more commonly causes faciobrachial dystonic seizures and hyponatremia. Anti-CASPR2 typically presents in older males with Morvan syndrome or limbic encephalitis. MRI can be normal in anti-NMDAR encephalitis.",
    tags: ["Encephalitis", "Autoimmune Neurology", "NMDAR", "Neurology"],
    difficulty: "medium",
    source: "Dalmau J et al., Lancet Neurology 2023",
    evidenceLevel: "Expert Consensus",
  },
  {
    id: 3,
    question: "Which of the following BEST describes the mechanism of action of empagliflozin?",
    options: [
      "Stimulates insulin secretion from pancreatic beta cells",
      "Inhibits sodium-glucose cotransporter 2 in the proximal tubule",
      "Activates GLP-1 receptors in the hypothalamus",
      "Inhibits DPP-4 enzyme, increasing incretin levels",
      "Activates PPAR-gamma receptors in adipose tissue",
    ],
    correct: 1,
    explanation: "SGLT2 (sodium-glucose cotransporter 2) inhibitors work by blocking SGLT2 in the S1/S2 segment of the proximal renal tubule, which normally reabsorbs ~90% of filtered glucose. This leads to glycosuria, modest weight loss, and mild osmotic diuresis. Additional cardiorenal benefits include tubuloglomerular feedback restoration, reduced intraglomerular pressure, and mitochondrial efficiency. These mechanisms underlie their benefits in HF and CKD beyond glycemic control.",
    tags: ["SGLT2 Inhibitors", "Pharmacology", "Mechanism of Action"],
    difficulty: "easy",
    source: "Harrison's Principles of Internal Medicine, 22e",
    evidenceLevel: "Established Pharmacology",
  },
];

const PERFORMANCE_DATA = [
  { subject: "Cardiology", score: 82, fullMark: 100 },
  { subject: "Neurology", score: 68, fullMark: 100 },
  { subject: "Endocrinology", score: 91, fullMark: 100 },
  { subject: "Infectious Dis.", score: 74, fullMark: 100 },
  { subject: "Pulmonology", score: 78, fullMark: 100 },
  { subject: "Nephrology", score: 85, fullMark: 100 },
];

const HISTORY_DATA = [
  { week: "W1", score: 71 },
  { week: "W2", score: 74 },
  { week: "W3", score: 78 },
  { week: "W4", score: 82 },
  { week: "W5", score: 79 },
  { week: "W6", score: 85 },
];

const FLASHCARD_TOPICS = [
  { id: "f1", title: "Heart Failure GDMT Recommendations", cards: 24, progress: 67 },
  { id: "f2", title: "Autoimmune Encephalitis Antibodies", cards: 18, progress: 33 },
  { id: "f3", title: "SGLT2 Inhibitor Drug Class Overview", cards: 12, progress: 100 },
  { id: "f4", title: "Sepsis & Septic Shock Management", cards: 30, progress: 0 },
];

type QuizState = "select" | "quiz" | "result";

export function LearningQuiz() {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedTopic, setSelectedTopic] = useState("cardiology");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [activeTab, setActiveTab] = useState<"quiz" | "flashcards" | "stats">("quiz");
  const [quizMode, setQuizMode] = useState<"standard" | "timed" | "adaptive">("standard");
  const [questionCount, setQuestionCount] = useState(10);

  const question = QUESTIONS[currentQ];
  const correctCount = answers.filter((a, i) => a === QUESTIONS[i]?.correct).length;

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState("result");
    }
  };

  const handleRestart = () => {
    setQuizState("select");
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
  };

  const getDifficultyColor = (d: string) => {
    if (d === "easy") return "bg-teal-100 text-teal-700";
    if (d === "medium") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Learning & Quiz
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Adaptive quizzes generated from clinical resources</p>
        </div>
        {quizState === "quiz" && (
          <button onClick={handleRestart} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <X className="w-3.5 h-3.5" /> Exit Quiz
          </button>
        )}
      </div>

      {/* Tabs */}
      {quizState === "select" && (
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
          {(["quiz", "flashcards", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "quiz" ? "Quiz Mode" : tab === "flashcards" ? "Flashcards" : "My Stats"}
            </button>
          ))}
        </div>
      )}

      {/* QUIZ SELECT */}
      {quizState === "select" && activeTab === "quiz" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {/* Quiz config */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5">
              <h3 className="text-slate-800 mb-4">Configure Your Quiz</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {(["standard", "timed", "adaptive"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setQuizMode(mode)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      quizMode === mode ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {mode === "standard" && <ListChecks className="w-4 h-4 text-blue-600" />}
                      {mode === "timed" && <Clock className="w-4 h-4 text-amber-600" />}
                      {mode === "adaptive" && <Brain className="w-4 h-4 text-violet-600" />}
                      <span className="text-sm text-slate-700 font-medium capitalize">{mode}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {mode === "standard" && "Practice at your own pace"}
                      {mode === "timed" && "60 seconds per question"}
                      {mode === "adaptive" && "AI-adjusted difficulty"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-5">
                <div>
                  <label className="text-sm text-slate-600 mb-1.5 block">Questions</label>
                  <div className="flex items-center gap-2">
                    {[5, 10, 20, 30].map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={`w-10 h-9 rounded-lg text-sm border transition-all ${
                          questionCount === n ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1.5 block">Include</label>
                  <div className="flex items-center gap-2">
                    {["All", "Weak Areas", "Flagged"].map((opt) => (
                      <button
                        key={opt}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setQuizState("quiz")}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4" />
                Start {questionCount}-Question Quiz · {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}
              </button>
            </div>

            {/* Topic grid */}
            <h3 className="text-slate-800 mb-3">Select Topic Area</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedTopic === topic.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl mb-1.5 block">{topic.icon}</span>
                  <p className="text-sm text-slate-700 font-medium">{topic.label}</p>
                  <p className="text-xs text-slate-500">{topic.count} questions</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="text-slate-700 mb-3 text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" /> Recent Sessions
              </h4>
              <div className="space-y-2">
                {[
                  { topic: "Cardiology", score: 8, total: 10, date: "2h ago" },
                  { topic: "Neurology", score: 6, total: 10, date: "Yesterday" },
                  { topic: "Pharmacology", score: 9, total: 10, date: "3 days ago" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm text-slate-700">{s.topic}</p>
                      <p className="text-xs text-slate-400">{s.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${s.score / s.total >= 0.8 ? "text-teal-600" : s.score / s.total >= 0.6 ? "text-amber-600" : "text-red-500"}`}>
                        {s.score}/{s.total}
                      </p>
                      <p className="text-xs text-slate-400">{Math.round((s.score / s.total) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span className="text-sm text-teal-700 font-medium">Streak</span>
              </div>
              <p className="text-2xl text-slate-800 font-semibold">7 days 🔥</p>
              <p className="text-xs text-slate-500 mt-0.5">Keep it up! Quiz daily to retain more.</p>
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS TAB */}
      {quizState === "select" && activeTab === "flashcards" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Flashcard Decks</h3>
              <button className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                + New Deck
              </button>
            </div>
            <div className="space-y-3">
              {FLASHCARD_TOPICS.map((deck) => (
                <div key={deck.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BookMarked className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium">{deck.title}</p>
                        <p className="text-xs text-slate-500">{deck.cards} cards</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors">
                      <Play className="w-3 h-3" /> Study
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${deck.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{deck.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="text-slate-700 mb-3 text-sm font-medium">Generate from Article</h4>
              <p className="text-xs text-slate-500 mb-3">Paste a DOI or article URL to auto-generate flashcards using AI</p>
              <input
                placeholder="e.g. 10.1056/NEJMoa2032183"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Generate Flashcards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {quizState === "select" && activeTab === "stats" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-slate-800 mb-4">Performance by Specialty</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={PERFORMANCE_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                <Radar name="Score" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-slate-800 mb-4">Score Trend (6 Weeks)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={HISTORY_DATA} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Bar dataKey="score" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Questions", value: "487", icon: "📝" },
              { label: "Avg Score", value: "82%", icon: "📊" },
              { label: "Best Specialty", value: "Endo.", icon: "🏆" },
              { label: "Needs Review", value: "Neuro.", icon: "⚠️" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-xl text-slate-800 font-semibold">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ */}
      {quizState === "quiz" && question && (
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-slate-500 flex-shrink-0">
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {question.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{t}</span>
              ))}
              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            </div>

            <p className="text-slate-800 leading-relaxed mb-6">{question.question}</p>

            <div className="space-y-2.5">
              {question.options.map((option, idx) => {
                let btnClass = "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50";
                if (selectedAnswer !== null) {
                  if (idx === question.correct) btnClass = "border-teal-500 bg-teal-50 text-teal-800";
                  else if (idx === selectedAnswer && selectedAnswer !== question.correct)
                    btnClass = "border-red-400 bg-red-50 text-red-700";
                  else btnClass = "border-slate-200 text-slate-500 opacity-60";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${btnClass} ${selectedAnswer === null ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-medium">
                      {selectedAnswer !== null && idx === question.correct ? (
                        <Check className="w-3 h-3" />
                      ) : selectedAnswer === idx && idx !== question.correct ? (
                        <X className="w-3 h-3" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1.5">Clinical Explanation</p>
                  <p className="text-sm text-blue-600 leading-relaxed">{question.explanation}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-blue-500">
                    <span>📚 Source: {question.source}</span>
                    <span>· {question.evidenceLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next button */}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              {currentQ < QUESTIONS.length - 1 ? (
                <>Next Question <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>View Results <Trophy className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      )}

      {/* RESULTS */}
      {quizState === "result" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center mb-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-slate-800 mb-1">Quiz Complete!</h2>
            <p className="text-5xl font-bold text-blue-600 mb-1">{Math.round((correctCount / QUESTIONS.length) * 100)}%</p>
            <p className="text-slate-500 text-sm mb-5">{correctCount} correct out of {QUESTIONS.length} questions</p>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-xl font-semibold text-teal-600">{correctCount}</p>
                <p className="text-xs text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-red-500">{QUESTIONS.length - correctCount}</p>
                <p className="text-xs text-slate-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-slate-700">{QUESTIONS.length}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-slate-500 font-medium mb-2">TOPIC BREAKDOWN</p>
              {["Heart Failure", "Neurology", "Pharmacology"].map((t, i) => (
                <div key={t} className="flex items-center gap-3 mb-1.5 last:mb-0">
                  <span className="text-xs text-slate-600 w-28">{t}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${[100, 50, 100][i]}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-12 text-right">{[1, 0, 1][i]}/1</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleRestart} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm hover:bg-slate-200 transition-colors">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={() => navigate("/search")} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors">
                <BookOpen className="w-4 h-4" /> Review Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
