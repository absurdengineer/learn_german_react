import type { LevelType } from '../../types/User.js';
import type { WordType } from '../../types/Vocabulary.js';
import { VocabularyId, VocabularyProgress, VocabularyWord } from '../../types/Vocabulary.js';

export interface VocabularyRepository {
  findById(id: VocabularyId): Promise<VocabularyWord | null>;
  findByLevel(level: LevelType): Promise<VocabularyWord[]>;
  findByType(type: WordType): Promise<VocabularyWord[]>;
  findByLevelAndType(level: LevelType, type: WordType): Promise<VocabularyWord[]>;
  findByFrequency(minFrequency: number): Promise<VocabularyWord[]>;
  findByTags(tags: string[]): Promise<VocabularyWord[]>;
  findAll(): Promise<VocabularyWord[]>;
  save(word: VocabularyWord): Promise<void>;
  delete(id: VocabularyId): Promise<void>;
  search(query: string): Promise<VocabularyWord[]>;
  getRandomWords(count: number, level?: LevelType): Promise<VocabularyWord[]>;
}

export interface VocabularyProgressRepository {
  findByUserId(userId: string): Promise<VocabularyProgress[]>;
  findByUserIdAndWordId(userId: string, wordId: VocabularyId): Promise<VocabularyProgress | null>;
  findWordsReadyForReview(userId: string): Promise<VocabularyProgress[]>;
  findMasteredWords(userId: string): Promise<VocabularyProgress[]>;
  save(progress: VocabularyProgress): Promise<void>;
  delete(userId: string, wordId: VocabularyId): Promise<void>;
  getUserStats(userId: string): Promise<{
    totalWords: number;
    masteredWords: number;
    averageAccuracy: number;
    wordsStudiedToday: number;
  }>;
}
