import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { submitQuiz } from "../api/quizApi";

export default function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const quiz = state?.quiz;
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!quiz) { navigate("/"); return null; }

  const questions = quiz.questions;
  const answered = Object.keys(answers).length;

  const setAnswer = (id, val) => setAnswers((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = async () => {
    if (answered < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setLoading(true); setError("");
    try {
      const payload = {
        quiz_id: quiz.quiz_id,
        questions,
        user_answers: Object.entries(answers).map(([question_id, answer]) => ({
          question_id: parseInt(question_id),
          answer,
        })),
      };
      const result = await submitQuiz(payload);
      navigate("/result", { state: { result } });
    } catch (e) {
      setError("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Your Quiz</h1>
            <p className="text-sm text-gray-400 mt-0.5">{answered} / {questions.length} answered</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-500">{Math.round((answered / questions.length) * 100)}%</div>
            <div className="text-xs text-gray-400">progress</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
          <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard key={q.id} q={q} idx={idx} answer={answers[q.id]} setAnswer={setAnswer} />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-4 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating…</> : <>Submit Quiz <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}

function QuestionCard({ q, idx, answer, setAnswer }) {
  return (
    <div className={`bg-white border rounded-2xl p-6 transition-all ${answer ? "border-brand-200 shadow-sm" : "border-gray-100"}`}>
      <div className="flex gap-3 mb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold flex items-center justify-center">
          {idx + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed">{q.question}</p>
        {answer && <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-400 ml-auto" />}
      </div>

      {/* MCQ / find_error */}
      {q.options && (
        <div className="space-y-2 ml-10">
          {q.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setAnswer(q.id, opt.label)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all
                ${answer === opt.label
                  ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              <span className="font-semibold mr-2">{opt.label}.</span>{opt.text}
            </button>
          ))}
        </div>
      )}

      {/* Subjective */}
      {q.type === "subjective" && (
        <textarea
          rows={3}
          placeholder="Write your answer here…"
          value={answer || ""}
          onChange={(e) => setAnswer(q.id, e.target.value)}
          className="w-full ml-10 mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-brand-400 resize-none"
        />
      )}

      {/* Fill in the blank */}
      {q.type === "fill_blank" && (
        <input
          type="text"
          placeholder="Type the missing word…"
          value={answer || ""}
          onChange={(e) => setAnswer(q.id, e.target.value)}
          className="ml-10 mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-brand-400"
        />
      )}
    </div>
  );
}