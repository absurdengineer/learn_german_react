import { type LevelType } from '../domain/entities/User';
import { VocabularyWord, type Gender, type WordType } from '../domain/entities/Vocabulary';
import type { ArticleNoun } from './articles';
import { parseArticlesCSV } from './articles';
import studyPlanData from './studyPlan.json';
import { generateVocabularyCategoriesFromCSV, getCSVVocabularyStats, parseVocabularyCSV } from './vocabulary';

// Grammar data exports
export type { TestQuestion } from '../utils/grammarCsvParser';
export {
  getAvailableGrammarCategories,
  getAvailableGrammarTypes, getGrammarQuestionsByCategory,
  getGrammarQuestionsByType, getGrammarStats, getRandomGrammarQuestions, grammarQuestions
} from './grammarData';

// Type definitions
export type { ArticleNoun };
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
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exercise {
  id: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing' | 'reading';
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
  difficulty: 'easy' | 'medium' | 'hard';
}

// Data loaders
export const loadVocabulary = (): VocabularyItem[] => {
  return parseVocabularyCSV();
};

export const loadVocabularyCategories = (): Record<string, Category> => {
  return generateVocabularyCategoriesFromCSV();
};

export const loadArticleNouns = (): ArticleNoun[] => {
  return parseArticlesCSV();
};

export const loadArticleCategories = (): Record<string, Category> => {
  const articles = loadArticleNouns();
  const categories: Record<string, Category> = {};
  articles.forEach(article => {
    if (!categories[article.category]) {
      categories[article.category] = {
        name: article.category,
        description: `Nouns related to ${article.category}`,
      };
    }
  });
  return categories;
};

export const loadStudyPlan = (): StudyDay[] => {
  return studyPlanData.STUDY_PLAN as StudyDay[];
};

export const loadStudyWeeks = (): Week[] => {
  return studyPlanData.weeks as Week[];
};

export interface ExerciseType {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const loadExerciseTypes = (): Record<string, ExerciseType> => {
  return studyPlanData.exerciseTypes as Record<string, ExerciseType>;
};

// Conversion utilities
export const convertToVocabularyWord = (item: VocabularyItem): VocabularyWord => {
  return VocabularyWord.create({
    german: item.german,
    english: item.english,
    type: item.type as WordType,
    level: item.level as LevelType,
    gender: item.gender as Gender,
    pronunciation: item.pronunciation,
    tags: item.tags,
    frequency: item.frequency,
    exampleSentences: item.examples?.map(ex => ({
      german: ex.german,
      english: ex.english,
      audioUrl: undefined
    })) || []
  });
};

export const convertToVocabularyWords = (items: VocabularyItem[]): VocabularyWord[] => {
  return items.map(convertToVocabularyWord);
};

// Utility functions
export const getVocabularyByCategory = (category: string): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  return vocabulary.filter(item => item.tags.includes(category));
};

export const getArticlesByCategory = (category: string): ArticleNoun[] => {
  const articles = loadArticleNouns();
  return articles.filter(noun => noun.category === category);
};

export const getArticlesByGender = (gender: 'der' | 'die' | 'das'): ArticleNoun[] => {
  const articles = loadArticleNouns();
  return articles.filter(noun => noun.gender === gender);
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

export const getRandomArticles = (count: number = 10): ArticleNoun[] => {
  const articles = loadArticleNouns();
  const shuffled = [...articles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const searchVocabulary = (searchTerm: string): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  const term = searchTerm.toLowerCase();
  return vocabulary.filter(item => 
    item.german.toLowerCase().includes(term) ||
    item.english.toLowerCase().includes(term) ||
    item.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

export const searchArticles = (searchTerm: string): ArticleNoun[] => {
  const articles = loadArticleNouns();
  const term = searchTerm.toLowerCase();
  return articles.filter(noun => 
    noun.german.toLowerCase().includes(term) ||
    noun.english.toLowerCase().includes(term) ||
    noun.category.toLowerCase().includes(term)
  );
};

export const getStudyDayById = (dayId: number): StudyDay | undefined => {
  const studyPlan = loadStudyPlan();
  return studyPlan.find(day => day.day === dayId);
};

export const getStudyWeekById = (weekId: number): Week | undefined => {
  const weeks = loadStudyWeeks();
  return weeks.find(week => week.week === weekId);
};

export const getVocabularyByIds = (ids: string[]): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  return vocabulary.filter(item => ids.includes(item.id));
};

export const getArticlesByIds = (ids: string[]): ArticleNoun[] => {
  const articles = loadArticleNouns();
  return articles.filter(noun => ids.includes(noun.id));
};

// Statistics
export const getVocabularyStats = () => {
  return getCSVVocabularyStats();
};

export const getArticleStats = () => {
  const articles = loadArticleNouns();
  const totalNouns = articles.length;
  const genderStats = {
    der: articles.filter(a => a.gender === 'der').length,
    die: articles.filter(a => a.gender === 'die').length,
    das: articles.filter(a => a.gender === 'das').length,
  };
  const categories = loadArticleCategories();
  const categoryStats = Object.keys(categories).map(key => ({
    category: key,
    name: categories[key].name,
    count: getArticlesByCategory(key).length,
    percentage: Math.round((getArticlesByCategory(key).length / totalNouns) * 100)
  }));

  return {
    totalNouns,
    genderStats,
    categories: categoryStats,
    metadata: { "source": "articles.csv" }
  };
};

export const getStudyPlanStats = () => {
  const studyPlan = loadStudyPlan();
  const weeks = loadStudyWeeks();
  const exerciseTypes = loadExerciseTypes();
  
  const totalDays = studyPlan.length;
  const totalTime = studyPlan.reduce((sum, day) => sum + day.estimatedTime, 0);
  const averageTime = Math.round(totalTime / totalDays);

  const difficultyStats = ['easy', 'medium', 'hard'].map(difficulty => ({
    difficulty,
    count: studyPlan.filter(day => day.difficulty === difficulty).length,
    percentage: Math.round((studyPlan.filter(day => day.difficulty === difficulty).length / totalDays) * 100)
  }));

  return {
    totalDays,
    totalTime,
    averageTime,
    difficultyStats,
    weeks: weeks.length,
    exerciseTypes: Object.keys(exerciseTypes).length,
    metadata: studyPlanData.metadata
  };
};

// Export data objects for backward compatibility
export const A1_VOCABULARY = loadVocabulary();
export const ESSENTIAL_A1_NOUNS = loadArticleNouns();
export const STUDY_PLAN = loadStudyPlan();
export const VOCABULARY_CATEGORIES = Object.keys(loadVocabularyCategories());
export const ARTICLE_CATEGORIES = Object.keys(loadArticleCategories());

// Load data and create additional exports
const vocabulary = loadVocabulary();
const categories = loadVocabularyCategories();

// Create A1_VOCABULARY_BY_CATEGORY for backward compatibility
export const A1_VOCABULARY_BY_CATEGORY: Record<string, VocabularyItem[]> = {};

// Group vocabulary by category
Object.keys(categories).forEach(categoryKey => {
  A1_VOCABULARY_BY_CATEGORY[categoryKey] = vocabulary.filter(item => 
    item.tags.includes(categoryKey)
  );
});

// Also support direct category names
vocabulary.forEach(item => {
  item.tags.forEach(tag => {
    if (!A1_VOCABULARY_BY_CATEGORY[tag]) {
      A1_VOCABULARY_BY_CATEGORY[tag] = [];
    }
    if (!A1_VOCABULARY_BY_CATEGORY[tag].includes(item)) {
      A1_VOCABULARY_BY_CATEGORY[tag].push(item);
    }
  });
});

// Export converted vocabulary words for domain use
export const A1_VOCABULARY_WORDS: VocabularyWord[] = convertToVocabularyWords(vocabulary);

// Export converted vocabulary words by category for domain use
export const A1_VOCABULARY_WORDS_BY_CATEGORY: Record<string, VocabularyWord[]> = {};

// Group converted vocabulary words by category
Object.keys(categories).forEach(categoryKey => {
  A1_VOCABULARY_WORDS_BY_CATEGORY[categoryKey] = convertToVocabularyWords(
    vocabulary.filter(item => item.tags.includes(categoryKey))
  );
});

// Also support direct category names
vocabulary.forEach(item => {
  item.tags.forEach(tag => {
    if (!A1_VOCABULARY_WORDS_BY_CATEGORY[tag]) {
      A1_VOCABULARY_WORDS_BY_CATEGORY[tag] = [];
    }
    const convertedWord = convertToVocabularyWord(item);
    if (!A1_VOCABULARY_WORDS_BY_CATEGORY[tag].find(w => w.id.value === convertedWord.id.value)) {
      A1_VOCABULARY_WORDS_BY_CATEGORY[tag].push(convertedWord);
    }
  });
});

// Convert utility functions to return VocabularyWord entities
export const getVocabularyWordsByCategory = (category: string): VocabularyWord[] => {
  return convertToVocabularyWords(getVocabularyByCategory(category));
};

export const getRandomVocabularyWords = (
  count: number = 10,
  exclude: string[] = []
): VocabularyWord[] => {
  return convertToVocabularyWords(getRandomVocabulary(count, exclude));
};

export const searchVocabularyWords = (searchTerm: string): VocabularyWord[] => {
  return convertToVocabularyWords(searchVocabulary(searchTerm));
};

// Export vocabulary loading functions for testing and debugging
export { generateVocabularyCategoriesFromCSV, parseVocabularyCSV } from './vocabulary';

// Test function to verify CSV data loading
export const testVocabularyLoading = () => {
  const vocabulary = loadVocabulary();
  const categories = loadVocabularyCategories();
  const stats = getVocabularyStats();
  
  console.log('=== VOCABULARY TEST RESULTS ===');
  console.log('Total vocabulary items:', vocabulary.length);
  console.log('Categories available:', Object.keys(categories).length);
  console.log('Category names:', Object.keys(categories).slice(0, 10));
  console.log('Stats:', stats);
  console.log('Sample vocabulary items:', vocabulary.slice(0, 5));
  
  return {
    vocabulary,
    categories,
    stats,
    sampleWords: vocabulary.slice(0, 10)
  };
};
