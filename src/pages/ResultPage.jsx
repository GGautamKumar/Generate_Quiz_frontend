import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Trophy, RefreshCw } from "lucide-react";

const GRADE_COLOR = { A: "text-green-500", B: "text-blue-500", C: "text-yellow-500", D: "text-orange-500", F: "text-red-500" };

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) { navigate("/"); return null; }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Score card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm mb-8">
          <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Quiz Complete!</h1>
          <p className="text-gray-400 mb-6">Here's how you did</p>

          <div className="flex justify-center gap-10">
            <div>
              <div className={`text-5xl font-display font-bold ${GRADE_COLOR[result.grade]}`}>{result.grade}</div>
              <div className="text-sm text-gray-400 mt-1">Grade</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-gray-800">{result.score_percent}%</div>
              <div className="text-sm text-gray-400 mt-1">Score</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-gray-800">{result.correct}<span className="text-2xl text-gray-300">/{result.total}</span></div>
              <div className="text-sm text-gray-400 mt-1">Correct</div>
            </div>
          </div>
        </div>

        {/* Question breakdown */}
        <h2 className="font-display text-lg font-semibold text-gray-800 mb-4">Question Review</h2>
        <div className="space-y-4 mb-8">
          {result.results.map((r, idx) => (
            <div key={r.question_id} className={`bg-white border rounded-2xl p-5 ${r.is_correct ? "border-green-100" : "border-red-100"}`}>
              <div className="flex gap-3">
                {r.is_correct
                  ? <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-400 mt-0.5" />
                  : <XCircle className="flex-shrink-0 w-5 h-5 text-red-400 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-2">{idx + 1}. {r.question}</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-400">Your answer:</span> <span className={r.is_correct ? "text-green-600 font-medium" : "text-red-500 font-medium"}>{r.user_answer || "—"}</span></p>
                    {!r.is_correct && <p><span className="text-gray-400">Correct:</span> <span className="text-green-600 font-medium">{r.correct_answer}</span></p>}
                    <p className="text-gray-400 text-xs mt-2 italic">{r.feedback || r.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Another PDF
        </button>
      </div>
    </div>
  );
}