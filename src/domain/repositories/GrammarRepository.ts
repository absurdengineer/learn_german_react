import type { GrammarCategory } from '../entities/Grammar.js';
import { GrammarId, GrammarLesson, GrammarProgress, GrammarRule, LessonId } from '../entities/Grammar.js';
import type { LevelType } from '../entities/User.js';

export interface GrammarRepository {
  findById(id: GrammarId): Promise<GrammarRule | null>;
  findByLevel(level: LevelType): Promise<GrammarRule[]>;
  findByCategory(category: GrammarCategory): Promise<GrammarRule[]>;
  findByLevelAndCategory(level: LevelType, category: GrammarCategory): Promise<GrammarRule[]>;
  findByDifficulty(minDifficulty: number, maxDifficulty: number): Promise<GrammarRule[]>;
  findByTags(tags: string[]): Promise<GrammarRule[]>;
  findAll(): Promise<GrammarRule[]>;
  save(rule: GrammarRule): Promise<void>;
  delete(id: GrammarId): Promise<void>;
  search(query: string): Promise<GrammarRule[]>;
  getRandomRules(count: number, level?: LevelType): Promise<GrammarRule[]>;
}

export interface GrammarLessonRepository {
  findById(id: LessonId): Promise<GrammarLesson | null>;
  findByLevel(level: LevelType): Promise<GrammarLesson[]>;
  findByCategory(category: GrammarCategory): Promise<GrammarLesson[]>;
  findByLevelAndCategory(level: LevelType, category: GrammarCategory): Promise<GrammarLesson[]>;
  findByPrerequisites(prerequisiteRules: GrammarId[]): Promise<GrammarLesson[]>;
  findAll(): Promise<GrammarLesson[]>;
  save(lesson: GrammarLesson): Promise<void>;
  delete(id: LessonId): Promise<void>;
  search(query: string): Promise<GrammarLesson[]>;
}

export interface GrammarProgressRepository {
  findByUserId(userId: string): Promise<GrammarProgress[]>;
  findByUserIdAndRuleId(userId: string, ruleId: GrammarId): Promise<GrammarProgress | null>;
  findWeakAreas(userId: string): Promise<GrammarProgress[]>;
  findMasteredRules(userId: string): Promise<GrammarProgress[]>;
  save(progress: GrammarProgress): Promise<void>;
  delete(userId: string, ruleId: GrammarId): Promise<void>;
  getUserStats(userId: string): Promise<{
    totalRules: number;
    masteredRules: number;
    averageAccuracy: number;
    rulesStudiedToday: number;
    completedLessons: number;
  }>;
}
