import { useState } from "react";
import { getArticleQuestions } from "../features/question-engine/questionBuilder";
import { type Question } from "../features/question-engine/questionTypes";
import { shuffleArray } from "../lib/utils";
import type { QuizResults, FlashcardSessionResult } from "../types/Flashcard";

export interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: Question[];
  mistakes: Array<{
    word: Question;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export const useArticles = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sessionMode, setSessionMode] = useState<
    "browse" | "session" | "results"
  >("browse");
  const [sessionType, setSessionType] = useState<string>("practice");
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(
    null
  );

  const startPractice = (type: string, questions: Question[]) => {
    setSessionType(type);
    setSessionQuestions(questions);
    setSessionMode("session");
  };

  const handleSessionComplete = (results: SessionResult) => {
    setSessionResults(results);
    setSessionMode("results");
  };

  const handleQuizComplete = (results: QuizResults) => {
    const sessionResult: SessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      wordsStudied: sessionQuestions,
      mistakes: results.mistakes.map((m) => ({
        word:
          sessionQuestions.find((q) => q.id === m.id) || sessionQuestions[0],
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
      })),
    };
    handleSessionComplete(sessionResult);
  };

  const handleFlashcardSessionComplete = (results: FlashcardSessionResult) => {
    const sessionResult: SessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      wordsStudied: sessionQuestions,
      mistakes: results.mistakes.map((m) => ({
        word:
          sessionQuestions.find((q) => q.id === m.item.id) ||
          sessionQuestions[0],
        userAnswer: m.userAction || "",
        correctAnswer: m.item.back,
      })),
    };
    handleSessionComplete(sessionResult);
  };

  const handleSessionExit = () => {
    setSessionMode("browse");
    setSessionResults(null);
  };

  const handleRestart = () => {
    // Generate completely new questions for the same session type
    let category = selectedCategory !== "all" ? selectedCategory : undefined;
    let count = 20; // Default count

    // Determine the appropriate count based on session type
    switch (sessionType) {
      case "practice":
        count = 20;
        break;
      case "learning":
        count = 30;
        break;
      case "intensive":
        count = 50;
        break;
      case "speed":
        count = 10;
        break;
      default:
        count = 20;
    }

    const newQuestions = getArticleQuestions({
      mode: "flashcard",
      count,
      category,
    });

    setSessionQuestions(newQuestions);
    setSessionMode("session");
  };

  const handleReviewMistakes = () => {
    if (sessionResults && sessionResults.mistakes.length > 0) {
      const mistakeQuestions = sessionResults.mistakes.map((m) => m.word);
      setSessionQuestions(shuffleArray([...mistakeQuestions]));
      setSessionMode("session");
    }
  };

  return {
    selectedCategory,
    setSelectedCategory,
    sessionMode,
    sessionType,
    sessionQuestions,
    sessionResults,
    startPractice,
    handleSessionComplete,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  };
};
