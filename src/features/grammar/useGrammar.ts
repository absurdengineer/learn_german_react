import { useState } from "react";
import { getGrammarQuestions } from "../../core/question-engine";
import { type Question } from "../../core/question-engine/types";
import { shuffleArray } from "../../pages/utils";
import type {
  QuizResults,
  FlashcardSessionResult,
} from "../../types/Flashcard";

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

export const useGrammar = () => {
  const [sessionMode, setSessionMode] = useState<
    "browse" | "session" | "results"
  >("browse");
  const [sessionType, setSessionType] = useState<string>("quiz");
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
      correctAnswers: results.correctAnswers ?? 0,
      wrongAnswers: results.wrongAnswers ?? 0,
      timeSpent: results.timeSpent ?? 0,
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
        correctAnswer: m.item.answer,
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
    let count = 20;
    switch (sessionType) {
      case "flashcards":
        count = 20;
        break;
      case "quiz":
        count = 20;
        break;
      case "quick":
        count = 10;
        break;
      case "intensive":
        count = 30;
        break;
      default:
        count = 20;
    }

    // Map quiz modes to 'mc' for multiple choice, same as in Grammar page
    const questionMode = ["quiz", "quick", "intensive"].includes(sessionType)
      ? "mc"
      : sessionType;
    const newQuestions = getGrammarQuestions({ mode: questionMode, count });
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
    sessionMode,
    sessionType,
    sessionQuestions,
    sessionResults,
    startPractice,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  };
};
