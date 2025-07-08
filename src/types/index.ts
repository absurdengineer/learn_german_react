export type Gender = 'der' | 'die' | 'das';

export interface User {
  id: string;
  name: string;
  startDate: Date;
  currentDay: number;
  totalStudyTime: number;
}

export interface Progress {
  userId: string;
  currentDay: number;
  completedDays: number[];
  vocabularyLearned: number;
  vocabularyMastered: number;
  grammarTopicsCompleted: string[];
  testScores: {
    testId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    date: string;
  }[];
  streakDays: number;
  lastStudyDate: Date;
  weeklyProgress: {
    day: string;
    vocabulary: number;
    grammar: number;
    speaking: number;
    reading: number;
  }[];
}

export interface AppSettings {
  language: string;
  theme: string;
  notifications: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  autoPlayAudio: boolean;
  studyGoalMinutes: number;
  spacedRepetitionEnabled: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate: Date | null;
  progress?: number;
  goal?: number;
}

export const STORAGE_KEYS = {
  USER: 'deutschMeisterUser',
  PROGRESS: 'deutschMeisterProgress',
  SETTINGS: 'deutschMeisterSettings',
  ACHIEVEMENTS: 'deutschMeisterAchievements',
};
