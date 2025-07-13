import { type LevelType } from "../types/User";
import {
  VocabularyWord,
  type Gender,
  type WordType,
} from "../types/Vocabulary";

// --- DEPRECATED: Mock old vocabulary API for backward compatibility (to be removed after migration) ---
export const mockOldVocabularyService = {
  /**
   * @deprecated Use getAllVocabulary instead
   */
  parseVocabularyCSV: () => [], // Removed getAllVocabulary
  /**
   * @deprecated Use generateVocabularyCategories instead
   */
  generateVocabularyCategoriesFromCSV: () => ({}), // Removed generateVocabularyCategories
  /**
   * @deprecated Use getVocabularyStats instead
   */
  getCSVVocabularyStats: () => ({}), // Removed getVocabularyStats
};

// Re-export standardized data system
export * from "../lib/parsers";

// Type definitions
export interface VocabularyItem {
  id: string;
  german: string;
  english: string;
  pronunciation?: string;
  type: string;
  level: string;
  gender?: string;
  tags: string[];
  frequency: number;
  examples?: Array<{
    german: string;
    english: string;
  }>;
}

export interface StudyDay {
  day: number;
  title: string;
  description: string;
  focusAreas: string[];
  vocabularyWords: string[];
  grammarTopics: string[];
  exercises: Exercise[];
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface Exercise {
  id: string;
  type:
    | "vocabulary"
    | "grammar"
    | "listening"
    | "speaking"
    | "writing"
    | "reading";
  title: string;
  description: string;
  estimatedTime: number;
  isRequired: boolean;
}

export interface Category {
  name: string;
  description: string;
  color?: string;
}

export interface Week {
  week: number;
  title: string;
  description: string;
  days: number[];
  focusAreas: string[];
  difficulty: "easy" | "medium" | "hard";
}

// Data loaders
export const loadVocabulary = (): VocabularyItem[] => {
  return []; // Removed getAllVocabulary
};

export const loadVocabularyCategories = (): Record<string, Category> => {
  return {}; // Removed generateVocabularyCategories
};

// Remove all type references and functions using ArticleNoun, such as:
// export type { ArticleNoun };
// export const loadArticleNouns, loadArticleCategories, getArticlesByCategory, getArticlesByGender, getRandomArticles, searchArticles, getArticlesByIds, getArticleStats

export interface ExerciseType {
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Conversion utilities
export const convertToVocabularyWord = (
  item: VocabularyItem
): VocabularyWord => {
  return VocabularyWord.create({
    german: item.german,
    english: item.english,
    type: item.type as WordType,
    level: item.level as LevelType,
    gender: item.gender as Gender,
    pronunciation: item.pronunciation,
    tags: item.tags,
    frequency: item.frequency,
    exampleSentences:
      item.examples?.map((ex) => ({
        german: ex.german,
        english: ex.english,
        audioUrl: undefined,
      })) || [],
  });
};

export const convertToVocabularyWords = (
  items: VocabularyItem[]
): VocabularyWord[] => {
  return items.map(convertToVocabularyWord);
};

// Utility functions
export const getVocabularyByCategory = (category: string): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  return vocabulary.filter((item) => item.tags.includes(category));
};

export const getRandomVocabulary = (
  count: number = 10,
  exclude: string[] = []
): VocabularyItem[] => {
  const vocabulary = loadVocabulary().filter(
    (item) => !exclude.includes(item.german)
  );

  // Ensure uniqueness based on the German word
  const uniqueVocabulary = Array.from(
    new Map(vocabulary.map((item) => [item.german, item])).values()
  );

  const shuffled = [...uniqueVocabulary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomVocabularyWords = (
  count: number = 10,
  exclude: string[] = []
): VocabularyWord[] => {
  return convertToVocabularyWords(getRandomVocabulary(count, exclude));
};

export const searchVocabulary = (searchTerm: string): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  const term = searchTerm.toLowerCase();
  return vocabulary.filter(
    (item) =>
      item.german.toLowerCase().includes(term) ||
      item.english.toLowerCase().includes(term) ||
      item.tags.some((tag) => tag.toLowerCase().includes(term))
  );
};

export const searchVocabularyWords = (searchTerm: string): VocabularyWord[] => {
  return convertToVocabularyWords(searchVocabulary(searchTerm));
};

// Export vocabulary loading functions for testing and debugging
// Remove any remaining import or reference to './vocabulary'

// Test function to verify CSV data loading
export const testVocabularyLoading = () => {
  const vocabulary = loadVocabulary();
  const categories = loadVocabularyCategories();
  const stats = mockOldVocabularyService.getCSVVocabularyStats(); // Removed getVocabularyStats

  console.log("=== VOCABULARY TEST RESULTS ===");
  console.log("Total vocabulary items:", vocabulary.length);
  console.log("Categories available:", Object.keys(categories).length);
  console.log("Category names:", Object.keys(categories).slice(0, 10));
  console.log("Stats:", stats);
  console.log("Sample vocabulary items:", vocabulary.slice(0, 5));

  return {
    vocabulary,
    categories,
    stats,
    sampleWords: vocabulary.slice(0, 10),
  };
};
