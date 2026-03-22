import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, ChevronRight } from "lucide-react";
import { generateQuiz } from "../api/quizApi";

const QUIZ_TYPES = [
  { id: "mcq",        label: "Multiple Choice",  desc: "4 options, pick one" },
  { id: "subjective", label: "Subjective",        desc: "Written explanation" },
  { id: "fill_blank", label: "Fill in the Blank", desc: "Complete the sentence" },
  { id: "find_error", label: "Find the Error",    desc: "Spot the mistake" },
];

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [quizType, setQuizType] = useState("mcq");
  const [numQ, setNumQ] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (f?.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setFile(f); setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a PDF first."); return; }
    setLoading(true); setError("");
    try {
      const quiz = await generateQuiz(file, quizType, numQ, difficulty);
      navigate("/quiz", { state: { quiz } });
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">QuizGen</h1>
          <p className="text-gray-500 text-lg">Turn any PDF into a smart quiz — instantly.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-7">

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
              ${dragging ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-500 hover:bg-brand-50"}`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <FileText className="w-10 h-10 text-brand-500 mb-3" />
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-300 mb-3" />
                <p className="font-medium text-gray-600">Drop your PDF here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse · Max 10 MB</p>
              </>
            )}
          </div>

          {/* Quiz type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Quiz Type</label>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setQuizType(t.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all
                    ${quizType === t.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <span className="font-medium block">{t.label}</span>
                  <span className="text-xs text-gray-400">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions: <span className="text-brand-600">{numQ}</span>
            </label>
            <input
              type="range" min={3} max={30} value={numQ}
              onChange={(e) => setNumQ(+e.target.value)}
              className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3</span><span>30</span></div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all
                    ${difficulty === d ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating Quiz…</>
            ) : (
              <>Generate Quiz <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
