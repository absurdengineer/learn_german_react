import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SESSION_KEYS, SessionManager } from "../../lib/sessionManager";
import {
  getArticleQuestions,
  getVocabularyQuestions,
  getGrammarQuestions,
} from "../../core/question-engine/questionBuilder";
import { questionsToQuizQuestions } from "../../lib/flashcardAdapters";
import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface TestData {
  id: string;
  title: string;
  type: string;
  questions: Question[];
}

type TestGenerator = (count: number) => TestData;

const vocabModes = [
  "multiple-choice-de-en",
  "multiple-choice-en-de",
  "translation-de-en",
  "translation-en-de",
];

const generateVocabularyTest = (count: number): TestData => {
  // Randomly assign a mode to each question
  const questions = Array.from({ length: count }).map(() => {
    const mode = vocabModes[Math.floor(Math.random() * vocabModes.length)];
    return getVocabularyQuestions({ mode, count: 1 })[0];
  });

  const quizQuestions = questionsToQuizQuestions(questions);

  return {
    id: `vocab-test-${Date.now()}`,
    title: "Vocabulary Test",
    type: "vocabulary",
    questions: quizQuestions.map((q) => ({
      id: q.id,
      question: q.prompt,
      options: q.options,
      answer: q.answer,
    })),
  };
};

const isTestMode = import.meta.env.VITE_TEST_MODE === "true";
const generateArticlesTest = (count: number): TestData => {
  const actualCount = isTestMode ? 3 : count;
  console.log(
    "[generateArticlesTest] VITE_TEST_MODE:",
    isTestMode,
    "actualCount:",
    actualCount
  );
  const questions = getArticleQuestions({
    mode: "mc",
    count: actualCount,
  });
  console.log("[generateArticlesTest] questions:", questions);

  const quizQuestions = questionsToQuizQuestions(questions);

  return {
    id: `articles-test-${Date.now()}`,
    title: "Articles Test",
    type: "articles",
    questions: quizQuestions.map((q) => ({
      id: q.id,
      question: q.prompt,
      options: q.options,
      answer: q.answer,
    })),
  };
};

const generateGrammarTest = (count: number): TestData => {
  const questions = getGrammarQuestions({
    mode: "mc",
    count,
  });

  const quizQuestions = questionsToQuizQuestions(questions);

  return {
    id: `grammar-test-${Date.now()}`,
    title: "Grammar Test",
    type: "grammar",
    questions: quizQuestions.map((q) => ({
      id: q.id,
      question: q.prompt,
      options: q.options,
      answer: q.answer,
    })),
  };
};

const generateA1Test = (count: number): TestData => {
  // Generate a mixed test with vocabulary, articles, and grammar
  const vocabCount = Math.round(count * 0.5);
  const articlesCount = Math.round(count * 0.25);
  const grammarCount = count - vocabCount - articlesCount;

  const vocabQuestions = getVocabularyQuestions({
    mode: "multiple-choice-de-en",
    count: vocabCount,
  });
  const articlesQuestions = getArticleQuestions({
    mode: "mc",
    count: articlesCount,
  });
  const grammarQuestions = getGrammarQuestions({
    mode: "mc",
    count: grammarCount,
  });

  const allQuestions = [
    ...vocabQuestions,
    ...articlesQuestions,
    ...grammarQuestions,
  ];
  const quizQuestions = questionsToQuizQuestions(allQuestions);

  return {
    id: `a1-test-${Date.now()}`,
    title: "A1 German Test",
    type: "mixed",
    questions: quizQuestions.map((q) => ({
      id: q.id,
      question: q.prompt,
      options: q.options,
      answer: q.answer,
    })),
  };
};

export const useTests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testType } = useParams<{ testType?: string }>();

  const getCurrentMode = useCallback((): "menu" | "session" | "results" => {
    const pathname = location.pathname;
    if (pathname.includes("/results")) return "results";
    if (pathname.includes("/session")) return "session";
    return "menu";
  }, [location.pathname]);

  const [sessionMode, setSessionMode] = useState<
    "menu" | "session" | "results"
  >(getCurrentMode());

  useEffect(() => {
    const mode = getCurrentMode();
    setSessionMode(mode);
  }, [location.pathname, getCurrentMode]);

  // Get data statistics from the unified data manager
  const dataManager = DeutschMeisterDataManager.getInstance();
  const dataStats = {
    vocabulary: { total: dataManager.getVocabulary().length },
    articles: { total: dataManager.getArticles().length },
    grammarLessons: { total: dataManager.getGrammarLessons().length },
    grammarPractice: { total: dataManager.getGrammarPractice().length },
  };

  const startTest = (generator: TestGenerator, count: number, type: string) => {
    const test = generator(count);

    const sessionData = {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: "test" as const,
      mode: type,
      config: { count, testType: type },
    };
    SessionManager.setSession(SESSION_KEYS.TEST, sessionData);

    if (testType) {
      navigate(`/tests/${testType}/session`, { state: { test } });
    } else {
      navigate("/tests/session", { state: { test } });
    }
  };

  return {
    sessionMode,
    dataStats,
    startTest,
    generateA1Test,
    generateVocabularyTest,
    generateArticlesTest,
    generateGrammarTest,
  };
};
