import type { LevelType } from '../../types/User.js';
import type { WordType } from '../../types/Vocabulary.js';
import { VocabularyId, VocabularyProgress, VocabularyWord } from '../../types/Vocabulary.js';
import type { VocabularyProgressRepository, VocabularyRepository } from '../domain/VocabularyRepository.js';

export class InMemoryVocabularyRepository implements VocabularyRepository {
  private words: VocabularyWord[] = [];

  constructor() {
    // Initialize with some basic words
    this.words = [
      VocabularyWord.create({
        german: 'Hallo',
        english: 'Hello',
        type: 'interjection',
        level: 'A1',
        frequency: 10,
        tags: ['greetings', 'basic']
      }),
      VocabularyWord.create({
        german: 'Haus',
        english: 'House',
        type: 'noun',
        level: 'A1',
        gender: 'das',
        frequency: 9,
        tags: ['buildings', 'living']
      }),
      VocabularyWord.create({
        german: 'sein',
        english: 'to be',
        type: 'verb',
        level: 'A1',
        frequency: 10,
        tags: ['verbs', 'basic', 'irregular']
      })
    ];
  }

  async findById(id: VocabularyId): Promise<VocabularyWord | null> {
    return this.words.find(word => word.id.value === id.value) || null;
  }

  async findByLevel(level: LevelType): Promise<VocabularyWord[]> {
    return this.words.filter(word => word.level === level);
  }

  async findByType(type: WordType): Promise<VocabularyWord[]> {
    return this.words.filter(word => word.type === type);
  }

  async findByLevelAndType(level: LevelType, type: WordType): Promise<VocabularyWord[]> {
    return this.words.filter(word => word.level === level && word.type === type);
  }

  async findByFrequency(minFrequency: number): Promise<VocabularyWord[]> {
    return this.words.filter(word => word.frequency >= minFrequency);
  }

  async findByTags(tags: string[]): Promise<VocabularyWord[]> {
    return this.words.filter(word => 
      tags.some(tag => word.tags.includes(tag))
    );
  }

  async findAll(): Promise<VocabularyWord[]> {
    return [...this.words];
  }

  async save(word: VocabularyWord): Promise<void> {
    const index = this.words.findIndex(w => w.id.value === word.id.value);
    if (index >= 0) {
      this.words[index] = word;
    } else {
      this.words.push(word);
    }
  }

  async delete(id: VocabularyId): Promise<void> {
    this.words = this.words.filter(word => word.id.value !== id.value);
  }

  async search(query: string): Promise<VocabularyWord[]> {
    const lowerQuery = query.toLowerCase();
    return this.words.filter(word => 
      word.german.toLowerCase().includes(lowerQuery) ||
      word.english.toLowerCase().includes(lowerQuery) ||
      word.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getRandomWords(count: number, level?: LevelType): Promise<VocabularyWord[]> {
    const filteredWords = level 
      ? this.words.filter(word => word.level === level)
      : this.words;
    
    const shuffled = [...filteredWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export class LocalStorageVocabularyProgressRepository implements VocabularyProgressRepository {
  private readonly storageKey = 'german-learning-vocabulary-progress';

  async findByUserId(userId: string): Promise<VocabularyProgress[]> {
    const allProgress = this.getAllProgress();
    return allProgress.filter(progress => progress.userId === userId);
  }

  async findByUserIdAndWordId(userId: string, wordId: VocabularyId): Promise<VocabularyProgress | null> {
    const allProgress = this.getAllProgress();
    return allProgress.find(progress => 
      progress.userId === userId && progress.wordId.value === wordId.value
    ) || null;
  }

  async findWordsReadyForReview(userId: string): Promise<VocabularyProgress[]> {
    const userProgress = await this.findByUserId(userId);
    return userProgress.filter(progress => progress.isReadyForReview());
  }

  async findMasteredWords(userId: string): Promise<VocabularyProgress[]> {
    const userProgress = await this.findByUserId(userId);
    return userProgress.filter(progress => progress.isMastered());
  }

  async save(progress: VocabularyProgress): Promise<void> {
    const allProgress = this.getAllProgress();
    const index = allProgress.findIndex(p => 
      p.userId === progress.userId && p.wordId.value === progress.wordId.value
    );
    
    if (index >= 0) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(
      allProgress.map(p => this.serializeProgress(p))
    ));
  }

  async delete(userId: string, wordId: VocabularyId): Promise<void> {
    const allProgress = this.getAllProgress();
    const filteredProgress = allProgress.filter(p => 
      !(p.userId === userId && p.wordId.value === wordId.value)
    );
    
    localStorage.setItem(this.storageKey, JSON.stringify(
      filteredProgress.map(p => this.serializeProgress(p))
    ));
  }

  async getUserStats(userId: string): Promise<{
    totalWords: number;
    masteredWords: number;
    averageAccuracy: number;
    wordsStudiedToday: number;
  }> {
    const userProgress = await this.findByUserId(userId);
    const masteredWords = userProgress.filter(p => p.isMastered()).length;
    const totalAttempts = userProgress.reduce((sum, p) => sum + p.totalAttempts, 0);
    const correctAnswers = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const averageAccuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
    
    const today = new Date();
    const wordsStudiedToday = userProgress.filter(p => 
      p.lastStudied.toDateString() === today.toDateString()
    ).length;
    
    return {
      totalWords: userProgress.length,
      masteredWords,
      averageAccuracy,
      wordsStudiedToday
    };
  }

  private getAllProgress(): VocabularyProgress[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    const serialized = JSON.parse(stored) as SerializedProgress[];
    return serialized.map((data) => this.deserializeProgress(data));
  }

  private serializeProgress(progress: VocabularyProgress): SerializedProgress {
    return {
      wordId: progress.wordId.value,
      userId: progress.userId,
      masteryLevel: progress.masteryLevel,
      timesStudied: progress.timesStudied,
      correctAnswers: progress.correctAnswers,
      totalAttempts: progress.totalAttempts,
      lastStudied: progress.lastStudied.toISOString(),
      nextReview: progress.nextReview.toISOString(),
      easinessFactor: progress.easinessFactor
    };
  }

  private deserializeProgress(data: SerializedProgress): VocabularyProgress {
    return new VocabularyProgress(
      new VocabularyId(data.wordId),
      data.userId,
      data.masteryLevel,
      data.timesStudied,
      data.correctAnswers,
      data.totalAttempts,
      new Date(data.lastStudied),
      new Date(data.nextReview),
      data.easinessFactor
    );
  }
}

interface SerializedProgress {
  wordId: string;
  userId: string;
  masteryLevel: number;
  timesStudied: number;
  correctAnswers: number;
  totalAttempts: number;
  lastStudied: string;
  nextReview: string;
  easinessFactor: number;
}
