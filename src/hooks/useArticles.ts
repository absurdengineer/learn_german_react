import { useState, useMemo } from "react";
import { articlesLoader } from "../lib/parsers/ArticlesParser";
import { getArticleQuestions } from "../core/question-engine/questionBuilder";

export function useArticles() {
  const [sessionMode, setSessionMode] = useState<
    "idle" | "practice" | "quiz" | "review" | "results"
  >("idle");
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [mistakes, setMistakes] = useState<any[]>([]);

  // Load all articles
  const articles = useMemo(() => articlesLoader.load(), []);

  // Add test mode flag
  const isTestMode = import.meta.env.VITE_TEST_MODE === "true";

  // Handlers
  const startPractice = () => {
    // Use MCQ-ready article questions
    const count = isTestMode ? 3 : 20;
    const questions = getArticleQuestions({ mode: "mc", count });
    setSessionQuestions(questions);
    setSessionMode("practice");
  };
  const startQuiz = () => {
    const count = isTestMode ? 3 : 20;
    const questions = getArticleQuestions({ mode: "mc", count });
    setSessionQuestions(questions);
    setSessionMode("quiz");
  };
  const handleSessionExit = () => {
    setSessionMode("idle");
    setSessionQuestions([]);
    setSessionResults(null);
  };
  const handleSessionComplete = (results: any) => {
    setSessionResults(results);
    setMistakes(results?.mistakes || []);
    // If this was a review session, mark review as complete (no more questions)
    if (sessionMode === "review") {
      setSessionQuestions([]);
      setSessionMode("review");
    } else {
      setSessionMode("results");
    }
  };
  const handleRestart = () => {
    setSessionMode("idle");
    setSessionQuestions([]);
    setSessionResults(null);
  };
  const handleReviewMistakes = () => {
    setSessionQuestions(mistakes);
    setSessionMode("review");
  };

  return {
    articles,
    sessionMode,
    sessionQuestions,
    sessionResults,
    startPractice,
    startQuiz,
    handleSessionExit,
    handleSessionComplete,
    handleRestart,
    handleReviewMistakes,
    mistakes,
  };
}
