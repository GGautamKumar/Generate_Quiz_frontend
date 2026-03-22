import { Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    // <h1 className="text-center text-2xl font-bold mt-20">QuizGen - Coming Soon!</h1>
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}