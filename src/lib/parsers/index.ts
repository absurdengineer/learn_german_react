/**
 * Standardized Data System - Main Export
 * 
 * This module exports all standardized data functionality for external use.
 * Can be imported directly in other projects or used for data analysis.
 * 
 * Usage Examples:
 * 
 * // Get all vocabulary
 * import { dataManager } from './standardized';
 * const vocabulary = dataManager.getVocabulary();
 * 
 * // Generate a test
 * import { StandardizedTestGenerator } from './standardized';
 * const test = StandardizedTestGenerator.generateVocabularyTest({ count: 20 });
 * 
 * // Get statistics
 * const stats = dataManager.getDataStatistics();
 */

// Export main data manager
export { dataManager, DeutschMeisterDataManager } from './DataManager';

// Export individual parsers for advanced use
export { articlesLoader, ArticlesParser } from './ArticlesParser';
export { grammarLessonsLoader, GrammarLessonsParser } from './GrammarLessonsParser';
export { grammarPracticeLoader, GrammarPracticeParser } from './GrammarPracticeParser';
export { vocabularyLoader, VocabularyParser } from './VocabularyParser';

// Export test generator
export { StandardizedTestGenerator } from './TestGenerator';

// Export types
export type {
    StandardizedArticle, StandardizedDataItem, StandardizedGrammarLesson,
    StandardizedGrammarPractice, StandardizedVocabulary
} from './DataLoader';

export type {
    GeneratedTest, TestQuestion
} from './TestGenerator';

// Export utility functions
export { DataStandardizer } from './DataLoader';

/**
 * Quick access functions for common operations
 */

import { dataManager } from './DataManager';
import { StandardizedTestGenerator } from './TestGenerator';

// Quick data access
export const getVocabulary = () => dataManager.getVocabulary();
export const getArticles = () => dataManager.getArticles();
export const getGrammarLessons = () => dataManager.getGrammarLessons();
export const getGrammarPractice = () => dataManager.getGrammarPractice();
export const getAllData = () => dataManager.getAllData();
export const getDataStatistics = () => dataManager.getDataStatistics();

// Quick test generation
export const generateVocabularyTest = (count = 10) => 
  StandardizedTestGenerator.generateVocabularyTest({ count });

export const generateArticlesTest = (count = 10) => 
  StandardizedTestGenerator.generateArticlesTest({ count });

export const generateGrammarTest = (count = 10) => 
  StandardizedTestGenerator.generateGrammarTest({ count });

export const generateMixedTest = (count = 20) => 
  StandardizedTestGenerator.generateMixedTest({ count });

// Search and filter functions
export const searchData = (query: string) => dataManager.searchData(query);
export const getDataByCategory = (category: string) => dataManager.getDataByCategory(category);
export const getVocabularyByWordType = (wordType: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other') => 
  dataManager.getVocabularyByWordType(wordType);
export const getArticlesByGender = (gender: 'der' | 'die' | 'das') => 
  dataManager.getArticlesByGender(gender);
export const getGrammarLessonByDay = (day: number) => 
  dataManager.getGrammarLessonByDay(day);
export const getGrammarPracticeByDay = (day: number) => 
  dataManager.getGrammarPracticeByDay(day);

/**
 * Data export functions for external tools
 */

export const exportToJSON = () => {
  return {
    vocabulary: dataManager.getVocabulary(),
    articles: dataManager.getArticles(),
    grammarLessons: dataManager.getGrammarLessons(),
    grammarPractice: dataManager.getGrammarPractice(),
    statistics: dataManager.getDataStatistics(),
    exportDate: new Date().toISOString()
  };
};

export const exportToCSV = (type: 'vocabulary' | 'article' | 'grammar_lesson' | 'grammar_practice') => {
  const data = dataManager.getDataByType(type);
  
  if (data.length === 0) return '';
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys).sort();
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(item => {
    return headers.map(header => {
      const value = (item as any)[header];
      if (Array.isArray(value)) return `"${value.join('|')}"`;
      if (typeof value === 'object' && value !== null) return `"${JSON.stringify(value)}"`;
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
      return value || '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Version information
 */
export const VERSION = '1.0.0';
export const LAST_UPDATED = new Date().toISOString();

/**
 * Default export for simple imports
 */
export default {
  dataManager,
  StandardizedTestGenerator,
  getVocabulary,
  getArticles,
  getGrammarLessons,
  getGrammarPractice,
  getAllData,
  getDataStatistics,
  generateVocabularyTest,
  generateArticlesTest,
  generateGrammarTest,
  generateMixedTest,
  searchData,
  exportToJSON,
  exportToCSV,
  VERSION,
  LAST_UPDATED
};
