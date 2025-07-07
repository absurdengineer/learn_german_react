import type { Difficulty, QuestionType, TestType } from '../entities/Test.js';
import { Question, QuestionId, Test, TestId, TestResult, TestResultId } from '../entities/Test.js';
import type { LevelType } from '../entities/User.js';

export interface TestRepository {
  findById(id: TestId): Promise<Test | null>;
  findByLevel(level: LevelType): Promise<Test[]>;
  findByType(type: TestType): Promise<Test[]>;
  findByLevelAndType(level: LevelType, type: TestType): Promise<Test[]>;
  findByDifficulty(difficulty: Difficulty): Promise<Test[]>;
  findAdaptiveTests(userId: string, level: LevelType): Promise<Test[]>;
  findAll(): Promise<Test[]>;
  save(test: Test): Promise<void>;
  delete(id: TestId): Promise<void>;
  generateRandomTest(level: LevelType, type: TestType, questionCount: number): Promise<Test>;
}

export interface QuestionRepository {
  findById(id: QuestionId): Promise<Question | null>;
  findByLevel(level: LevelType): Promise<Question[]>;
  findByType(type: QuestionType): Promise<Question[]>;
  findByLevelAndType(level: LevelType, type: QuestionType): Promise<Question[]>;
  findByDifficulty(difficulty: Difficulty): Promise<Question[]>;
  findByTags(tags: string[]): Promise<Question[]>;
  findAll(): Promise<Question[]>;
  save(question: Question): Promise<void>;
  delete(id: QuestionId): Promise<void>;
  getRandomQuestions(count: number, level?: LevelType, type?: QuestionType): Promise<Question[]>;
  getAdaptiveQuestions(userId: string, count: number, level: LevelType): Promise<Question[]>;
}

export interface TestResultRepository {
  findById(id: TestResultId): Promise<TestResult | null>;
  findByUserId(userId: string): Promise<TestResult[]>;
  findByUserIdAndTestId(userId: string, testId: TestId): Promise<TestResult[]>;
  findByLevel(level: LevelType): Promise<TestResult[]>;
  findRecentResults(userId: string, days: number): Promise<TestResult[]>;
  save(result: TestResult): Promise<void>;
  delete(id: TestResultId): Promise<void>;
  getUserStats(userId: string): Promise<{
    totalTests: number;
    passedTests: number;
    averageScore: number;
    highestScore: number;
    recentPerformance: number[];
  }>;
  getPerformanceByCategory(userId: string): Promise<{
    category: string;
    averageScore: number;
    testCount: number;
  }[]>;
}
