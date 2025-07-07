import { type LevelType } from '../domain/entities/User';
import { VocabularyWord, type Gender, type WordType } from '../domain/entities/Vocabulary';
import articlesData from './articles.json';
import studyPlanData from './studyPlan.json';
import vocabularyData from './vocabulary.json';

// Type definitions
export interface VocabularyItem {
  id: string;
  german: string;
  english: string;
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

export interface ArticleNoun {
  id: string;
  german: string;
  english: string;
  gender: 'der' | 'die' | 'das';
  frequency: number;
  category: string;
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
  return vocabularyData.A1_VOCABULARY as VocabularyItem[];
};

export const loadVocabularyCategories = (): Record<string, Category> => {
  return vocabularyData.categories as Record<string, Category>;
};

export const loadArticleNouns = (): ArticleNoun[] => {
  return articlesData.ESSENTIAL_A1_NOUNS as ArticleNoun[];
};

export const loadArticleCategories = (): Record<string, Category> => {
  return articlesData.categories as Record<string, Category>;
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

export const getRandomVocabulary = (count: number = 10): VocabularyItem[] => {
  const vocabulary = loadVocabulary();
  const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
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
  const vocabulary = loadVocabulary();
  const totalWords = vocabulary.length;
  const categories = loadVocabularyCategories();
  const categoryStats = Object.keys(categories).map(key => ({
    category: key,
    name: categories[key].name,
    count: getVocabularyByCategory(key).length,
    percentage: Math.round((getVocabularyByCategory(key).length / totalWords) * 100)
  }));

  return {
    totalWords,
    categories: categoryStats,
    metadata: vocabularyData.metadata
  };
};

export const getArticleStats = () => {
  const articles = loadArticleNouns();
  const totalNouns = articles.length;
  const genderStats = articlesData.genderStats;
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
    metadata: articlesData.metadata
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

export const getRandomVocabularyWords = (count: number = 10): VocabularyWord[] => {
  return convertToVocabularyWords(getRandomVocabulary(count));
};

export const searchVocabularyWords = (searchTerm: string): VocabularyWord[] => {
  return convertToVocabularyWords(searchVocabulary(searchTerm));
};
