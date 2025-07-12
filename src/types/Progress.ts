import type { LevelType } from './User.js';

export class ProgressId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ProgressId cannot be empty');
    }
    this.value = value;
  }
}

export class StudySessionId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('StudySessionId cannot be empty');
    }
    this.value = value;
  }
}

export type ActivityType = 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'speaking' | 'writing' | 'test';

export class StudySession {
  public readonly id: StudySessionId;
  public readonly userId: string;
  public readonly activityType: ActivityType;
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly durationMinutes: number;
  public readonly itemsStudied: number;
  public readonly correctAnswers: number;
  public readonly totalAttempts: number;
  public readonly topicsStudied: string[];
  public readonly difficultyLevel: number;
  public readonly experienceGained: number;

  constructor(
    id: StudySessionId,
    userId: string,
    activityType: ActivityType,
    startTime: Date,
    endTime: Date,
    itemsStudied: number,
    correctAnswers: number,
    totalAttempts: number,
    topicsStudied: string[] = [],
    difficultyLevel: number = 1,
    experienceGained: number = 0
  ) {
    this.id = id;
    this.userId = userId;
    this.activityType = activityType;
    this.startTime = startTime;
    this.endTime = endTime;
    this.durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    this.itemsStudied = itemsStudied;
    this.correctAnswers = correctAnswers;
    this.totalAttempts = totalAttempts;
    this.topicsStudied = topicsStudied;
    this.difficultyLevel = difficultyLevel;
    this.experienceGained = experienceGained;
  }

  static create(props: {
    userId: string;
    activityType: ActivityType;
    startTime: Date;
    endTime: Date;
    itemsStudied: number;
    correctAnswers: number;
    totalAttempts: number;
    topicsStudied?: string[];
    difficultyLevel?: number;
  }): StudySession {
    const experienceGained = StudySession.calculateExperience(
      props.correctAnswers,
      props.totalAttempts,
      props.itemsStudied,
      props.difficultyLevel || 1
    );

    return new StudySession(
      new StudySessionId(crypto.randomUUID()),
      props.userId,
      props.activityType,
      props.startTime,
      props.endTime,
      props.itemsStudied,
      props.correctAnswers,
      props.totalAttempts,
      props.topicsStudied,
      props.difficultyLevel,
      experienceGained
    );
  }

  private static calculateExperience(
    correctAnswers: number,
    totalAttempts: number,
    itemsStudied: number,
    difficultyLevel: number
  ): number {
    const accuracyBonus = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 50 : 0;
    const volumeBonus = itemsStudied * 10;
    const difficultyBonus = difficultyLevel * 5;
    return Math.round(accuracyBonus + volumeBonus + difficultyBonus);
  }

  getAccuracyRate(): number {
    return this.totalAttempts > 0 ? (this.correctAnswers / this.totalAttempts) * 100 : 0;
  }

  isSuccessful(): boolean {
    return this.getAccuracyRate() >= 70;
  }
}

export class Achievement {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly iconUrl?: string;
  public readonly category: 'vocabulary' | 'grammar' | 'streak' | 'test' | 'milestone' | 'special';
  public readonly level: LevelType;
  public readonly points: number;
  public readonly requirement: AchievementRequirement;

  constructor(
    id: string,
    name: string,
    description: string,
    category: 'vocabulary' | 'grammar' | 'streak' | 'test' | 'milestone' | 'special',
    level: LevelType,
    points: number,
    requirement: AchievementRequirement,
    iconUrl?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.iconUrl = iconUrl;
    this.category = category;
    this.level = level;
    this.points = points;
    this.requirement = requirement;
  }

  checkRequirement(progress: UserProgress): boolean {
    return this.requirement.isMet(progress);
  }
}

export interface AchievementRequirement {
  isMet(progress: UserProgress): boolean;
}

export class VocabularyAchievementRequirement implements AchievementRequirement {
  private readonly wordsLearned: number;

  constructor(wordsLearned: number) {
    this.wordsLearned = wordsLearned;
  }

  isMet(progress: UserProgress): boolean {
    return progress.vocabularyStats.wordsLearned >= this.wordsLearned;
  }
}

export class StreakAchievementRequirement implements AchievementRequirement {
  private readonly streakDays: number;

  constructor(streakDays: number) {
    this.streakDays = streakDays;
  }

  isMet(progress: UserProgress): boolean {
    return progress.streakDays >= this.streakDays;
  }
}

export class TestAchievementRequirement implements AchievementRequirement {
  private readonly testsPassed: number;
  private readonly minScore: number;

  constructor(testsPassed: number, minScore: number) {
    this.testsPassed = testsPassed;
    this.minScore = minScore;
  }

  isMet(progress: UserProgress): boolean {
    return progress.testStats.testsPassed >= this.testsPassed && 
           progress.testStats.averageScore >= this.minScore;
  }
}

export class UserProgress {
  public readonly id: ProgressId;
  public readonly userId: string;
  public readonly currentLevel: LevelType;
  public readonly totalExperience: number;
  public readonly streakDays: number;
  public readonly lastStudyDate: Date;
  public readonly studyTimeToday: number; // in minutes
  public readonly studyTimeThisWeek: number; // in minutes
  public readonly studyTimeTotal: number; // in minutes
  public readonly vocabularyStats: VocabularyStats;
  public readonly grammarStats: GrammarStats;
  public readonly testStats: TestStats;
  public readonly achievements: string[]; // achievement IDs
  public readonly weeklyGoal: number; // in minutes
  public readonly dailyGoal: number; // in minutes
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: ProgressId,
    userId: string,
    currentLevel: LevelType,
    totalExperience: number,
    streakDays: number,
    lastStudyDate: Date,
    studyTimeToday: number,
    studyTimeThisWeek: number,
    studyTimeTotal: number,
    vocabularyStats: VocabularyStats,
    grammarStats: GrammarStats,
    testStats: TestStats,
    achievements: string[],
    weeklyGoal: number,
    dailyGoal: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.currentLevel = currentLevel;
    this.totalExperience = totalExperience;
    this.streakDays = streakDays;
    this.lastStudyDate = lastStudyDate;
    this.studyTimeToday = studyTimeToday;
    this.studyTimeThisWeek = studyTimeThisWeek;
    this.studyTimeTotal = studyTimeTotal;
    this.vocabularyStats = vocabularyStats;
    this.grammarStats = grammarStats;
    this.testStats = testStats;
    this.achievements = achievements;
    this.weeklyGoal = weeklyGoal;
    this.dailyGoal = dailyGoal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(userId: string, dailyGoal: number = 30, weeklyGoal: number = 210): UserProgress {
    const now = new Date();
    return new UserProgress(
      new ProgressId(crypto.randomUUID()),
      userId,
      'A1',
      0,
      0,
      now,
      0,
      0,
      0,
      VocabularyStats.create(),
      GrammarStats.create(),
      TestStats.create(),
      [],
      weeklyGoal,
      dailyGoal,
      now,
      now
    );
  }

  addStudySession(session: StudySession): UserProgress {
    const today = new Date();
    const isToday = this.isSameDay(today, session.startTime);
    const isThisWeek = this.isSameWeek(today, session.startTime);

    // Update streak
    const newStreakDays = this.calculateNewStreak(session.startTime);

    // Update study times
    const newStudyTimeToday = isToday ? this.studyTimeToday + session.durationMinutes : 
                              this.isSameDay(today, this.lastStudyDate) ? this.studyTimeToday : 0;
    const newStudyTimeThisWeek = isThisWeek ? this.studyTimeThisWeek + session.durationMinutes : 
                                 this.isSameWeek(today, this.lastStudyDate) ? this.studyTimeThisWeek : session.durationMinutes;
    const newStudyTimeTotal = this.studyTimeTotal + session.durationMinutes;

    // Update stats based on activity type
    let newVocabularyStats = this.vocabularyStats;
    let newGrammarStats = this.grammarStats;
    let newTestStats = this.testStats;

    if (session.activityType === 'vocabulary') {
      newVocabularyStats = this.vocabularyStats.addSession(session);
    } else if (session.activityType === 'grammar') {
      newGrammarStats = this.grammarStats.addSession(session);
    } else if (session.activityType === 'test') {
      newTestStats = this.testStats.addSession(session);
    }

    return new UserProgress(
      this.id,
      this.userId,
      this.currentLevel,
      this.totalExperience + session.experienceGained,
      newStreakDays,
      session.startTime,
      newStudyTimeToday,
      newStudyTimeThisWeek,
      newStudyTimeTotal,
      newVocabularyStats,
      newGrammarStats,
      newTestStats,
      this.achievements,
      this.weeklyGoal,
      this.dailyGoal,
      this.createdAt,
      new Date()
    );
  }

  addAchievement(achievementId: string): UserProgress {
    if (this.achievements.includes(achievementId)) {
      return this;
    }

    return new UserProgress(
      this.id,
      this.userId,
      this.currentLevel,
      this.totalExperience,
      this.streakDays,
      this.lastStudyDate,
      this.studyTimeToday,
      this.studyTimeThisWeek,
      this.studyTimeTotal,
      this.vocabularyStats,
      this.grammarStats,
      this.testStats,
      [...this.achievements, achievementId],
      this.weeklyGoal,
      this.dailyGoal,
      this.createdAt,
      new Date()
    );
  }

  private calculateNewStreak(studyDate: Date): number {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (this.isSameDay(today, studyDate)) {
      return this.streakDays;
    } else if (this.isSameDay(yesterday, studyDate)) {
      return this.streakDays + 1;
    } else {
      return 1; // Reset streak
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.abs(date1.getTime() - date2.getTime()) < oneWeek;
  }

  getDailyGoalProgress(): number {
    return this.dailyGoal > 0 ? (this.studyTimeToday / this.dailyGoal) * 100 : 0;
  }

  getWeeklyGoalProgress(): number {
    return this.weeklyGoal > 0 ? (this.studyTimeThisWeek / this.weeklyGoal) * 100 : 0;
  }

  getOverallProgress(): number {
    const vocabProgress = this.vocabularyStats.getOverallProgress();
    const grammarProgress = this.grammarStats.getOverallProgress();
    return (vocabProgress + grammarProgress) / 2;
  }

  getLevel(): number {
    return Math.floor(this.totalExperience / 1000) + 1;
  }

  getExperienceToNextLevel(): number {
    const currentLevel = this.getLevel();
    const experienceForNextLevel = currentLevel * 1000;
    return experienceForNextLevel - this.totalExperience;
  }
}

export class VocabularyStats {
  public readonly wordsLearned: number;
  public readonly wordsReviewed: number;
  public readonly wordsMastered: number;
  public readonly correctAnswers: number;
  public readonly totalAttempts: number;
  public readonly averageAccuracy: number;
  public readonly longestStreak: number;
  public readonly timeSpent: number; // in minutes

  constructor(
    wordsLearned: number,
    wordsReviewed: number,
    wordsMastered: number,
    correctAnswers: number,
    totalAttempts: number,
    averageAccuracy: number,
    longestStreak: number,
    timeSpent: number
  ) {
    this.wordsLearned = wordsLearned;
    this.wordsReviewed = wordsReviewed;
    this.wordsMastered = wordsMastered;
    this.correctAnswers = correctAnswers;
    this.totalAttempts = totalAttempts;
    this.averageAccuracy = averageAccuracy;
    this.longestStreak = longestStreak;
    this.timeSpent = timeSpent;
  }

  static create(): VocabularyStats {
    return new VocabularyStats(0, 0, 0, 0, 0, 0, 0, 0);
  }

  addSession(session: StudySession): VocabularyStats {
    const newCorrectAnswers = this.correctAnswers + session.correctAnswers;
    const newTotalAttempts = this.totalAttempts + session.totalAttempts;
    const newAverageAccuracy = newTotalAttempts > 0 ? (newCorrectAnswers / newTotalAttempts) * 100 : 0;

    return new VocabularyStats(
      this.wordsLearned + session.itemsStudied,
      this.wordsReviewed + session.itemsStudied,
      this.wordsMastered,
      newCorrectAnswers,
      newTotalAttempts,
      newAverageAccuracy,
      this.longestStreak,
      this.timeSpent + session.durationMinutes
    );
  }

  getOverallProgress(): number {
    // Assuming A1 level requires 500 words
    return Math.min(100, (this.wordsLearned / 500) * 100);
  }
}

export class GrammarStats {
  public readonly rulesLearned: number;
  public readonly rulesReviewed: number;
  public readonly rulesMastered: number;
  public readonly correctAnswers: number;
  public readonly totalAttempts: number;
  public readonly averageAccuracy: number;
  public readonly lessonsCompleted: number;
  public readonly timeSpent: number; // in minutes

  constructor(
    rulesLearned: number,
    rulesReviewed: number,
    rulesMastered: number,
    correctAnswers: number,
    totalAttempts: number,
    averageAccuracy: number,
    lessonsCompleted: number,
    timeSpent: number
  ) {
    this.rulesLearned = rulesLearned;
    this.rulesReviewed = rulesReviewed;
    this.rulesMastered = rulesMastered;
    this.correctAnswers = correctAnswers;
    this.totalAttempts = totalAttempts;
    this.averageAccuracy = averageAccuracy;
    this.lessonsCompleted = lessonsCompleted;
    this.timeSpent = timeSpent;
  }

  static create(): GrammarStats {
    return new GrammarStats(0, 0, 0, 0, 0, 0, 0, 0);
  }

  addSession(session: StudySession): GrammarStats {
    const newCorrectAnswers = this.correctAnswers + session.correctAnswers;
    const newTotalAttempts = this.totalAttempts + session.totalAttempts;
    const newAverageAccuracy = newTotalAttempts > 0 ? (newCorrectAnswers / newTotalAttempts) * 100 : 0;

    return new GrammarStats(
      this.rulesLearned + session.itemsStudied,
      this.rulesReviewed + session.itemsStudied,
      this.rulesMastered,
      newCorrectAnswers,
      newTotalAttempts,
      newAverageAccuracy,
      this.lessonsCompleted,
      this.timeSpent + session.durationMinutes
    );
  }

  getOverallProgress(): number {
    // Assuming A1 level requires 20 grammar rules
    return Math.min(100, (this.rulesLearned / 20) * 100);
  }
}

export class TestStats {
  public readonly testsTaken: number;
  public readonly testsPassed: number;
  public readonly averageScore: number;
  public readonly highestScore: number;
  public readonly totalQuestions: number;
  public readonly correctAnswers: number;
  public readonly timeSpent: number; // in minutes

  constructor(
    testsTaken: number,
    testsPassed: number,
    averageScore: number,
    highestScore: number,
    totalQuestions: number,
    correctAnswers: number,
    timeSpent: number
  ) {
    this.testsTaken = testsTaken;
    this.testsPassed = testsPassed;
    this.averageScore = averageScore;
    this.highestScore = highestScore;
    this.totalQuestions = totalQuestions;
    this.correctAnswers = correctAnswers;
    this.timeSpent = timeSpent;
  }

  static create(): TestStats {
    return new TestStats(0, 0, 0, 0, 0, 0, 0);
  }

  addSession(session: StudySession): TestStats {
    const sessionScore = session.totalAttempts > 0 ? (session.correctAnswers / session.totalAttempts) * 100 : 0;
    const newTestsTaken = this.testsTaken + 1;
    const newTestsPassed = sessionScore >= 70 ? this.testsPassed + 1 : this.testsPassed;
    const newAverageScore = (this.averageScore * this.testsTaken + sessionScore) / newTestsTaken;
    const newHighestScore = Math.max(this.highestScore, sessionScore);

    return new TestStats(
      newTestsTaken,
      newTestsPassed,
      newAverageScore,
      newHighestScore,
      this.totalQuestions + session.totalAttempts,
      this.correctAnswers + session.correctAnswers,
      this.timeSpent + session.durationMinutes
    );
  }

  getPassRate(): number {
    return this.testsTaken > 0 ? (this.testsPassed / this.testsTaken) * 100 : 0;
  }
}
