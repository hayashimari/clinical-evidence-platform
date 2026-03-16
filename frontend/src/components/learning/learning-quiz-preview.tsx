"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Clock,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Play,
  RotateCcw,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
    question:
      "A 68-year-old male with HFrEF (LVEF 30%) is currently on carvedilol, lisinopril, and spironolactone. His eGFR is 55 mL/min/1.73m². Which of the following treatments would MOST improve his prognosis?",
    options: [
      "Switch lisinopril to sacubitril-valsartan (ARNI)",
      "Add digoxin 0.125 mg daily",
      "Add empagliflozin 10 mg daily",
      "Increase carvedilol to maximum dose before adding any new medication",
      "Add hydralazine-nitrate combination",
    ],
    correct: 2,
    explanation:
      "Per 2023 ACC/AHA guidelines, SGLT2 inhibitors (empagliflozin or dapagliflozin) carry a Class I, Level A recommendation for all HFrEF patients to reduce HF hospitalizations and cardiovascular death, regardless of diabetes status. The patient is already on optimal neurohormonal therapy (beta-blocker, ACE-I, MRA), making SGLT2i the most impactful addition. His eGFR of 55 is above the threshold for empagliflozin initiation (≥20). While ARNI is also Class I, switching to sacubitril-valsartan is a different management choice and requires a 36-hour washout from ACE-I.",
    tags: ["Heart Failure", "SGLT2 Inhibitors", "HFrEF", "GDMT"],
    difficulty: "hard",
    source: "2023 ACC/AHA HF Guidelines",
    evidenceLevel: "Class I, Level A",
  },
  {
    id: 2,
    question:
      "A 52-year-old woman presents with 3 weeks of progressive confusion, behavioral changes, and new-onset seizures. MRI brain shows no acute pathology. CSF analysis shows mild lymphocytic pleocytosis with elevated protein. Which antibody is MOST likely responsible?",
    options: [
      "Anti-MOG (myelin oligodendrocyte glycoprotein)",
      "Anti-NMDA receptor antibody",
      "Anti-LGI1 antibody",
      "Anti-CASPR2 antibody",
      "Anti-GABA-B receptor antibody",
    ],
    correct: 1,
    explanation:
      "Anti-NMDA receptor encephalitis is the most common autoimmune encephalitis. It characteristically presents in young women with a prodrome followed by psychiatric symptoms, seizures, movement disorders, and autonomic instability. CSF typically shows lymphocytic pleocytosis. Anti-LGI1 encephalitis more commonly causes faciobrachial dystonic seizures and hyponatremia. Anti-CASPR2 typically presents in older males with Morvan syndrome or limbic encephalitis. MRI can be normal in anti-NMDAR encephalitis.",
    tags: ["Encephalitis", "Autoimmune Neurology", "NMDAR", "Neurology"],
    difficulty: "medium",
    source: "Dalmau J et al., Lancet Neurology 2023",
    evidenceLevel: "Expert Consensus",
  },
  {
    id: 3,
    question:
      "Which of the following BEST describes the mechanism of action of empagliflozin?",
    options: [
      "Stimulates insulin secretion from pancreatic beta cells",
      "Inhibits sodium-glucose cotransporter 2 in the proximal tubule",
      "Activates GLP-1 receptors in the hypothalamus",
      "Inhibits DPP-4 enzyme, increasing incretin levels",
      "Activates PPAR-gamma receptors in adipose tissue",
    ],
    correct: 1,
    explanation:
      "SGLT2 (sodium-glucose cotransporter 2) inhibitors work by blocking SGLT2 in the S1/S2 segment of the proximal renal tubule, which normally reabsorbs ~90% of filtered glucose. This leads to glycosuria, modest weight loss, and mild osmotic diuresis. Additional cardiorenal benefits include tubuloglomerular feedback restoration, reduced intraglomerular pressure, and mitochondrial efficiency. These mechanisms underlie their benefits in HF and CKD beyond glycemic control.",
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

export function LearningQuizPreview() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedTopic, setSelectedTopic] = useState("cardiology");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [activeTab, setActiveTab] = useState<"quiz" | "flashcards" | "stats">(
    "quiz",
  );
  const [quizMode, setQuizMode] = useState<"standard" | "timed" | "adaptive">(
    "standard",
  );
  const [questionCount, setQuestionCount] = useState(10);

  const question = QUESTIONS[currentQ];
  const correctCount = answers.filter(
    (answer, index) => answer === QUESTIONS[index]?.correct,
  ).length;

  const navigate = (href: string) => {
    router.push(href);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);
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

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") {
      return "bg-teal-100 text-teal-700";
    }

    if (difficulty === "medium") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-slate-800">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Learning & Quiz
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Adaptive quizzes generated from clinical resources
          </p>
        </div>
        {quizState === "quiz" && (
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" /> Exit Quiz
          </button>
        )}
      </div>

      {quizState === "select" && (
        <div className="mb-6 flex w-fit gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {(["quiz", "flashcards", "stats"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm capitalize transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "quiz"
                ? "Quiz Mode"
                : tab === "flashcards"
                  ? "Flashcards"
                  : "My Stats"}
            </button>
          ))}
        </div>
      )}

      {quizState === "select" && activeTab === "quiz" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-slate-800">Configure Your Quiz</h3>
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(["standard", "timed", "adaptive"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setQuizMode(mode)}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      quizMode === mode
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      {mode === "standard" && (
                        <ListChecks className="h-4 w-4 text-blue-600" />
                      )}
                      {mode === "timed" && (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                      {mode === "adaptive" && (
                        <Brain className="h-4 w-4 text-violet-600" />
                      )}
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {mode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {mode === "standard" && "Practice at your own pace"}
                      {mode === "timed" && "60 seconds per question"}
                      {mode === "adaptive" && "AI-adjusted difficulty"}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mb-5 flex items-center gap-6">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-600">
                    Questions
                  </label>
                  <div className="flex items-center gap-2">
                    {[5, 10, 20, 30].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`h-9 w-10 rounded-lg border text-sm transition-all ${
                          questionCount === count
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-600">
                    Include
                  </label>
                  <div className="flex items-center gap-2">
                    {["All", "Weak Areas", "Flagged"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setQuizState("quiz")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Play className="h-4 w-4" />
                Start {questionCount}-Question Quiz ·{" "}
                {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}
              </button>
            </div>

            <h3 className="mb-3 text-slate-800">Select Topic Area</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    selectedTopic === topic.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="mb-1.5 block text-xl">{topic.icon}</span>
                  <p className="text-sm font-medium text-slate-700">
                    {topic.label}
                  </p>
                  <p className="text-xs text-slate-500">{topic.count} questions</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Target className="h-4 w-4 text-blue-600" /> Recent Sessions
              </h4>
              <div className="space-y-2">
                {[
                  { topic: "Cardiology", score: 8, total: 10, date: "2h ago" },
                  { topic: "Neurology", score: 6, total: 10, date: "Yesterday" },
                  { topic: "Pharmacology", score: 9, total: 10, date: "3 days ago" },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-slate-700">{session.topic}</p>
                      <p className="text-xs text-slate-400">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          session.score / session.total >= 0.8
                            ? "text-teal-600"
                            : session.score / session.total >= 0.6
                              ? "text-amber-600"
                              : "text-red-500"
                        }`}
                      >
                        {session.score}/{session.total}
                      </p>
                      <p className="text-xs text-slate-400">
                        {Math.round((session.score / session.total) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">Streak</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">7 days 🔥</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Keep it up! Quiz daily to retain more.
              </p>
            </div>
          </div>
        </div>
      )}

      {quizState === "select" && activeTab === "flashcards" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-slate-800">Flashcard Decks</h3>
              <button
                type="button"
                className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-100"
              >
                + New Deck
              </button>
            </div>
            <div className="space-y-3">
              {FLASHCARD_TOPICS.map((deck) => (
                <div
                  key={deck.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <BookMarked className="h-[18px] w-[18px] text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {deck.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {deck.cards} cards
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
                    >
                      <Play className="h-3 w-3" /> Study
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-teal-500 transition-all"
                        style={{ width: `${deck.progress}%` }}
                      />
                    </div>
                    <span className="flex-shrink-0 text-xs text-slate-500">
                      {deck.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-medium text-slate-700">
                Generate from Article
              </h4>
              <p className="mb-3 text-xs text-slate-500">
                Paste a DOI or article URL to auto-generate flashcards using AI
              </p>
              <input
                placeholder="e.g. 10.1056/NEJMoa2032183"
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Generate Flashcards
              </button>
            </div>
          </div>
        </div>
      )}

      {quizState === "select" && activeTab === "stats" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-slate-800">Performance by Specialty</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={PERFORMANCE_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#2563EB"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-slate-800">Score Trend (6 Weeks)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={HISTORY_DATA} margin={{ left: -10 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="score" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:col-span-2">
            {[
              { label: "Total Questions", value: "487", icon: "📝" },
              { label: "Avg Score", value: "82%", icon: "📊" },
              { label: "Best Specialty", value: "Endo.", icon: "🏆" },
              { label: "Needs Review", value: "Neuro.", icon: "⚠️" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                <p className="mb-1 text-2xl">{stat.icon}</p>
                <p className="text-xl font-semibold text-slate-800">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizState === "quiz" && question && (
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="flex-shrink-0 text-sm text-slate-500">
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {question.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                >
                  {tag}
                </span>
              ))}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${getDifficultyColor(question.difficulty)}`}
              >
                {question.difficulty.charAt(0).toUpperCase() +
                  question.difficulty.slice(1)}
              </span>
            </div>

            <p className="mb-6 leading-relaxed text-slate-800">
              {question.question}
            </p>

            <div className="space-y-2.5">
              {question.options.map((option, index) => {
                let buttonClass =
                  "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50";

                if (selectedAnswer !== null) {
                  if (index === question.correct) {
                    buttonClass = "border-teal-500 bg-teal-50 text-teal-800";
                  } else if (
                    index === selectedAnswer &&
                    selectedAnswer !== question.correct
                  ) {
                    buttonClass = "border-red-400 bg-red-50 text-red-700";
                  } else {
                    buttonClass = "border-slate-200 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswer(index)}
                    className={`flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${buttonClass} ${selectedAnswer === null ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-medium">
                      {selectedAnswer !== null && index === question.correct ? (
                        <Check className="h-3 w-3" />
                      ) : selectedAnswer === index &&
                        index !== question.correct ? (
                        <X className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showExplanation && (
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1.5 text-sm font-medium text-blue-700">
                    Clinical Explanation
                  </p>
                  <p className="text-sm leading-relaxed text-blue-600">
                    {question.explanation}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-blue-500">
                    <span>📚 Source: {question.source}</span>
                    <span>· {question.evidenceLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showExplanation && (
            <button
              type="button"
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              {currentQ < QUESTIONS.length - 1 ? (
                <>
                  Next Question <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  View Results <Trophy className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {quizState === "result" && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="mb-1 text-slate-800">Quiz Complete!</h2>
            <p className="mb-1 text-5xl font-bold text-blue-600">
              {Math.round((correctCount / QUESTIONS.length) * 100)}%
            </p>
            <p className="mb-5 text-sm text-slate-500">
              {correctCount} correct out of {QUESTIONS.length} questions
            </p>

            <div className="mb-6 flex justify-center gap-6">
              <div className="text-center">
                <p className="text-xl font-semibold text-teal-600">
                  {correctCount}
                </p>
                <p className="text-xs text-slate-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-red-500">
                  {QUESTIONS.length - correctCount}
                </p>
                <p className="text-xs text-slate-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-slate-700">
                  {QUESTIONS.length}
                </p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-slate-50 p-4 text-left">
              <p className="mb-2 text-xs font-medium text-slate-500">
                TOPIC BREAKDOWN
              </p>
              {["Heart Failure", "Neurology", "Pharmacology"].map((topic, index) => (
                <div
                  key={topic}
                  className="mb-1.5 flex items-center gap-3 last:mb-0"
                >
                  <span className="w-28 text-xs text-slate-600">{topic}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                    <div
                      className="h-1.5 rounded-full bg-teal-500"
                      style={{ width: `${[100, 50, 100][index]}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs text-slate-500">
                    {[1, 0, 1][index]}/1
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-200"
              >
                <RotateCcw className="h-4 w-4" /> Try Again
              </button>
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm text-white transition-colors hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4" /> Review Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
