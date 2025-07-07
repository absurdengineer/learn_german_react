import { UserProgress } from '../entities/Progress.js';
import type { Difficulty, TestType } from '../entities/Test.js';
import { Question, Test, TestId, TestResult, TestSession } from '../entities/Test.js';
import type { LevelType } from '../entities/User.js';
import type { ProgressRepository } from '../repositories/ProgressRepository.js';
import type { QuestionRepository, TestRepository, TestResultRepository } from '../repositories/TestRepository.js';

export class TestService {
  private readonly testRepository: TestRepository;
  private readonly questionRepository: QuestionRepository;
  private readonly testResultRepository: TestResultRepository;
  private readonly progressRepository: ProgressRepository;

  constructor(
    testRepository: TestRepository,
    questionRepository: QuestionRepository,
    testResultRepository: TestResultRepository,
    progressRepository: ProgressRepository
  ) {
    this.testRepository = testRepository;
    this.questionRepository = questionRepository;
    this.testResultRepository = testResultRepository;
    this.progressRepository = progressRepository;
  }

  async generateAdaptiveTest(
    userId: string,
    level: LevelType,
    questionCount: number = 20
  ): Promise<Test> {
    const userProgress = await this.progressRepository.findByUserId(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // Get user's weak areas and performance history
    const recentResults = await this.testResultRepository.findRecentResults(userId, 30);
    const weakAreas = this.identifyWeakAreas(recentResults);
    const strongAreas = this.identifyStrongAreas(recentResults);

    // Generate questions based on user's performance
    const questions = await this.generateAdaptiveQuestions(
      userId,
      level,
      questionCount,
      weakAreas,
      strongAreas
    );

    return Test.create({
      title: `Adaptive ${level} Test`,
      description: `Personalized test based on your learning progress`,
      type: 'mixed',
      level,
      difficulty: this.calculateUserDifficulty(userProgress, recentResults),
      questions,
      timeLimit: Math.max(questionCount * 2, 30), // 2 minutes per question minimum
      passingScore: 60,
      tags: ['adaptive', level.toLowerCase()],
      isAdaptive: true
    });
  }

  async generateRandomTest(
    level: LevelType,
    type: TestType,
    questionCount: number = 20
  ): Promise<Test> {
    return await this.testRepository.generateRandomTest(level, type, questionCount);
  }

  async getTestById(testId: TestId): Promise<Test | null> {
    return await this.testRepository.findById(testId);
  }

  async getTestsByLevel(level: LevelType): Promise<Test[]> {
    return await this.testRepository.findByLevel(level);
  }

  async getTestsByType(type: TestType): Promise<Test[]> {
    return await this.testRepository.findByType(type);
  }

  async submitTestResult(
    userId: string,
    testSession: TestSession
  ): Promise<TestResult> {
    if (!testSession.isCompleted) {
      throw new Error('Test session is not completed');
    }

    const score = testSession.getScore();
    const result = TestResult.create({
      userId,
      testId: testSession.id,
      score,
      attempts: testSession.attempts,
      startedAt: testSession.startedAt,
      completedAt: testSession.completedAt!,
      timeSpent: Math.round((testSession.completedAt!.getTime() - testSession.startedAt.getTime()) / (1000 * 60)),
      passingScore: 60
    });

    await this.testResultRepository.save(result);

    // Update user progress
    await this.updateUserProgressFromTest(userId, result);

    return result;
  }

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    return await this.testResultRepository.findByUserId(userId);
  }

  async getUserTestStats(userId: string): Promise<{
    totalTests: number;
    passedTests: number;
    averageScore: number;
    highestScore: number;
    recentPerformance: number[];
  }> {
    return await this.testResultRepository.getUserStats(userId);
  }

  async getPerformanceByCategory(userId: string): Promise<{
    category: string;
    averageScore: number;
    testCount: number;
  }[]> {
    return await this.testResultRepository.getPerformanceByCategory(userId);
  }

  async retakeTest(testId: TestId): Promise<Test> {
    const test = await this.testRepository.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Create a new test with shuffled questions
    const shuffledQuestions = this.shuffleArray([...test.questions]);
    
    return Test.create({
      title: `${test.title} (Retake)`,
      description: test.description,
      type: test.type,
      level: test.level,
      difficulty: test.difficulty,
      questions: shuffledQuestions,
      timeLimit: test.timeLimit,
      passingScore: test.passingScore,
      tags: [...test.tags, 'retake'],
      isAdaptive: test.isAdaptive
    });
  }

  private async generateAdaptiveQuestions(
    _userId: string,
    level: LevelType,
    questionCount: number,
    weakAreas: string[],
    strongAreas: string[]
  ): Promise<Question[]> {
    const questions: Question[] = [];
    
    // 40% questions from weak areas
    const weakAreaQuestions = Math.floor(questionCount * 0.4);
    for (let i = 0; i < weakAreaQuestions && weakAreas.length > 0; i++) {
      const area = weakAreas[i % weakAreas.length];
      const areaQuestions = await this.questionRepository.findByTags([area]);
      const levelQuestions = areaQuestions.filter(q => q.level === level);
      if (levelQuestions.length > 0) {
        questions.push(levelQuestions[Math.floor(Math.random() * levelQuestions.length)]);
      }
    }
    
    // 30% questions from strong areas (to maintain confidence)
    const strongAreaQuestions = Math.floor(questionCount * 0.3);
    for (let i = 0; i < strongAreaQuestions && strongAreas.length > 0; i++) {
      const area = strongAreas[i % strongAreas.length];
      const areaQuestions = await this.questionRepository.findByTags([area]);
      const levelQuestions = areaQuestions.filter(q => q.level === level);
      if (levelQuestions.length > 0) {
        questions.push(levelQuestions[Math.floor(Math.random() * levelQuestions.length)]);
      }
    }
    
    // 30% random questions from the level
    const randomQuestions = questionCount - questions.length;
    const additionalQuestions = await this.questionRepository.getRandomQuestions(
      randomQuestions,
      level
    );
    questions.push(...additionalQuestions);
    
    return this.shuffleArray(questions.slice(0, questionCount));
  }

  private identifyWeakAreas(results: TestResult[]): string[] {
    const categoryScores: Record<string, { total: number; scores: number[] }> = {};
    
    results.forEach(result => {
      Object.entries(result.score.detailsByCategory).forEach(([category, stats]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, scores: [] };
        }
        const percentage = (stats.correct / stats.total) * 100;
        categoryScores[category].scores.push(percentage);
        categoryScores[category].total += stats.total;
      });
    });
    
    return Object.entries(categoryScores)
      .filter(([, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        return avgScore < 70 && data.total >= 3; // Weak if avg < 70% and at least 3 questions
      })
      .map(([category]) => category);
  }

  private identifyStrongAreas(results: TestResult[]): string[] {
    const categoryScores: Record<string, { total: number; scores: number[] }> = {};
    
    results.forEach(result => {
      Object.entries(result.score.detailsByCategory).forEach(([category, stats]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, scores: [] };
        }
        const percentage = (stats.correct / stats.total) * 100;
        categoryScores[category].scores.push(percentage);
        categoryScores[category].total += stats.total;
      });
    });
    
    return Object.entries(categoryScores)
      .filter(([, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        return avgScore >= 80 && data.total >= 3; // Strong if avg >= 80% and at least 3 questions
      })
      .map(([category]) => category);
  }

  private calculateUserDifficulty(
    userProgress: UserProgress,
    recentResults: TestResult[]
  ): Difficulty {
    if (recentResults.length === 0) {
      return 'beginner';
    }

    const averageScore = recentResults.reduce((sum, result) => sum + result.score.percentage, 0) / recentResults.length;
    const overallProgress = userProgress.getOverallProgress();
    
    if (averageScore >= 80 && overallProgress >= 70) {
      return 'advanced';
    } else if (averageScore >= 60 && overallProgress >= 40) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  private async updateUserProgressFromTest(userId: string, _result: TestResult): Promise<void> {
    const userProgress = await this.progressRepository.findByUserId(userId);
    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // TODO: Create a study session from the test result if needed
    // const studySession = {
    //   userId,
    //   activityType: 'test' as const,
    //   startTime: result.startedAt,
    //   endTime: result.completedAt,
    //   itemsStudied: result.score.totalQuestions,
    //   correctAnswers: result.score.correctAnswers,
    //   totalAttempts: result.score.totalQuestions,
    //   topicsStudied: Object.keys(result.score.detailsByCategory),
    //   difficultyLevel: result.score.percentage >= 80 ? 3 : result.score.percentage >= 60 ? 2 : 1
    // };

    // This would normally create a StudySession entity, but for simplicity we'll update progress directly
    // In a real implementation, you'd create a StudySession and add it to progress
    await this.progressRepository.save(userProgress);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
