import type { LevelType } from '../../types/User.js';
import type { WordType } from '../../types/Vocabulary.js';
import { VocabularyId, VocabularyProgress, VocabularyWord } from '../../types/Vocabulary.js';
import type { VocabularyProgressRepository, VocabularyRepository } from './VocabularyRepository.js';

export class VocabularyService {
  private readonly vocabularyRepository: VocabularyRepository;
  private readonly progressRepository: VocabularyProgressRepository;

  constructor(
    vocabularyRepository: VocabularyRepository,
    progressRepository: VocabularyProgressRepository
  ) {
    this.vocabularyRepository = vocabularyRepository;
    this.progressRepository = progressRepository;
  }

  async getWordsForLevel(level: LevelType): Promise<VocabularyWord[]> {
    return await this.vocabularyRepository.findByLevel(level);
  }

  async getWordsByType(type: WordType): Promise<VocabularyWord[]> {
    return await this.vocabularyRepository.findByType(type);
  }

  async getWordsByLevelAndType(level: LevelType, type: WordType): Promise<VocabularyWord[]> {
    return await this.vocabularyRepository.findByLevelAndType(level, type);
  }

  async getHighFrequencyWords(level: LevelType, minFrequency: number = 7): Promise<VocabularyWord[]> {
    const allWords = await this.vocabularyRepository.findByLevel(level);
    return allWords.filter(word => word.frequency >= minFrequency);
  }

  async getWordsForReview(userId: string): Promise<VocabularyWord[]> {
    const progressList = await this.progressRepository.findWordsReadyForReview(userId);
    const wordIds = progressList.map(p => p.wordId);
    
    const words: VocabularyWord[] = [];
    for (const wordId of wordIds) {
      const word = await this.vocabularyRepository.findById(wordId);
      if (word) {
        words.push(word);
      }
    }
    
    return words;
  }

  async getMasteredWords(userId: string): Promise<VocabularyWord[]> {
    const progressList = await this.progressRepository.findMasteredWords(userId);
    const wordIds = progressList.map(p => p.wordId);
    
    const words: VocabularyWord[] = [];
    for (const wordId of wordIds) {
      const word = await this.vocabularyRepository.findById(wordId);
      if (word) {
        words.push(word);
      }
    }
    
    return words;
  }

  async getRandomWordsForPractice(
    userId: string,
    level: LevelType,
    count: number = 10
  ): Promise<VocabularyWord[]> {
    const userProgress = await this.progressRepository.findByUserId(userId);
    const masteredWordIds = userProgress
      .filter(p => p.isMastered())
      .map(p => p.wordId.value);
    
    const availableWords = await this.vocabularyRepository.findByLevel(level);
    const unMasteredWords = availableWords.filter(
      word => !masteredWordIds.includes(word.id.value)
    );
    
    // Prioritize high-frequency words
    const sortedWords = unMasteredWords.sort((a, b) => b.frequency - a.frequency);
    
    return sortedWords.slice(0, count);
  }

  async studyWord(
    userId: string,
    wordId: VocabularyId,
    isCorrect: boolean
  ): Promise<VocabularyProgress> {
    let progress = await this.progressRepository.findByUserIdAndWordId(userId, wordId);
    
    if (!progress) {
      progress = VocabularyProgress.create(wordId, userId);
    }
    
    const updatedProgress = isCorrect 
      ? progress.updateAfterCorrectAnswer()
      : progress.updateAfterIncorrectAnswer();
    
    await this.progressRepository.save(updatedProgress);
    return updatedProgress;
  }

  async getWordProgress(userId: string, wordId: VocabularyId): Promise<VocabularyProgress | null> {
    return await this.progressRepository.findByUserIdAndWordId(userId, wordId);
  }

  async getUserVocabularyStats(userId: string): Promise<{
    totalWords: number;
    masteredWords: number;
    averageAccuracy: number;
    wordsStudiedToday: number;
    weakWords: VocabularyWord[];
    strengthWords: VocabularyWord[];
  }> {
    const stats = await this.progressRepository.getUserStats(userId);
    const progressList = await this.progressRepository.findByUserId(userId);
    
    // Get weak words (accuracy < 60%)
    const weakProgressList = progressList.filter(p => p.getAccuracyRate() < 60 && p.totalAttempts >= 3);
    const weakWords: VocabularyWord[] = [];
    for (const progress of weakProgressList) {
      const word = await this.vocabularyRepository.findById(progress.wordId);
      if (word) {
        weakWords.push(word);
      }
    }
    
    // Get strength words (accuracy >= 80%)
    const strongProgressList = progressList.filter(p => p.getAccuracyRate() >= 80 && p.totalAttempts >= 3);
    const strengthWords: VocabularyWord[] = [];
    for (const progress of strongProgressList) {
      const word = await this.vocabularyRepository.findById(progress.wordId);
      if (word) {
        strengthWords.push(word);
      }
    }
    
    return {
      ...stats,
      weakWords,
      strengthWords
    };
  }

  async searchWords(query: string): Promise<VocabularyWord[]> {
    return await this.vocabularyRepository.search(query);
  }

  async getWordsByTags(tags: string[]): Promise<VocabularyWord[]> {
    return await this.vocabularyRepository.findByTags(tags);
  }

  async addWord(word: VocabularyWord): Promise<void> {
    await this.vocabularyRepository.save(word);
  }

  async updateWord(word: VocabularyWord): Promise<void> {
    await this.vocabularyRepository.save(word);
  }

  async deleteWord(wordId: VocabularyId): Promise<void> {
    await this.vocabularyRepository.delete(wordId);
  }

  async generateFlashcardSet(
    userId: string,
    level: LevelType,
    count: number = 20
  ): Promise<{
    words: VocabularyWord[];
    studyPlan: { wordId: string; reviewDate: Date; difficulty: number }[];
  }> {
    const userProgress = await this.progressRepository.findByUserId(userId);
    const availableWords = await this.vocabularyRepository.findByLevel(level);
    
    // Create a study plan based on spaced repetition
    const studyPlan: { wordId: string; reviewDate: Date; difficulty: number }[] = [];
    
    // Prioritize words that need review
    const wordsNeedingReview = availableWords.filter(word => {
      const progress = userProgress.find(p => p.wordId.value === word.id.value);
      return !progress || progress.isReadyForReview();
    });
    
    // Sort by frequency and difficulty
    const sortedWords = wordsNeedingReview.sort((a, b) => {
      const progressA = userProgress.find(p => p.wordId.value === a.id.value);
      const progressB = userProgress.find(p => p.wordId.value === b.id.value);
      
      const difficultyA = progressA ? progressA.masteryLevel : 0;
      const difficultyB = progressB ? progressB.masteryLevel : 0;
      
      // Prioritize: high frequency, low mastery
      return (b.frequency - a.frequency) + (difficultyA - difficultyB);
    });
    
    const selectedWords = sortedWords.slice(0, count);
    
    selectedWords.forEach(word => {
      const progress = userProgress.find(p => p.wordId.value === word.id.value);
      const difficulty = progress ? (100 - progress.masteryLevel) / 10 : 5;
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + Math.max(1, Math.floor(difficulty)));
      
      studyPlan.push({
        wordId: word.id.value,
        reviewDate,
        difficulty
      });
    });
    
    return {
      words: selectedWords,
      studyPlan
    };
  }
}
