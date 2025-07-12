import type { LevelType } from './User.js';

export class VocabularyId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('VocabularyId cannot be empty');
    }
    this.value = value;
  }
}

export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'article' | 'conjunction' | 'interjection';
export type Gender = 'der' | 'die' | 'das' | 'plural';

export class VocabularyWord {
  public readonly id: VocabularyId;
  public readonly german: string;
  public readonly english: string;
  public readonly type: WordType;
  public readonly level: LevelType;
  public readonly gender?: Gender;
  public readonly plural?: string;
  public readonly conjugations?: string[];
  public readonly pronunciation?: string;
  public readonly audioUrl?: string;
  public readonly exampleSentences: ExampleSentence[];
  public readonly tags: string[];
  public readonly frequency: number; // 1-10 scale, 10 being most common

  constructor(
    id: VocabularyId,
    german: string,
    english: string,
    type: WordType,
    level: LevelType,
    options: {
      gender?: Gender;
      plural?: string;
      conjugations?: string[];
      pronunciation?: string;
      audioUrl?: string;
      exampleSentences?: ExampleSentence[];
      tags?: string[];
      frequency?: number;
    } = {}
  ) {
    if (!german || !english) {
      throw new Error('German and English translations are required');
    }
    
    this.id = id;
    this.german = german;
    this.english = english;
    this.type = type;
    this.level = level;
    this.gender = options.gender;
    this.plural = options.plural;
    this.conjugations = options.conjugations;
    this.pronunciation = options.pronunciation;
    this.audioUrl = options.audioUrl;
    this.exampleSentences = options.exampleSentences || [];
    this.tags = options.tags || [];
    this.frequency = options.frequency || 5;
  }

  static create(props: {
    german: string;
    english: string;
    type: WordType;
    level: LevelType;
    gender?: Gender;
    plural?: string;
    conjugations?: string[];
    pronunciation?: string;
    audioUrl?: string;
    exampleSentences?: ExampleSentence[];
    tags?: string[];
    frequency?: number;
  }): VocabularyWord {
    return new VocabularyWord(
      new VocabularyId(crypto.randomUUID()),
      props.german,
      props.english,
      props.type,
      props.level,
      props
    );
  }

  isNoun(): boolean {
    return this.type === 'noun';
  }

  isVerb(): boolean {
    return this.type === 'verb';
  }

  hasGender(): boolean {
    return this.isNoun() && this.gender !== undefined;
  }

  getFullNoun(): string {
    if (this.isNoun() && this.gender) {
      return `${this.gender} ${this.german}`;
    }
    return this.german;
  }
}

export class ExampleSentence {
  public readonly german: string;
  public readonly english: string;
  public readonly audioUrl?: string;

  constructor(german: string, english: string, audioUrl?: string) {
    if (!german || !english) {
      throw new Error('German and English sentences are required');
    }
    this.german = german;
    this.english = english;
    this.audioUrl = audioUrl;
  }
}

export class VocabularyProgress {
  public readonly wordId: VocabularyId;
  public readonly userId: string;
  public readonly masteryLevel: number; // 0-100
  public readonly timesStudied: number;
  public readonly correctAnswers: number;
  public readonly totalAttempts: number;
  public readonly lastStudied: Date;
  public readonly nextReview: Date;
  public readonly easinessFactor: number; // for spaced repetition

  constructor(
    wordId: VocabularyId,
    userId: string,
    masteryLevel: number = 0,
    timesStudied: number = 0,
    correctAnswers: number = 0,
    totalAttempts: number = 0,
    lastStudied: Date = new Date(),
    nextReview: Date = new Date(),
    easinessFactor: number = 2.5
  ) {
    this.wordId = wordId;
    this.userId = userId;
    this.masteryLevel = Math.max(0, Math.min(100, masteryLevel));
    this.timesStudied = timesStudied;
    this.correctAnswers = correctAnswers;
    this.totalAttempts = totalAttempts;
    this.lastStudied = lastStudied;
    this.nextReview = nextReview;
    this.easinessFactor = easinessFactor;
  }

  static create(wordId: VocabularyId, userId: string): VocabularyProgress {
    return new VocabularyProgress(wordId, userId);
  }

  updateAfterCorrectAnswer(): VocabularyProgress {
    const newCorrectAnswers = this.correctAnswers + 1;
    const newTotalAttempts = this.totalAttempts + 1;
    const newMasteryLevel = Math.min(100, this.masteryLevel + 10);
    const newTimesStudied = this.timesStudied + 1;
    const newEasinessFactor = Math.max(1.3, this.easinessFactor + 0.1);
    
    // Calculate next review date based on spaced repetition
    const interval = this.calculateNextInterval(newEasinessFactor, newTimesStudied);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return new VocabularyProgress(
      this.wordId,
      this.userId,
      newMasteryLevel,
      newTimesStudied,
      newCorrectAnswers,
      newTotalAttempts,
      new Date(),
      nextReview,
      newEasinessFactor
    );
  }

  updateAfterIncorrectAnswer(): VocabularyProgress {
    const newTotalAttempts = this.totalAttempts + 1;
    const newMasteryLevel = Math.max(0, this.masteryLevel - 5);
    const newTimesStudied = this.timesStudied + 1;
    const newEasinessFactor = Math.max(1.3, this.easinessFactor - 0.2);
    
    // Reset interval for incorrect answers
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    return new VocabularyProgress(
      this.wordId,
      this.userId,
      newMasteryLevel,
      newTimesStudied,
      this.correctAnswers,
      newTotalAttempts,
      new Date(),
      nextReview,
      newEasinessFactor
    );
  }

  private calculateNextInterval(easinessFactor: number, timesStudied: number): number {
    if (timesStudied === 1) return 1;
    if (timesStudied === 2) return 6;
    return Math.round(this.calculateNextInterval(easinessFactor, timesStudied - 1) * easinessFactor);
  }

  getAccuracyRate(): number {
    return this.totalAttempts > 0 ? (this.correctAnswers / this.totalAttempts) * 100 : 0;
  }

  isReadyForReview(): boolean {
    return new Date() >= this.nextReview;
  }

  isMastered(): boolean {
    return this.masteryLevel >= 80 && this.timesStudied >= 3;
  }
}
