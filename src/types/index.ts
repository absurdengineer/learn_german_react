// Common types for the German A1 Learning App

export interface User {
  id: string;
  name: string;
  email?: string;
  startDate: Date;
  targetExamDate?: Date;
  currentDay: number;
  totalStudyTime: number; // in minutes
}

export interface Progress {
  userId: string;
  currentDay: number;
  completedDays: number[];
  vocabularyLearned: number;
  vocabularyMastered: number;
  grammarTopicsCompleted: string[];
  testScores: TestScore[];
  streakDays: number;
  lastStudyDate: Date;
  weeklyProgress: WeeklyProgress[];
}

export interface WeeklyProgress {
  week: number;
  startDate: Date;
  endDate: Date;
  studyHours: number;
  vocabularyAdded: number;
  testsCompleted: number;
  avgScore: number;
  completed: boolean;
}

export interface VocabularyCard {
  id: string;
  german: string;
  english: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  pronunciation: string;
  example: string;
  category: VocabularyCategory;
  difficulty: 1 | 2 | 3;
  image?: string;
  audio?: string;
}

export type VocabularyCategory = 
  | 'personal-info'
  | 'family'
  | 'numbers-time'
  | 'colors-descriptions'
  | 'food-dining'
  | 'shopping'
  | 'transportation'
  | 'housing'
  | 'work-education'
  | 'health-body'
  | 'hobbies-leisure';

export interface UserVocabularyProgress {
  cardId: string;
  timesStudied: number;
  timesCorrect: number;
  lastStudied: Date;
  nextReview: Date;
  mastered: boolean;
  difficulty: number; // Spaced repetition difficulty
}

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  examples: GrammarExample[];
  exercises: GrammarExercise[];
  difficulty: 1 | 2 | 3;
  estimatedTime: number; // in minutes
  prerequisites?: string[];
}

export interface GrammarExample {
  german: string;
  english: string;
  explanation: string;
  highlight?: string; // Part of German text to highlight
}

export interface GrammarExercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'conjugation' | 'translation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hints?: string[];
}

export interface DailyPlan {
  day: number;
  title: string;
  description: string;
  topics: string[];
  vocabularyGoal: number;
  grammarTopics: string[];
  exercises: string[];
  estimatedTime: number; // in minutes
  milestones?: string[];
}

export interface TestScore {
  testId: string;
  testType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'writing' | 'speaking' | 'mock-exam';
  score: number;
  maxScore: number;
  percentage: number;
  date: Date;
  timeSpent: number; // in minutes
  details: TestDetails;
}

export interface TestDetails {
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  topicBreakdown: Record<string, number>;
  weakAreas: string[];
}

export interface StudySession {
  id: string;
  date: Date;
  duration: number; // in minutes
  activities: StudyActivity[];
  focusAreas: string[];
  notes?: string;
}

export interface StudyActivity {
  type: 'vocabulary' | 'grammar' | 'speaking' | 'writing' | 'listening' | 'reading' | 'test';
  topic: string;
  duration: number;
  score?: number;
  completed: boolean;
}

export interface SpeakingExercise {
  id: string;
  title: string;
  description: string;
  type: 'introduction' | 'conversation' | 'description' | 'role-play';
  prompts: string[];
  expectedLength: number; // in seconds
  level: 1 | 2 | 3;
  tips: string[];
}

export interface WritingExercise {
  id: string;
  title: string;
  description: string;
  type: 'email' | 'postcard' | 'form' | 'description' | 'story';
  prompt: string;
  wordLimit: number;
  template?: string;
  tips: string[];
  sampleAnswer?: string;
}

export interface PracticeTest {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'mixed' | 'mock-exam';
  duration: number; // in minutes
  questions: TestQuestion[];
  passingScore: number;
}

export interface TestQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching' | 'drag-drop';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  topic: string;
  difficulty: 1 | 2 | 3;
}

export interface AppSettings {
  language: 'en' | 'de';
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm format
  soundEnabled: boolean;
  autoPlayAudio: boolean;
  studyGoalMinutes: number;
  spacedRepetitionEnabled: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'vocabulary' | 'grammar' | 'study-time' | 'tests' | 'streak' | 'milestone';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
}

// Form types
export interface ProfileForm {
  name: string;
  email: string;
  targetExamDate: string;
  studyGoalMinutes: number;
  currentLevel: 'beginner' | 'false-beginner' | 'some-knowledge';
}

export interface QuizResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
  exact?: boolean;
}

// Component Props types
export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export interface FlashcardProps {
  card: VocabularyCard;
  onCorrect: () => void;
  onIncorrect: () => void;
  onSkip: () => void;
  showAnswer: boolean;
}

// Local Storage keys
export const STORAGE_KEYS = {
  USER: 'german_a1_user',
  PROGRESS: 'german_a1_progress',
  SETTINGS: 'german_a1_settings',
  VOCABULARY_PROGRESS: 'german_a1_vocab_progress',
  STUDY_SESSIONS: 'german_a1_study_sessions',
  ACHIEVEMENTS: 'german_a1_achievements',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DAILY_PLAN: '/daily-plan',
  VOCABULARY: '/vocabulary',
  GRAMMAR: '/grammar',
  SPEAKING: '/speaking',
  WRITING: '/writing',
  TESTS: '/tests',
  PROGRESS: '/progress',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;
