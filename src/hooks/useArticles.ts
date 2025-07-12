import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadArticleCategories } from "../data";
import { VocabularyWord } from "../types/Vocabulary";
import { SESSION_KEYS, SessionManager } from "../lib/sessionManager";
import { shuffleArray } from "../lib/testGenerator";

export interface ArticlesSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: VocabularyWord[];
  mistakes: Array<{
    word: VocabularyWord;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export const useArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams<{ category?: string }>();

  const [sessionResults, setSessionResults] =
    useState<ArticlesSessionResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category || ""
  );
  const [sessionLength] = useState(20);
  const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);

  const getCurrentMode = useCallback(():
    | "menu"
    | "practice"
    | "learning"
    | "results" => {
    const pathname = location.pathname;
    if (pathname.includes("/results")) return "results";
    if (pathname.includes("/practice")) return "practice";
    if (pathname.includes("/learning")) return "learning";
    return "menu";
  }, [location.pathname]);

  const [sessionMode, setSessionMode] = useState<
    "menu" | "practice" | "learning" | "results"
  >(getCurrentMode());

  useEffect(() => {
    const mode = getCurrentMode();
    setSessionMode(mode);
  }, [location.pathname, getCurrentMode]);

  useEffect(() => {
    if (location.state?.results) {
      setSessionResults(location.state.results);
    } else if (sessionMode === "results") {
      const results = SessionManager.getResults(SESSION_KEYS.ARTICLES);
      if (results) {
        const articleResults: ArticlesSessionResult = {
          totalQuestions: results.totalQuestions,
          correctAnswers: results.correctAnswers,
          wrongAnswers: results.wrongAnswers,
          timeSpent: results.timeSpent,
          wordsStudied: [],
          mistakes:
            results.mistakes?.map((m) => ({
              word: (m.word as unknown as VocabularyWord) || {
                german: "",
                english: "",
                id: "",
              },
              userAnswer: m.userAnswer,
              correctAnswer: m.correctAnswer,
            })) || [],
        };
        setSessionResults(articleResults);
      }
    }
  }, [location.state, sessionMode]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const articleCategories = useMemo(() => {
    const categories = loadArticleCategories();
    return Object.values(categories).map((category) => ({
      ...category,
      icon: "📚", // Default icon, can be customized later
    }));
  }, []);

  const handleStartPractice = (
    practiceCategory: string = "",
    length: number = 20
  ) => {
    const sessionData = {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: "articles" as const,
      mode: "practice",
      category: practiceCategory,
      config: { length },
    };
    SessionManager.setSession(SESSION_KEYS.ARTICLES, sessionData);

    if (practiceCategory) {
      navigate(`/articles/category/${practiceCategory}/practice`);
    } else {
      navigate("/articles/practice");
    }
  };

  const handleStartLearning = (
    learningCategory: string = "",
    length: number = 30
  ) => {
    const sessionData = {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: "articles" as const,
      mode: "learning",
      category: learningCategory,
      config: { length },
    };
    SessionManager.setSession(SESSION_KEYS.ARTICLES, sessionData);

    if (learningCategory) {
      navigate(`/articles/category/${learningCategory}/learning`);
    } else {
      navigate("/articles/learning");
    }
  };

  const handleSessionComplete = (results: ArticlesSessionResult) => {
    SessionManager.setResults(SESSION_KEYS.ARTICLES, {
      sessionId: SessionManager.generateSessionId(),
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      completedAt: Date.now(),
      mistakes: results.mistakes?.map((m) => ({
        question: `What is the article for "${m.word.german}"?`,
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
        word: m.word,
      })),
    });

    if (selectedCategory) {
      navigate(`/articles/category/${selectedCategory}/practice/results`, {
        state: { results },
        replace: true,
      });
    } else {
      navigate("/articles/practice/results", {
        state: { results },
        replace: true,
      });
    }
  };

  const handleSessionExit = () => {
    SessionManager.clearSession(SESSION_KEYS.ARTICLES);
    navigate("/articles");
  };

  const handleRestart = () => {
    handleStartPractice(selectedCategory, sessionLength);
  };

  const handleReviewMistakes = () => {
    if (sessionResults && sessionResults.mistakes.length > 0) {
      const mistakenWords = sessionResults.mistakes.map(
        (mistake) => mistake.word
      );
      const shuffledWords = shuffleArray([...mistakenWords]);
      setReviewWords(shuffledWords);

      // Navigate to practice with review words
      if (selectedCategory) {
        navigate(`/articles/category/${selectedCategory}/practice`, {
          state: { reviewWords: shuffledWords },
          replace: true,
        });
      } else {
        navigate("/articles/practice", {
          state: { reviewWords: shuffledWords },
          replace: true,
        });
      }
    }
  };

  return {
    sessionMode,
    sessionResults,
    selectedCategory,
    sessionLength,
    reviewWords,
    articleCategories,
    handleStartPractice,
    handleStartLearning,
    handleSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  };
};
