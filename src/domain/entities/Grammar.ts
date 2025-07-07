import type { LevelType } from './User.js';

export class GrammarId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('GrammarId cannot be empty');
    }
    this.value = value;
  }
}

export class LessonId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('LessonId cannot be empty');
    }
    this.value = value;
  }
}

export type GrammarCategory = 
  | 'articles' 
  | 'nouns' 
  | 'verbs' 
  | 'adjectives' 
  | 'pronouns' 
  | 'prepositions' 
  | 'sentence-structure' 
  | 'tenses' 
  | 'cases' 
  | 'modal-verbs';

export type CaseType = 'nominative' | 'accusative' | 'dative' | 'genitive';
export type TenseType = 'present' | 'past' | 'perfect' | 'future';

export class GrammarRule {
  public readonly id: GrammarId;
  public readonly title: string;
  public readonly category: GrammarCategory;
  public readonly level: LevelType;
  public readonly description: string;
  public readonly explanation: string;
  public readonly examples: GrammarExample[];
  public readonly commonMistakes: string[];
  public readonly relatedRules: GrammarId[];
  public readonly tags: string[];
  public readonly difficulty: number; // 1-10 scale

  constructor(
    id: GrammarId,
    title: string,
    category: GrammarCategory,
    level: LevelType,
    description: string,
    explanation: string,
    examples: GrammarExample[] = [],
    commonMistakes: string[] = [],
    relatedRules: GrammarId[] = [],
    tags: string[] = [],
    difficulty: number = 5
  ) {
    if (!title || !description || !explanation) {
      throw new Error('Title, description, and explanation are required');
    }
    
    this.id = id;
    this.title = title;
    this.category = category;
    this.level = level;
    this.description = description;
    this.explanation = explanation;
    this.examples = examples;
    this.commonMistakes = commonMistakes;
    this.relatedRules = relatedRules;
    this.tags = tags;
    this.difficulty = Math.max(1, Math.min(10, difficulty));
  }

  static create(props: {
    title: string;
    category: GrammarCategory;
    level: LevelType;
    description: string;
    explanation: string;
    examples?: GrammarExample[];
    commonMistakes?: string[];
    relatedRules?: GrammarId[];
    tags?: string[];
    difficulty?: number;
  }): GrammarRule {
    return new GrammarRule(
      new GrammarId(crypto.randomUUID()),
      props.title,
      props.category,
      props.level,
      props.description,
      props.explanation,
      props.examples,
      props.commonMistakes,
      props.relatedRules,
      props.tags,
      props.difficulty
    );
  }

  isForLevel(level: LevelType): boolean {
    return this.level === level;
  }

  hasExamples(): boolean {
    return this.examples.length > 0;
  }

  getExamplesByType(type: 'correct' | 'incorrect'): GrammarExample[] {
    return this.examples.filter(example => example.type === type);
  }
}

export class GrammarExample {
  public readonly german: string;
  public readonly english: string;
  public readonly type: 'correct' | 'incorrect';
  public readonly explanation?: string;
  public readonly audioUrl?: string;

  constructor(
    german: string,
    english: string,
    type: 'correct' | 'incorrect',
    explanation?: string,
    audioUrl?: string
  ) {
    if (!german || !english) {
      throw new Error('German and English examples are required');
    }
    this.german = german;
    this.english = english;
    this.type = type;
    this.explanation = explanation;
    this.audioUrl = audioUrl;
  }
}

export class GrammarLesson {
  public readonly id: LessonId;
  public readonly title: string;
  public readonly category: GrammarCategory;
  public readonly level: LevelType;
  public readonly description: string;
  public readonly objectives: string[];
  public readonly rules: GrammarId[];
  public readonly exercises: GrammarExercise[];
  public readonly estimatedDuration: number; // in minutes
  public readonly prerequisiteRules: GrammarId[];
  public readonly tags: string[];

  constructor(
    id: LessonId,
    title: string,
    category: GrammarCategory,
    level: LevelType,
    description: string,
    objectives: string[],
    rules: GrammarId[],
    exercises: GrammarExercise[],
    estimatedDuration: number,
    prerequisiteRules: GrammarId[] = [],
    tags: string[] = []
  ) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.level = level;
    this.description = description;
    this.objectives = objectives;
    this.rules = rules;
    this.exercises = exercises;
    this.estimatedDuration = estimatedDuration;
    this.prerequisiteRules = prerequisiteRules;
    this.tags = tags;
  }

  static create(props: {
    title: string;
    category: GrammarCategory;
    level: LevelType;
    description: string;
    objectives: string[];
    rules: GrammarId[];
    exercises: GrammarExercise[];
    estimatedDuration: number;
    prerequisiteRules?: GrammarId[];
    tags?: string[];
  }): GrammarLesson {
    return new GrammarLesson(
      new LessonId(crypto.randomUUID()),
      props.title,
      props.category,
      props.level,
      props.description,
      props.objectives,
      props.rules,
      props.exercises,
      props.estimatedDuration,
      props.prerequisiteRules,
      props.tags
    );
  }

  getTotalExercises(): number {
    return this.exercises.length;
  }

  getExercisesByType(type: string): GrammarExercise[] {
    return this.exercises.filter(exercise => exercise.type === type);
  }
}

export class GrammarExercise {
  public readonly id: string;
  public readonly type: 'fill-blank' | 'multiple-choice' | 'transformation' | 'matching' | 'translation';
  public readonly question: string;
  public readonly options?: string[];
  public readonly correctAnswer: string | string[];
  public readonly explanation: string;
  public readonly hints: string[];
  public readonly difficulty: number; // 1-10

  constructor(
    id: string,
    type: 'fill-blank' | 'multiple-choice' | 'transformation' | 'matching' | 'translation',
    question: string,
    correctAnswer: string | string[],
    explanation: string,
    options?: string[],
    hints: string[] = [],
    difficulty: number = 5
  ) {
    this.id = id;
    this.type = type;
    this.question = question;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.explanation = explanation;
    this.hints = hints;
    this.difficulty = difficulty;
  }

  isMultipleChoice(): boolean {
    return this.type === 'multiple-choice';
  }

  hasOptions(): boolean {
    return this.options !== undefined && this.options.length > 0;
  }

  validateAnswer(answer: string | string[]): boolean {
    if (Array.isArray(this.correctAnswer)) {
      if (Array.isArray(answer)) {
        return this.correctAnswer.every(correct => answer.includes(correct));
      }
      return this.correctAnswer.includes(answer as string);
    }
    return this.correctAnswer === answer;
  }
}

export class GrammarProgress {
  public readonly ruleId: GrammarId;
  public readonly userId: string;
  public readonly masteryLevel: number; // 0-100
  public readonly timesStudied: number;
  public readonly correctAnswers: number;
  public readonly totalAttempts: number;
  public readonly lastStudied: Date;
  public readonly completedLessons: LessonId[];
  public readonly weakAreas: string[];

  constructor(
    ruleId: GrammarId,
    userId: string,
    masteryLevel: number = 0,
    timesStudied: number = 0,
    correctAnswers: number = 0,
    totalAttempts: number = 0,
    lastStudied: Date = new Date(),
    completedLessons: LessonId[] = [],
    weakAreas: string[] = []
  ) {
    this.ruleId = ruleId;
    this.userId = userId;
    this.masteryLevel = Math.max(0, Math.min(100, masteryLevel));
    this.timesStudied = timesStudied;
    this.correctAnswers = correctAnswers;
    this.totalAttempts = totalAttempts;
    this.lastStudied = lastStudied;
    this.completedLessons = completedLessons;
    this.weakAreas = weakAreas;
  }

  static create(ruleId: GrammarId, userId: string): GrammarProgress {
    return new GrammarProgress(ruleId, userId);
  }

  updateAfterCorrectAnswer(): GrammarProgress {
    const newCorrectAnswers = this.correctAnswers + 1;
    const newTotalAttempts = this.totalAttempts + 1;
    const newMasteryLevel = Math.min(100, this.masteryLevel + 8);
    const newTimesStudied = this.timesStudied + 1;

    return new GrammarProgress(
      this.ruleId,
      this.userId,
      newMasteryLevel,
      newTimesStudied,
      newCorrectAnswers,
      newTotalAttempts,
      new Date(),
      this.completedLessons,
      this.weakAreas
    );
  }

  updateAfterIncorrectAnswer(weakArea?: string): GrammarProgress {
    const newTotalAttempts = this.totalAttempts + 1;
    const newMasteryLevel = Math.max(0, this.masteryLevel - 3);
    const newTimesStudied = this.timesStudied + 1;
    const newWeakAreas = weakArea && !this.weakAreas.includes(weakArea) 
      ? [...this.weakAreas, weakArea] 
      : this.weakAreas;

    return new GrammarProgress(
      this.ruleId,
      this.userId,
      newMasteryLevel,
      newTimesStudied,
      this.correctAnswers,
      newTotalAttempts,
      new Date(),
      this.completedLessons,
      newWeakAreas
    );
  }

  completeLesson(lessonId: LessonId): GrammarProgress {
    if (this.completedLessons.some(id => id.value === lessonId.value)) {
      return this;
    }

    return new GrammarProgress(
      this.ruleId,
      this.userId,
      this.masteryLevel,
      this.timesStudied,
      this.correctAnswers,
      this.totalAttempts,
      this.lastStudied,
      [...this.completedLessons, lessonId],
      this.weakAreas
    );
  }

  getAccuracyRate(): number {
    return this.totalAttempts > 0 ? (this.correctAnswers / this.totalAttempts) * 100 : 0;
  }

  isMastered(): boolean {
    return this.masteryLevel >= 80 && this.timesStudied >= 3;
  }

  hasWeakAreas(): boolean {
    return this.weakAreas.length > 0;
  }
}
