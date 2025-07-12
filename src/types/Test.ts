import type { LevelType } from './User.js';

export class TestId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TestId cannot be empty');
    }
    this.value = value;
  }
}

export class QuestionId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('QuestionId cannot be empty');
    }
    this.value = value;
  }
}

export type TestType = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'writing' | 'speaking' | 'mixed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'translation' | 'matching' | 'audio' | 'essay';

export class Question {
  public readonly id: QuestionId;
  public readonly type: QuestionType;
  public readonly difficulty: Difficulty;
  public readonly level: LevelType;
  public readonly content: QuestionContent;
  public readonly correctAnswer: string | string[];
  public readonly explanation?: string;
  public readonly tags: string[];
  public readonly timeLimit?: number; // in seconds

  constructor(
    id: QuestionId,
    type: QuestionType,
    difficulty: Difficulty,
    level: LevelType,
    content: QuestionContent,
    correctAnswer: string | string[],
    explanation?: string,
    tags: string[] = [],
    timeLimit?: number
  ) {
    this.id = id;
    this.type = type;
    this.difficulty = difficulty;
    this.level = level;
    this.content = content;
    this.correctAnswer = correctAnswer;
    this.explanation = explanation;
    this.tags = tags;
    this.timeLimit = timeLimit;
  }

  static create(props: {
    type: QuestionType;
    difficulty: Difficulty;
    level: LevelType;
    content: QuestionContent;
    correctAnswer: string | string[];
    explanation?: string;
    tags?: string[];
    timeLimit?: number;
  }): Question {
    return new Question(
      new QuestionId(crypto.randomUUID()),
      props.type,
      props.difficulty,
      props.level,
      props.content,
      props.correctAnswer,
      props.explanation,
      props.tags || [],
      props.timeLimit
    );
  }

  validateAnswer(userAnswer: string | string[]): boolean {
    if (Array.isArray(this.correctAnswer)) {
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      return this.correctAnswer.every(answer => 
        userAnswers.some(userAns => 
          this.normalizeAnswer(userAns) === this.normalizeAnswer(answer)
        )
      );
    }
    
    const normalizedUser = this.normalizeAnswer(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer);
    const normalizedCorrect = this.normalizeAnswer(this.correctAnswer);
    return normalizedUser === normalizedCorrect;
  }

  private normalizeAnswer(answer: string): string {
    return answer.trim().toLowerCase().replace(/[.,!?;]/g, '');
  }
}

export class QuestionContent {
  public readonly text: string;
  public readonly options?: string[];
  public readonly audioUrl?: string;
  public readonly imageUrl?: string;
  public readonly context?: string;

  constructor(
    text: string,
    options?: string[],
    audioUrl?: string,
    imageUrl?: string,
    context?: string
  ) {
    this.text = text;
    this.options = options;
    this.audioUrl = audioUrl;
    this.imageUrl = imageUrl;
    this.context = context;
  }
}

export class TestAttempt {
  public readonly questionId: QuestionId;
  public readonly userAnswer: string | string[];
  public readonly isCorrect: boolean;
  public readonly timeSpent: number; // in seconds
  public readonly timestamp: Date;

  constructor(
    questionId: QuestionId,
    userAnswer: string | string[],
    isCorrect: boolean,
    timeSpent: number,
    timestamp: Date = new Date()
  ) {
    this.questionId = questionId;
    this.userAnswer = userAnswer;
    this.isCorrect = isCorrect;
    this.timeSpent = timeSpent;
    this.timestamp = timestamp;
  }
}

export class TestSession {
  public readonly id: TestId;
  public readonly type: TestType;
  public readonly level: LevelType;
  public readonly questions: Question[];
  public readonly startedAt: Date;
  public readonly completedAt?: Date;
  public readonly attempts: TestAttempt[];
  public readonly currentQuestionIndex: number;
  public readonly isCompleted: boolean;

  constructor(
    id: TestId,
    type: TestType,
    level: LevelType,
    questions: Question[],
    startedAt: Date,
    completedAt?: Date,
    attempts: TestAttempt[] = [],
    currentQuestionIndex: number = 0,
    isCompleted: boolean = false
  ) {
    this.id = id;
    this.type = type;
    this.level = level;
    this.questions = questions;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.attempts = attempts;
    this.currentQuestionIndex = currentQuestionIndex;
    this.isCompleted = isCompleted;
  }

  static create(
    type: TestType,
    level: LevelType,
    questions: Question[]
  ): TestSession {
    return new TestSession(
      new TestId(crypto.randomUUID()),
      type,
      level,
      questions,
      new Date()
    );
  }

  answerQuestion(
    questionId: QuestionId,
    userAnswer: string | string[],
    timeSpent: number
  ): TestSession {
    const question = this.questions.find(q => q.id.value === questionId.value);
    if (!question) {
      throw new Error('Question not found in this test session');
    }

    const isCorrect = question.validateAnswer(userAnswer);
    const attempt = new TestAttempt(questionId, userAnswer, isCorrect, timeSpent);
    
    const newAttempts = [...this.attempts, attempt];
    const newCurrentIndex = this.currentQuestionIndex + 1;
    const newIsCompleted = newCurrentIndex >= this.questions.length;

    return new TestSession(
      this.id,
      this.type,
      this.level,
      this.questions,
      this.startedAt,
      newIsCompleted ? new Date() : this.completedAt,
      newAttempts,
      newCurrentIndex,
      newIsCompleted
    );
  }

  getScore(): TestScore {
    if (!this.isCompleted) {
      throw new Error('Cannot calculate score for incomplete test');
    }

    const totalQuestions = this.questions.length;
    const correctAnswers = this.attempts.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTime = this.attempts.reduce((sum, a) => sum + a.timeSpent, 0);

    return new TestScore(
      percentage,
      correctAnswers,
      totalQuestions,
      totalTime,
      this.getGrade(percentage),
      this.getDetailsByCategory()
    );
  }

  private getGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  }

  private getDetailsByCategory(): Record<string, { correct: number; total: number }> {
    const categories: Record<string, { correct: number; total: number }> = {};
    
    this.questions.forEach((question, index) => {
      question.tags.forEach(tag => {
        if (!categories[tag]) {
          categories[tag] = { correct: 0, total: 0 };
        }
        categories[tag].total++;
        
        const attempt = this.attempts[index];
        if (attempt && attempt.isCorrect) {
          categories[tag].correct++;
        }
      });
    });

    return categories;
  }

  getCurrentQuestion(): Question | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentQuestionIndex,
      total: this.questions.length,
      percentage: Math.round((this.currentQuestionIndex / this.questions.length) * 100)
    };
  }
}

export class TestScore {
  public readonly percentage: number;
  public readonly correctAnswers: number;
  public readonly totalQuestions: number;
  public readonly totalTime: number;
  public readonly grade: string;
  public readonly detailsByCategory: Record<string, { correct: number; total: number }>;

  constructor(
    percentage: number,
    correctAnswers: number,
    totalQuestions: number,
    totalTime: number,
    grade: string,
    detailsByCategory: Record<string, { correct: number; total: number }>
  ) {
    this.percentage = percentage;
    this.correctAnswers = correctAnswers;
    this.totalQuestions = totalQuestions;
    this.totalTime = totalTime;
    this.grade = grade;
    this.detailsByCategory = detailsByCategory;
  }

  isPassing(passingScore: number = 60): boolean {
    return this.percentage >= passingScore;
  }

  getWeakAreas(): string[] {
    return Object.entries(this.detailsByCategory)
      .filter(([, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([category]) => category);
  }

  getStrengths(): string[] {
    return Object.entries(this.detailsByCategory)
      .filter(([, stats]) => (stats.correct / stats.total) >= 0.8)
      .map(([category]) => category);
  }
}

export class Test {
  public readonly id: TestId;
  public readonly title: string;
  public readonly description: string;
  public readonly type: TestType;
  public readonly level: LevelType;
  public readonly difficulty: Difficulty;
  public readonly questions: Question[];
  public readonly timeLimit: number; // in minutes
  public readonly passingScore: number;
  public readonly tags: string[];
  public readonly isAdaptive: boolean;
  public readonly createdAt: Date;

  constructor(
    id: TestId,
    title: string,
    description: string,
    type: TestType,
    level: LevelType,
    difficulty: Difficulty,
    questions: Question[],
    timeLimit: number,
    passingScore: number,
    tags: string[] = [],
    isAdaptive: boolean = false,
    createdAt: Date = new Date()
  ) {
    if (questions.length === 0) {
      throw new Error('Test must have at least one question');
    }
    
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.level = level;
    this.difficulty = difficulty;
    this.questions = questions;
    this.timeLimit = timeLimit;
    this.passingScore = passingScore;
    this.tags = tags;
    this.isAdaptive = isAdaptive;
    this.createdAt = createdAt;
  }

  static create(props: {
    title: string;
    description: string;
    type: TestType;
    level: LevelType;
    difficulty: Difficulty;
    questions: Question[];
    timeLimit: number;
    passingScore?: number;
    tags?: string[];
    isAdaptive?: boolean;
  }): Test {
    return new Test(
      new TestId(crypto.randomUUID()),
      props.title,
      props.description,
      props.type,
      props.level,
      props.difficulty,
      props.questions,
      props.timeLimit,
      props.passingScore || 60,
      props.tags,
      props.isAdaptive,
      new Date()
    );
  }

  createSession(): TestSession {
    return new TestSession(
      this.id,
      this.type,
      this.level,
      this.questions,
      new Date(),
      undefined,
      [],
      0,
      false
    );
  }

  getQuestionsCount(): number {
    return this.questions.length;
  }

  getQuestionsByType(type: QuestionType): Question[] {
    return this.questions.filter(q => q.type === type);
  }

  getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
    return this.questions.filter(q => q.difficulty === difficulty);
  }

  getEstimatedDuration(): number {
    const questionTime = this.questions.reduce((total, question) => {
      return total + (question.timeLimit || 60);
    }, 0);
    return Math.min(questionTime / 60, this.timeLimit);
  }
}

export class TestResultId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TestResultId cannot be empty');
    }
    this.value = value;
  }
}

export class TestResult {
  public readonly id: TestResultId;
  public readonly userId: string;
  public readonly testId: TestId;
  public readonly score: TestScore;
  public readonly attempts: TestAttempt[];
  public readonly startedAt: Date;
  public readonly completedAt: Date;
  public readonly timeSpent: number; // in minutes
  public readonly isPassed: boolean;
  public readonly feedback: string[];
  public readonly recommendations: string[];

  constructor(
    id: TestResultId,
    userId: string,
    testId: TestId,
    score: TestScore,
    attempts: TestAttempt[],
    startedAt: Date,
    completedAt: Date,
    timeSpent: number,
    isPassed: boolean,
    feedback: string[] = [],
    recommendations: string[] = []
  ) {
    this.id = id;
    this.userId = userId;
    this.testId = testId;
    this.score = score;
    this.attempts = attempts;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.timeSpent = timeSpent;
    this.isPassed = isPassed;
    this.feedback = feedback;
    this.recommendations = recommendations;
  }

  static create(props: {
    userId: string;
    testId: TestId;
    score: TestScore;
    attempts: TestAttempt[];
    startedAt: Date;
    completedAt: Date;
    timeSpent: number;
    passingScore?: number;
  }): TestResult {
    const isPassed = props.score.isPassing(props.passingScore || 60);
    const feedback = TestResult.generateFeedback(props.score, isPassed);
    const recommendations = TestResult.generateRecommendations(props.score);

    return new TestResult(
      new TestResultId(crypto.randomUUID()),
      props.userId,
      props.testId,
      props.score,
      props.attempts,
      props.startedAt,
      props.completedAt,
      props.timeSpent,
      isPassed,
      feedback,
      recommendations
    );
  }

  private static generateFeedback(score: TestScore, isPassed: boolean): string[] {
    const feedback: string[] = [];
    
    if (isPassed) {
      feedback.push(`Congratulations! You passed with ${score.percentage}%.`);
    } else {
      feedback.push(`You scored ${score.percentage}%. Keep practicing to improve!`);
    }

    if (score.percentage >= 90) {
      feedback.push('Excellent work! You have a strong grasp of the material.');
    } else if (score.percentage >= 70) {
      feedback.push('Good job! You understand most of the concepts.');
    } else if (score.percentage >= 50) {
      feedback.push('Fair performance. Focus on the areas where you struggled.');
    } else {
      feedback.push('Consider reviewing the material before retaking the test.');
    }

    return feedback;
  }

  private static generateRecommendations(score: TestScore): string[] {
    const recommendations: string[] = [];
    const weakAreas = score.getWeakAreas();
    const strengths = score.getStrengths();

    if (weakAreas.length > 0) {
      recommendations.push(`Focus on improving: ${weakAreas.join(', ')}`);
    }

    if (strengths.length > 0) {
      recommendations.push(`Your strengths: ${strengths.join(', ')}`);
    }

    if (score.percentage < 60) {
      recommendations.push('Consider reviewing the study material and taking practice exercises.');
      recommendations.push('Try breaking down complex topics into smaller, manageable parts.');
    }

    return recommendations;
  }

  getAccuracy(): number {
    return this.score.percentage;
  }

  getTimeEfficiency(): number {
    // Calculate questions per minute
    const totalQuestions = this.score.totalQuestions;
    return this.timeSpent > 0 ? totalQuestions / this.timeSpent : 0;
  }

  getDetailedResults(): {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[] {
    return Object.entries(this.score.detailsByCategory).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));
  }
}
