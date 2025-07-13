import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVocabularyQuestions } from "../../core/question-engine/questionBuilder";
import { type Question } from "../../core/question-engine/questionTypes";
import { shuffleArray } from "../../lib/utils";
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

export const useVocabulary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionMode, setSessionMode] = useState<
    "browse" | "session" | "results"
  >("browse");
  const [sessionType, setSessionType] = useState<string>("flashcards");
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionLength, setSessionLength] = useState(10);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [flashcardItems, setFlashcardItems] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  const navigate = useNavigate();

  // Load all vocabulary questions on mount
  useEffect(() => {
    try {
      setLoading(true);
      setLoadingError(null);
      const questions = getVocabularyQuestions({
        mode: "flashcard",
        count: 1000,
      });
      setAllQuestions(questions);
      setFilteredQuestions(questions);
      setLoading(false);
    } catch (error) {
      setLoadingError(
        "Failed to load vocabulary data. Please refresh the page."
      );
      setLoading(false);
    }
  }, []);

  // Filter questions by search term or category
  useEffect(() => {
    let questions = allQuestions;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      questions = questions.filter(
        (q) =>
          q.prompt.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term)
      );
    } else if (selectedCategory !== "all") {
      questions = allQuestions.filter((q) =>
        q.data?.tags?.includes(selectedCategory)
      );
    }
    setFilteredQuestions(questions);
  }, [searchTerm, selectedCategory, allQuestions]);

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuestion(null);
  };

  const startPractice = (type: string, questions: Question[]) => {
    setSessionType(type);
    setSessionQuestions(questions);
    setSessionLength(questions.length);
    setFlashcardItems(type === "flashcards" ? questions : []);
    setQuizQuestions(type !== "flashcards" ? questions : []);
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
        correctAnswer: m.item.back, // FlashcardItem uses 'back' for the answer
      })),
    };
    handleSessionComplete(sessionResult);
  };

  const handleSessionExit = () => {
    setSessionMode("browse");
    setSessionResults(null);
    setFlashcardItems([]);
    setQuizQuestions([]);
  };

  const handleRestart = () => {
    // Generate completely new questions for the same session type
    let category = selectedCategory !== "all" ? selectedCategory : undefined;
    let count = sessionLength;

    // Determine the appropriate count based on session type
    switch (sessionType) {
      case "flashcards":
        count = 20;
        break;
      case "translation-de-en":
      case "translation-en-de":
        count = 15;
        break;
      case "multiple-choice-de-en":
      case "multiple-choice-en-de":
        count = 12;
        break;
      default:
        count = 15;
    }

    const newQuestions = getVocabularyQuestions({
      mode: sessionType,
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

  const handleRandomQuestions = () => {
    setFilteredQuestions(shuffleArray([...allQuestions]).slice(0, 20));
  };

  const getSessionTitle = (type: string): string => {
    switch (type) {
      case "translation-de-en":
        return "German → English Translation";
      case "translation-en-de":
        return "English → German Translation";
      case "multiple-choice-de-en":
        return "Multiple Choice: German Words";
      case "multiple-choice-en-de":
        return "Multiple Choice: English Words";
      default:
        return "Vocabulary Practice";
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allQuestions,
    filteredQuestions,
    availableCategories: {}, // TODO: implement if needed
    selectedQuestion,
    dialogOpen,
    sessionMode,
    sessionType,
    sessionQuestions,
    sessionLength,
    sessionResults,
    loading,
    loadingError,
    flashcardItems,
    quizQuestions,
    handleQuestionClick,
    handleCloseDialog,
    startPractice,
    handleSessionComplete,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
    handleRandomQuestions,
    getSessionTitle,
    navigate,
  };
};
