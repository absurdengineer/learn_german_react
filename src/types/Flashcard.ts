import type { VocabularyWord } from "./Vocabulary";

// Generic flashcard item interface
export interface FlashcardItem {
  id: string;
  /** The question prompt */
  prompt: string;
  /** The answer */
  answer: string;
  category?: string;
  helperText?: string;
  additionalInfo?: React.ReactNode;
  metadata?: Record<string, unknown>;
}

// Session result interface
export interface FlashcardSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: Array<{
    item: FlashcardItem;
    userAction?: string;
  }>;
  completedItems: FlashcardItem[];
}

// Quiz-related interfaces
export interface QuizResults {
  totalQuestions: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  timeSpent?: number;
  mistakes: QuizMistake[];
  userAnswers?: { [key: string]: string };
  score?: number;
  title?: string;
  date?: string;
  totalTime?: number;
}

export interface QuizMistake {
  id: string;
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
  category?: string;
  word?: VocabularyWord;
  helperText?: string;
  options?: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** The answer (use this instead of correctAnswer) */
  answer: string;
  category?: string;
  helperText?: string;
  word?: VocabularyWord;
  data?: any;
  type?: string;
}

// Test-related interfaces
export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface Test {
  id: string;
  title: string;
  type: string;
  questions: TestQuestion[];
}

export interface TestResult {
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: string]: string };
  totalTime: number;
  date: string;
}

// Vocabulary question types
export const VocabularyQuestionType = {
  GERMAN_TO_ENGLISH: "german-to-english",
  ENGLISH_TO_GERMAN: "english-to-german",
  GENDER_PRACTICE: "gender-practice",
  ARTICLE_PRACTICE: "article-practice",
  PRONUNCIATION: "pronunciation",
  CONTEXT_CLUE: "context-clue",
  WORD_BUILDING: "word-building",
} as const;

export type VocabularyQuestionType =
  (typeof VocabularyQuestionType)[keyof typeof VocabularyQuestionType];
