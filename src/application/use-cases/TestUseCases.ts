import type { TestType } from '../../domain/entities/Test.js';
import { Test, TestId, TestResult, TestSession } from '../../domain/entities/Test.js';
import type { LevelType } from '../../domain/entities/User.js';
import { TestService } from '../../domain/services/TestService.js';

export class GenerateAdaptiveTestUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(request: {
    userId: string;
    level: LevelType;
    questionCount?: number;
  }): Promise<{
    success: boolean;
    test?: Test;
    error?: string;
  }> {
    try {
      const test = await this.testService.generateAdaptiveTest(
        request.userId,
        request.level,
        request.questionCount
      );
      
      return {
        success: true,
        test
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GenerateRandomTestUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(request: {
    level: LevelType;
    type: TestType;
    questionCount?: number;
  }): Promise<{
    success: boolean;
    test?: Test;
    error?: string;
  }> {
    try {
      const test = await this.testService.generateRandomTest(
        request.level,
        request.type,
        request.questionCount
      );
      
      return {
        success: true,
        test
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetTestUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(testId: string): Promise<{
    success: boolean;
    test?: Test;
    error?: string;
  }> {
    try {
      const test = await this.testService.getTestById(new TestId(testId));
      if (!test) {
        return {
          success: false,
          error: 'Test not found'
        };
      }
      
      return {
        success: true,
        test
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class SubmitTestResultUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(request: {
    userId: string;
    testSession: TestSession;
  }): Promise<{
    success: boolean;
    result?: TestResult;
    error?: string;
  }> {
    try {
      const result = await this.testService.submitTestResult(
        request.userId,
        request.testSession
      );
      
      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetTestResultsUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    results?: TestResult[];
    error?: string;
  }> {
    try {
      const results = await this.testService.getUserTestResults(userId);
      return {
        success: true,
        results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetTestStatsUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    stats?: {
      totalTests: number;
      passedTests: number;
      averageScore: number;
      highestScore: number;
      recentPerformance: number[];
    };
    error?: string;
  }> {
    try {
      const stats = await this.testService.getUserTestStats(userId);
      return {
        success: true,
        stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetPerformanceByCategoryUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    performance?: {
      category: string;
      averageScore: number;
      testCount: number;
    }[];
    error?: string;
  }> {
    try {
      const performance = await this.testService.getPerformanceByCategory(userId);
      return {
        success: true,
        performance
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class RetakeTestUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(testId: string): Promise<{
    success: boolean;
    test?: Test;
    error?: string;
  }> {
    try {
      const test = await this.testService.retakeTest(new TestId(testId));
      return {
        success: true,
        test
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetTestsByLevelUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(level: LevelType): Promise<{
    success: boolean;
    tests?: Test[];
    error?: string;
  }> {
    try {
      const tests = await this.testService.getTestsByLevel(level);
      return {
        success: true,
        tests
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetTestsByTypeUseCase {
  private readonly testService: TestService;

  constructor(testService: TestService) {
    this.testService = testService;
  }

  async execute(type: TestType): Promise<{
    success: boolean;
    tests?: Test[];
    error?: string;
  }> {
    try {
      const tests = await this.testService.getTestsByType(type);
      return {
        success: true,
        tests
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
