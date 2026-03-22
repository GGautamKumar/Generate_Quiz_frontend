import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 60000,
});

export const generateQuiz = async (file, quizType, numQuestions, difficulty) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post(
    `/quiz/upload-and-generate?quiz_type=${quizType}&num_questions=${numQuestions}&difficulty=${difficulty}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const submitQuiz = async (payload) => {
  const { data } = await api.post("/quiz/submit", payload);
  return data;
};