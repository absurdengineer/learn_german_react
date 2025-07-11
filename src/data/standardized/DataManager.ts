/**
 * Unified Data Manager for DeutschMeister
 * 
 * This module provides a single interface to access all standardized learning data.
 * Can be used directly outside the React application for tests, exports, or other tools.
 */

import { articlesLoader } from './ArticlesParser';
import type {
    StandardizedArticle,
    StandardizedDataItem,
    StandardizedGrammarLesson,
    StandardizedGrammarPractice,
    StandardizedVocabulary
} from './DataLoader';
import { grammarLessonsLoader } from './GrammarLessonsParser';
import { grammarPracticeLoader } from './GrammarPracticeParser';
import { vocabularyLoader } from './VocabularyParser';

export class DeutschMeisterDataManager {
  private static instance: DeutschMeisterDataManager;

  static getInstance(): DeutschMeisterDataManager {
    if (!DeutschMeisterDataManager.instance) {
      DeutschMeisterDataManager.instance = new DeutschMeisterDataManager();
    }
    return DeutschMeisterDataManager.instance;
  }

  // Vocabulary methods
  getVocabulary(): StandardizedVocabulary[] {
    return vocabularyLoader.load();
  }

  getVocabularyByCategory(category: string): StandardizedVocabulary[] {
    return this.getVocabulary().filter(item => 
      item.category === category || item.tags?.includes(category)
    );
  }

  getVocabularyByWordType(wordType: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other'): StandardizedVocabulary[] {
    return this.getVocabulary().filter(item => item.wordType === wordType);
  }

  getVocabularyByDifficulty(maxDifficulty: number): StandardizedVocabulary[] {
    return this.getVocabulary().filter(item => (item.difficulty || 1) <= maxDifficulty);
  }

  // Articles methods
  getArticles(): StandardizedArticle[] {
    return articlesLoader.load();
  }

  getArticlesByGender(gender: 'der' | 'die' | 'das'): StandardizedArticle[] {
    return this.getArticles().filter(item => item.gender === gender);
  }

  getArticlesByCategory(category: string): StandardizedArticle[] {
    return this.getArticles().filter(item => 
      item.category === category || item.tags?.includes(category)
    );
  }

  // Grammar lessons methods
  getGrammarLessons(): StandardizedGrammarLesson[] {
    return grammarLessonsLoader.load();
  }

  getGrammarLessonByDay(day: number): StandardizedGrammarLesson | null {
    return this.getGrammarLessons().find(lesson => lesson.day === day) || null;
  }

  getGrammarLessonsByWeek(week: number): StandardizedGrammarLesson[] {
    return this.getGrammarLessons().filter(lesson => lesson.week === week);
  }

  getGrammarLessonsByCategory(category: string): StandardizedGrammarLesson[] {
    return this.getGrammarLessons().filter(lesson => 
      lesson.category === category || lesson.tags?.includes(category)
    );
  }

  // Grammar practice methods
  getGrammarPractice(): StandardizedGrammarPractice[] {
    return grammarPracticeLoader.load();
  }

  getGrammarPracticeByDay(day: number): StandardizedGrammarPractice[] {
    return this.getGrammarPractice().filter(item => item.dayReference === day);
  }

  getGrammarPracticeByCategory(category: string): StandardizedGrammarPractice[] {
    return this.getGrammarPractice().filter(item => 
      item.category === category || item.tags?.includes(category)
    );
  }

  getGrammarPracticeByQuestionType(questionType: 'multiple_choice' | 'fill_in_blank' | 'true_false' | 'ordering'): StandardizedGrammarPractice[] {
    return this.getGrammarPractice().filter(item => item.questionType === questionType);
  }

  // Utility methods
  getAllData(): StandardizedDataItem[] {
    return [
      ...this.getVocabulary(),
      ...this.getArticles(),
      ...this.getGrammarLessons(),
      ...this.getGrammarPractice()
    ];
  }

  getDataByType(type: 'vocabulary' | 'article' | 'grammar_lesson' | 'grammar_practice'): StandardizedDataItem[] {
    return this.getAllData().filter(item => item.type === type);
  }

  getDataByCategory(category: string): StandardizedDataItem[] {
    return this.getAllData().filter(item => 
      item.category === category || item.tags?.includes(category)
    );
  }

  getDataByTags(tags: string[]): StandardizedDataItem[] {
    return this.getAllData().filter(item => 
      item.tags?.some(tag => tags.includes(tag))
    );
  }

  // Search functionality
  searchData(query: string): StandardizedDataItem[] {
    const queryLower = query.toLowerCase();
    return this.getAllData().filter(item => {
      // Search in different fields based on item type
      if (item.type === 'vocabulary') {
        const vocab = item as StandardizedVocabulary;
        return vocab.german.toLowerCase().includes(queryLower) ||
               vocab.english.toLowerCase().includes(queryLower) ||
               vocab.tags?.some(tag => tag.toLowerCase().includes(queryLower));
      }
      
      if (item.type === 'article') {
        const article = item as StandardizedArticle;
        return article.german.toLowerCase().includes(queryLower) ||
               article.english.toLowerCase().includes(queryLower) ||
               article.gender.toLowerCase().includes(queryLower);
      }
      
      if (item.type === 'grammar_lesson') {
        const lesson = item as StandardizedGrammarLesson;
        return lesson.title.toLowerCase().includes(queryLower) ||
               lesson.content.toLowerCase().includes(queryLower) ||
               lesson.mission.toLowerCase().includes(queryLower);
      }
      
      if (item.type === 'grammar_practice') {
        const practice = item as StandardizedGrammarPractice;
        return practice.prompt.toLowerCase().includes(queryLower) ||
               practice.correctAnswer.toLowerCase().includes(queryLower);
      }
      
      return false;
    });
  }

  // Random selection methods for tests/practice
  getRandomVocabulary(count: number, filters?: {
    category?: string;
    wordType?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
    maxDifficulty?: number;
    tags?: string[];
  }): StandardizedVocabulary[] {
    let vocabulary = this.getVocabulary();
    
    if (filters) {
      vocabulary = vocabulary.filter(item => {
        if (filters.category && item.category !== filters.category) return false;
        if (filters.wordType && item.wordType !== filters.wordType) return false;
        if (filters.maxDifficulty && (item.difficulty || 1) > filters.maxDifficulty) return false;
        if (filters.tags && !filters.tags.some(tag => item.tags?.includes(tag))) return false;
        return true;
      });
    }
    
    return this.shuffleArray(vocabulary).slice(0, count);
  }

  getRandomArticles(count: number, gender?: 'der' | 'die' | 'das'): StandardizedArticle[] {
    let articles = this.getArticles();
    if (gender) {
      articles = articles.filter(item => item.gender === gender);
    }
    return this.shuffleArray(articles).slice(0, count);
  }

  getRandomGrammarPractice(count: number, dayReference?: number): StandardizedGrammarPractice[] {
    let practice = this.getGrammarPractice();
    if (dayReference) {
      practice = practice.filter(item => item.dayReference === dayReference);
    }
    return this.shuffleArray(practice).slice(0, count);
  }

  // Statistics methods
  getDataStatistics() {
    const vocabulary = this.getVocabulary();
    const articles = this.getArticles();
    const grammarLessons = this.getGrammarLessons();
    const grammarPractice = this.getGrammarPractice();

    return {
      vocabulary: {
        total: vocabulary.length,
        byWordType: this.groupBy(vocabulary, 'wordType'),
        byCategory: this.groupBy(vocabulary, 'category'),
        withPronunciation: vocabulary.filter(v => v.pronunciation).length,
        withExamples: vocabulary.filter(v => v.examples?.length).length
      },
      articles: {
        total: articles.length,
        byGender: this.groupBy(articles, 'gender'),
        byCategory: this.groupBy(articles, 'category')
      },
      grammarLessons: {
        total: grammarLessons.length,
        byWeek: this.groupBy(grammarLessons, 'week'),
        byCategory: this.groupBy(grammarLessons, 'category'),
        totalEstimatedTime: grammarLessons.reduce((sum, lesson) => sum + (lesson.estimatedTime || 0), 0)
      },
      grammarPractice: {
        total: grammarPractice.length,
        byQuestionType: this.groupBy(grammarPractice, 'questionType'),
        byCategory: this.groupBy(grammarPractice, 'category'),
        byDayReference: this.groupBy(grammarPractice, 'dayReference')
      }
    };
  }

  // Utility methods
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key] || 'unknown');
      groups[groupKey] = (groups[groupKey] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
  }
}

// Export singleton instance for easy external use
export const dataManager = DeutschMeisterDataManager.getInstance();

// Export types for external use
export type {
    StandardizedArticle, StandardizedDataItem, StandardizedGrammarLesson,
    StandardizedGrammarPractice, StandardizedVocabulary
};

