import type { ActivityType } from '../../types/Progress.js';
import { Achievement, ProgressId, StudySession, StudySessionId, UserProgress } from '../../types/Progress.js';

export interface ProgressRepository {
  findById(id: ProgressId): Promise<UserProgress | null>;
  findByUserId(userId: string): Promise<UserProgress | null>;
  save(progress: UserProgress): Promise<void>;
  delete(id: ProgressId): Promise<void>;
  createForUser(userId: string, dailyGoal?: number, weeklyGoal?: number): Promise<UserProgress>;
  updateStreak(userId: string): Promise<void>;
  resetStreak(userId: string): Promise<void>;
}

export interface StudySessionRepository {
  findById(id: StudySessionId): Promise<StudySession | null>;
  findByUserId(userId: string): Promise<StudySession[]>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<StudySession[]>;
  findByActivityType(activityType: ActivityType): Promise<StudySession[]>;
  findTodaySessions(userId: string): Promise<StudySession[]>;
  findThisWeekSessions(userId: string): Promise<StudySession[]>;
  save(session: StudySession): Promise<void>;
  delete(id: StudySessionId): Promise<void>;
  getUserStats(userId: string): Promise<{
    totalSessions: number;
    totalTimeSpent: number;
    averageSessionDuration: number;
    averageAccuracy: number;
    sessionsByType: Record<ActivityType, number>;
    activityTrend: { date: string; minutes: number }[];
  }>;
}

export interface AchievementRepository {
  findById(id: string): Promise<Achievement | null>;
  findAll(): Promise<Achievement[]>;
  findByCategory(category: string): Promise<Achievement[]>;
  findByLevel(level: string): Promise<Achievement[]>;
  findAvailableForUser(userId: string, userProgress: UserProgress): Promise<Achievement[]>;
  save(achievement: Achievement): Promise<void>;
  delete(id: string): Promise<void>;
  checkAndAwardAchievements(userId: string, userProgress: UserProgress): Promise<string[]>;
}
