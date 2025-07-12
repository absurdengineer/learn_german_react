import type { LevelType } from '../../types/User.js';
import type { WordType } from '../../types/Vocabulary.js';
import { VocabularyId, VocabularyProgress, VocabularyWord } from '../../types/Vocabulary.js';
import { VocabularyService } from '../domain/VocabularyService.js';

export class GetVocabularyWordsUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(request: {
    level: LevelType;
    type?: WordType;
    tags?: string[];
  }): Promise<{
    success: boolean;
    words?: VocabularyWord[];
    error?: string;
  }> {
    try {
      let words: VocabularyWord[];
      
      if (request.type) {
        words = await this.vocabularyService.getWordsByLevelAndType(request.level, request.type);
      } else if (request.tags) {
        const tagWords = await this.vocabularyService.getWordsByTags(request.tags);
        words = tagWords.filter(word => word.level === request.level);
      } else {
        words = await this.vocabularyService.getWordsForLevel(request.level);
      }
      
      return {
        success: true,
        words
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class StudyVocabularyWordUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(request: {
    userId: string;
    wordId: string;
    isCorrect: boolean;
  }): Promise<{
    success: boolean;
    progress?: VocabularyProgress;
    error?: string;
  }> {
    try {
      const progress = await this.vocabularyService.studyWord(
        request.userId,
        new VocabularyId(request.wordId),
        request.isCorrect
      );
      
      return {
        success: true,
        progress
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetVocabularyReviewUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    words?: VocabularyWord[];
    error?: string;
  }> {
    try {
      const words = await this.vocabularyService.getWordsForReview(userId);
      return {
        success: true,
        words
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GenerateFlashcardSetUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(request: {
    userId: string;
    level: LevelType;
    count?: number;
  }): Promise<{
    success: boolean;
    data?: {
      words: VocabularyWord[];
      studyPlan: { wordId: string; reviewDate: Date; difficulty: number }[];
    };
    error?: string;
  }> {
    try {
      const data = await this.vocabularyService.generateFlashcardSet(
        request.userId,
        request.level,
        request.count
      );
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetVocabularyStatsUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    stats?: {
      totalWords: number;
      masteredWords: number;
      averageAccuracy: number;
      wordsStudiedToday: number;
      weakWords: VocabularyWord[];
      strengthWords: VocabularyWord[];
    };
    error?: string;
  }> {
    try {
      const stats = await this.vocabularyService.getUserVocabularyStats(userId);
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

export class GetRandomWordsForPracticeUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(request: {
    userId: string;
    level: LevelType;
    count?: number;
  }): Promise<{
    success: boolean;
    words?: VocabularyWord[];
    error?: string;
  }> {
    try {
      const words = await this.vocabularyService.getRandomWordsForPractice(
        request.userId,
        request.level,
        request.count
      );
      
      return {
        success: true,
        words
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class SearchVocabularyUseCase {
  private readonly vocabularyService: VocabularyService;

  constructor(vocabularyService: VocabularyService) {
    this.vocabularyService = vocabularyService;
  }

  async execute(query: string): Promise<{
    success: boolean;
    words?: VocabularyWord[];
    error?: string;
  }> {
    try {
      const words = await this.vocabularyService.searchWords(query);
      return {
        success: true,
        words
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
