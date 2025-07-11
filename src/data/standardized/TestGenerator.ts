/**
 * Standardized Test Generator
 * 
 * Uses the unified data manager to generate tests for all learning resources
 */

import { dataManager } from './DataManager';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category?: string;
  difficulty?: number;
  helperText?: string;
  type: 'vocabulary' | 'articles' | 'grammar' | 'mixed';
}

export interface GeneratedTest {
  id: string;
  title: string;
  type: 'vocabulary' | 'articles' | 'grammar' | 'mixed';
  questions: TestQuestion[];
  estimatedTime: number;
  difficulty: number;
  categories: string[];
}

export class StandardizedTestGenerator {
  // Generate vocabulary test
  static generateVocabularyTest(options: {
    count?: number;
    category?: string;
    wordType?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
    maxDifficulty?: number;
    testType?: 'translation' | 'definition' | 'mixed';
  } = {}): GeneratedTest {
    const {
      count = 10,
      category,
      wordType,
      maxDifficulty = 5,
      testType = 'translation'
    } = options;

    let vocabulary = dataManager.getVocabulary();

    // Apply filters
    if (category) {
      vocabulary = vocabulary.filter(v => v.category === category || v.tags?.includes(category));
    }
    if (wordType) {
      vocabulary = vocabulary.filter(v => v.wordType === wordType);
    }
    if (maxDifficulty) {
      vocabulary = vocabulary.filter(v => (v.difficulty || 1) <= maxDifficulty);
    }

    // Select random vocabulary
    const selectedVocabulary = this.shuffleArray(vocabulary).slice(0, count);
    const allVocabulary = dataManager.getVocabulary();

    const questions: TestQuestion[] = selectedVocabulary.map((word, index) => {
      if (testType === 'translation' || (testType === 'mixed' && Math.random() > 0.5)) {
        return this.createTranslationQuestion(word, allVocabulary, index);
      } else {
        return this.createDefinitionQuestion(word, allVocabulary, index);
      }
    });

    const categories = [...new Set(selectedVocabulary.map(v => v.category).filter(Boolean))] as string[];
    const avgDifficulty = selectedVocabulary.reduce((sum, v) => sum + (v.difficulty || 1), 0) / selectedVocabulary.length;

    return {
      id: `vocab-test-${Date.now()}`,
      title: `Vocabulary Test${category ? ` - ${category}` : ''}`,
      type: 'vocabulary',
      questions,
      estimatedTime: Math.ceil(questions.length * 0.5), // 30 seconds per question
      difficulty: Math.round(avgDifficulty),
      categories
    };
  }

  // Generate articles test
  static generateArticlesTest(options: {
    count?: number;
    category?: string;
    gender?: 'der' | 'die' | 'das';
    includeDefinitions?: boolean;
  } = {}): GeneratedTest {
    const {
      count = 10,
      category,
      gender,
      includeDefinitions = false
    } = options;

    let articles = dataManager.getArticles();

    // Apply filters
    if (category) {
      articles = articles.filter(a => a.category === category || a.tags?.includes(category));
    }
    if (gender) {
      articles = articles.filter(a => a.gender === gender);
    }

    // Select random articles
    const selectedArticles = this.shuffleArray(articles).slice(0, count);

    const questions: TestQuestion[] = selectedArticles.map((article, index) => {
      if (includeDefinitions && Math.random() > 0.5) {
        return this.createArticleDefinitionQuestion(article, index);
      } else {
        return this.createArticleGenderQuestion(article, index);
      }
    });

    const categories = [...new Set(selectedArticles.map(a => a.category).filter(Boolean))] as string[];

    return {
      id: `articles-test-${Date.now()}`,
      title: `Articles Test${category ? ` - ${category}` : ''}${gender ? ` - ${gender}` : ''}`,
      type: 'articles',
      questions,
      estimatedTime: Math.ceil(questions.length * 0.3), // 20 seconds per question
      difficulty: 2, // Articles are generally intermediate level
      categories
    };
  }

  // Generate grammar test
  static generateGrammarTest(options: {
    count?: number;
    dayReference?: number;
    category?: string;
    questionType?: 'multiple_choice' | 'fill_in_blank' | 'true_false' | 'ordering';
    maxDifficulty?: number;
  } = {}): GeneratedTest {
    const {
      count = 10,
      dayReference,
      category,
      questionType,
      maxDifficulty = 5
    } = options;

    let grammarPractice = dataManager.getGrammarPractice();

    // Apply filters
    if (dayReference) {
      grammarPractice = grammarPractice.filter(g => g.dayReference === dayReference);
    }
    if (category) {
      grammarPractice = grammarPractice.filter(g => g.category === category || g.tags?.includes(category));
    }
    if (questionType) {
      grammarPractice = grammarPractice.filter(g => g.questionType === questionType);
    }
    if (maxDifficulty) {
      grammarPractice = grammarPractice.filter(g => (g.difficulty || 1) <= maxDifficulty);
    }

    // Select random grammar practice
    const selectedGrammar = this.shuffleArray(grammarPractice).slice(0, count);

    const questions: TestQuestion[] = selectedGrammar.map((grammar, index) => ({
      id: `grammar-q${index + 1}`,
      question: grammar.prompt,
      options: this.shuffleArray([...grammar.options]).slice(0, 4),
      answer: grammar.correctAnswer,
      category: grammar.category,
      difficulty: grammar.difficulty,
      helperText: grammar.helperText,
      type: 'grammar'
    }));

    const categories = [...new Set(selectedGrammar.map(g => g.category).filter(Boolean))] as string[];
    const avgDifficulty = selectedGrammar.reduce((sum, g) => sum + (g.difficulty || 1), 0) / selectedGrammar.length;

    return {
      id: `grammar-test-${Date.now()}`,
      title: `Grammar Test${category ? ` - ${category}` : ''}${dayReference ? ` - Day ${dayReference}` : ''}`,
      type: 'grammar',
      questions,
      estimatedTime: Math.ceil(questions.length * 0.75), // 45 seconds per question
      difficulty: Math.round(avgDifficulty),
      categories
    };
  }

  // Generate mixed test
  static generateMixedTest(options: {
    count?: number;
    vocabRatio?: number;
    articlesRatio?: number;
    maxDifficulty?: number;
  } = {}): GeneratedTest {
    const {
      count = 20,
      vocabRatio = 0.5,
      articlesRatio = 0.25,
      maxDifficulty = 5
    } = options;

    const vocabCount = Math.round(count * vocabRatio);
    const articlesCount = Math.round(count * articlesRatio);
    const grammarCount = count - vocabCount - articlesCount;

    const vocabTest = this.generateVocabularyTest({ count: vocabCount, maxDifficulty });
    const articlesTest = this.generateArticlesTest({ count: articlesCount });
    const grammarTest = this.generateGrammarTest({ count: grammarCount, maxDifficulty });

    const allQuestions = [
      ...vocabTest.questions,
      ...articlesTest.questions,
      ...grammarTest.questions
    ];

    // Shuffle the questions
    const shuffledQuestions = this.shuffleArray(allQuestions);

    const allCategories = [...new Set([
      ...vocabTest.categories,
      ...articlesTest.categories,
      ...grammarTest.categories
    ])];

    const avgDifficulty = (vocabTest.difficulty + articlesTest.difficulty + grammarTest.difficulty) / 3;

    return {
      id: `mixed-test-${Date.now()}`,
      title: 'Mixed German Test',
      type: 'mixed',
      questions: shuffledQuestions,
      estimatedTime: vocabTest.estimatedTime + articlesTest.estimatedTime + grammarTest.estimatedTime,
      difficulty: Math.round(avgDifficulty),
      categories: allCategories
    };
  }

  // Helper methods for creating specific question types
  private static createTranslationQuestion(word: any, allVocabulary: any[], index: number): TestQuestion {
    const wrongOptions = allVocabulary
      .filter(w => w.english !== word.english && w.german !== word.german)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);

    const options = this.shuffleArray([word.english, ...wrongOptions]);

    return {
      id: `vocab-trans-q${index + 1}`,
      question: `What is the English translation of "${word.german}"?`,
      options,
      answer: word.english,
      category: word.category,
      difficulty: word.difficulty,
      type: 'vocabulary'
    };
  }

  private static createDefinitionQuestion(word: any, allVocabulary: any[], index: number): TestQuestion {
    const wrongOptions = allVocabulary
      .filter(w => w.german !== word.german && w.english !== word.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.german);

    const options = this.shuffleArray([word.german, ...wrongOptions]);

    return {
      id: `vocab-def-q${index + 1}`,
      question: `Which German word means "${word.english}"?`,
      options,
      answer: word.german,
      category: word.category,
      difficulty: word.difficulty,
      type: 'vocabulary'
    };
  }

  private static createArticleGenderQuestion(article: any, index: number): TestQuestion {
    return {
      id: `article-gender-q${index + 1}`,
      question: `What is the correct article for "${article.german}"?`,
      options: ['der', 'die', 'das'],
      answer: article.gender,
      category: article.category,
      difficulty: 2,
      type: 'articles'
    };
  }

  private static createArticleDefinitionQuestion(article: any, index: number): TestQuestion {
    return {
      id: `article-def-q${index + 1}`,
      question: `"${article.gender} ${article.german}" means:`,
      options: [article.english, 'house', 'water', 'book'], // Should be improved with real wrong options
      answer: article.english,
      category: article.category,
      difficulty: 2,
      type: 'articles'
    };
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
