/**
 * Standardized Data System - Main Export
 *
 * This module exports all standardized data functionality for external use.
 * Can be imported directly in other projects or used for data analysis.
 *
 * Usage Examples:
 *
 * // Get all vocabulary
 * import { dataManager } from './DataManager';
 * const vocabulary = dataManager.getVocabulary();
 *
 * // Get statistics
 * const stats = dataManager.getDataStatistics();
 */

// Export main data manager
export { dataManager, DeutschMeisterDataManager } from "./DataManager";

// Export individual parsers for advanced use
export { articlesLoader, ArticlesParser } from "./ArticlesParser";
export {
  grammarLessonsLoader,
  GrammarLessonsParser,
} from "./GrammarLessonsParser";
export {
  grammarPracticeLoader,
  GrammarPracticeParser,
} from "./GrammarPracticeParser";
export { vocabularyLoader, VocabularyParser } from "./VocabularyParser";

// Export types
export type {
  StandardizedArticle,
  StandardizedDataItem,
  StandardizedGrammarLesson,
  StandardizedGrammarPractice,
  StandardizedVocabulary,
} from "./DataLoader";

/**
 * Quick access functions for common operations
 */

import { dataManager } from "./DataManager";

// Quick data access
export const getVocabulary = () => dataManager.getVocabulary();
export const getArticles = () => dataManager.getArticles();
export const getGrammarLessons = () => dataManager.getGrammarLessons();
export const getGrammarPractice = () => dataManager.getGrammarPractice();
export const getAllData = () => dataManager.getAllData();
export const getDataStatistics = () => dataManager.getDataStatistics();

/**
 * Search and filter functions
 */

export const searchData = (query: string) => {
  return dataManager.searchData(query);
};

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
    exportDate: new Date().toISOString(),
  };
};

export const exportToCSV = (
  type:
    | "vocabulary"
    | "articles"
    | "grammar_lessons"
    | "grammar_practice"
    | "all"
) => {
  // Simple CSV export implementation
  let data: any[] = [];
  if (type === "all") {
    data = dataManager.getAllData();
  } else if (type === "vocabulary") {
    data = dataManager.getVocabulary();
  } else if (type === "articles") {
    data = dataManager.getArticles();
  } else if (type === "grammar_lessons") {
    data = dataManager.getGrammarLessons();
  } else if (type === "grammar_practice") {
    data = dataManager.getGrammarPractice();
  }

  if (data.length === 0) return "";

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });

  const headers = Array.from(allKeys).sort();
  const csvHeaders = headers.join(",");

  const csvRows = data.map((item) => {
    return headers
      .map((header) => {
        const value = (item as any)[header];
        if (Array.isArray(value)) return `"${value.join("|")}"`;
        if (typeof value === "object" && value !== null)
          return `"${JSON.stringify(value)}"`;
        if (typeof value === "string" && value.includes(","))
          return `"${value}"`;
        return value || "";
      })
      .join(",");
  });

  return [csvHeaders, ...csvRows].join("\n");
};

// Version information
export const VERSION = "2.0.0";
export const LAST_UPDATED = "2024-01-01";

/**
 * Default export for simple imports
 */
export default {
  dataManager,
  getVocabulary,
  getArticles,
  getGrammarLessons,
  getGrammarPractice,
  getAllData,
  getDataStatistics,
  searchData,
  exportToJSON,
  exportToCSV,
  VERSION,
  LAST_UPDATED,
};
