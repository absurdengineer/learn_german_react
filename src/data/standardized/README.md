# DeutschMeister Standardized Data System

This system provides a unified interface for accessing all learning resources in the DeutschMeister application. All data from CSV files is parsed, standardized, and cached for optimal performance.

## Overview

The standardized data system consolidates:
- **Vocabulary** (475+ words from `vocabulary.csv`)
- **Articles/Nouns** (400+ nouns from `articles.csv`) 
- **Grammar Lessons** (30+ lessons from `grammar_lessons.csv`)
- **Grammar Practice** (1000+ questions from `grammar_practice.csv`)

## Quick Start

```typescript
import { dataManager, generateVocabularyTest } from './standardized';

// Get all vocabulary
const vocabulary = dataManager.getVocabulary();

// Generate a test
const test = generateVocabularyTest(20);

// Get statistics
const stats = dataManager.getDataStatistics();
```

## Data Types

### StandardizedVocabulary
```typescript
interface StandardizedVocabulary {
  id: string;
  type: 'vocabulary';
  german: string;
  english: string;
  pronunciation?: string;
  wordType: 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
  gender?: 'masculine' | 'feminine' | 'neuter';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category?: string;
  frequency?: number;
  tags?: string[];
  examples?: Array<{ german: string; english: string; }>;
}
```

### StandardizedArticle
```typescript
interface StandardizedArticle {
  id: string;
  type: 'article';
  german: string;
  english: string;
  pronunciation?: string;
  gender: 'der' | 'die' | 'das';
  category?: string;
  frequency?: number;
  tags?: string[];
}
```

### StandardizedGrammarLesson
```typescript
interface StandardizedGrammarLesson {
  id: string;
  type: 'grammar_lesson';
  day: number;
  week: number;
  title: string;
  content: string;
  mission: string;
  helpfulHint?: string;
  funFact?: string;
  category?: string;
  estimatedTime?: number;
  difficulty?: number;
  tags?: string[];
}
```

### StandardizedGrammarPractice
```typescript
interface StandardizedGrammarPractice {
  id: string;
  type: 'grammar_practice';
  dayReference: number;
  questionType: 'multiple_choice' | 'fill_in_blank' | 'true_false' | 'ordering';
  prompt: string;
  correctAnswer: string;
  options: string[];
  helperText?: string;
  category?: string;
  difficulty?: number;
  tags?: string[];
}
```

## Data Manager API

### Basic Data Access
```typescript
// Get all data by type
const vocabulary = dataManager.getVocabulary();
const articles = dataManager.getArticles();
const lessons = dataManager.getGrammarLessons();
const practice = dataManager.getGrammarPractice();

// Get all data combined
const allData = dataManager.getAllData();
```

### Filtered Access
```typescript
// Filter vocabulary
const nouns = dataManager.getVocabularyByWordType('noun');
const animals = dataManager.getVocabularyByCategory('animals');
const beginner = dataManager.getVocabularyByDifficulty(2);

// Filter articles
const derWords = dataManager.getArticlesByGender('der');
const familyWords = dataManager.getArticlesByCategory('family');

// Filter grammar
const week1Lessons = dataManager.getGrammarLessonsByWeek(1);
const day3Lesson = dataManager.getGrammarLessonByDay(3);
const day5Practice = dataManager.getGrammarPracticeByDay(5);
```

### Search and Random Selection
```typescript
// Search across all data
const results = dataManager.searchData('Familie');

// Get random selections
const randomVocab = dataManager.getRandomVocabulary(10);
const randomArticles = dataManager.getRandomArticles(10, 'der');
const randomPractice = dataManager.getRandomGrammarPractice(5, 3);
```

### Statistics
```typescript
const stats = dataManager.getDataStatistics();
console.log(stats);
// {
//   vocabulary: { 
//     total: 475, 
//     byWordType: { noun: 200, verb: 150, ... },
//     withPronunciation: 400
//   },
//   articles: { 
//     total: 406, 
//     byGender: { der: 150, die: 156, das: 100 }
//   },
//   ...
// }
```

## Test Generator API

### Vocabulary Tests
```typescript
// Basic vocabulary test
const test = StandardizedTestGenerator.generateVocabularyTest({
  count: 20,
  category: 'animals',
  wordType: 'noun',
  maxDifficulty: 3,
  testType: 'translation' // 'translation' | 'definition' | 'mixed'
});
```

### Articles Tests
```typescript
// Articles/gender test
const test = StandardizedTestGenerator.generateArticlesTest({
  count: 15,
  category: 'family',
  gender: 'der',
  includeDefinitions: true
});
```

### Grammar Tests
```typescript
// Grammar practice test
const test = StandardizedTestGenerator.generateGrammarTest({
  count: 10,
  dayReference: 5,
  category: 'verbs',
  questionType: 'multiple_choice',
  maxDifficulty: 3
});
```

### Mixed Tests
```typescript
// Combined test
const test = StandardizedTestGenerator.generateMixedTest({
  count: 30,
  vocabRatio: 0.5,     // 50% vocabulary
  articlesRatio: 0.25, // 25% articles
  grammarRatio: 0.25   // 25% grammar
});
```

## Data Export

### JSON Export
```typescript
import { exportToJSON } from './standardized';

const data = exportToJSON();
// Complete data dump with statistics
```

### CSV Export
```typescript
import { exportToCSV } from './standardized';

const vocabularyCSV = exportToCSV('vocabulary');
const articlesCSV = exportToCSV('article');
const lessonsCSV = exportToCSV('grammar_lesson');
const practiceCSV = exportToCSV('grammar_practice');
```

## External Usage

This system can be used outside the React application:

### Node.js Script
```javascript
// external-script.js
const { dataManager, generateVocabularyTest } = require('./src/data/standardized');

// Generate 100 vocabulary tests for analysis
const tests = [];
for (let i = 0; i < 100; i++) {
  tests.push(generateVocabularyTest(20));
}

console.log(`Generated ${tests.length} tests`);
```

### Data Analysis
```typescript
// analysis.ts
import { dataManager } from './standardized';

const stats = dataManager.getDataStatistics();
const vocabulary = dataManager.getVocabulary();

// Analyze word frequency distribution
const frequencies = vocabulary.map(v => v.frequency);
const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;

console.log(`Average word frequency: ${avgFrequency}`);
```

### Test Generation Service
```typescript
// test-service.ts
import { StandardizedTestGenerator } from './standardized';

export class TestService {
  static generateDailyTest(day: number) {
    return StandardizedTestGenerator.generateMixedTest({
      count: 20,
      maxDifficulty: Math.ceil(day / 7) // Difficulty increases by week
    });
  }
  
  static generateCategoryTest(category: string) {
    return StandardizedTestGenerator.generateVocabularyTest({
      count: 15,
      category
    });
  }
}
```

## Performance

- **Caching**: All data is cached after first load
- **Lazy Loading**: CSV parsing happens on first access
- **Memory Efficient**: Shared instances and smart filtering
- **Fast Access**: O(1) lookups for most operations

## Data Sources

| Type | Source File | Records | Description |
|------|-------------|---------|-------------|
| Vocabulary | `vocabulary.csv` | 475+ | A1 German words with translations, pronunciation, examples |
| Articles | `articles.csv` | 406+ | German nouns with articles (der/die/das) |
| Grammar Lessons | `grammar_lessons.csv` | 30+ | Structured lessons for 30-day learning plan |
| Grammar Practice | `grammar_practice.csv` | 1000+ | Practice questions covering all grammar topics |

## Extensibility

The system is designed to be easily extended:

1. **Add new data types**: Extend `StandardizedDataItem` union
2. **Create new parsers**: Extend `BaseCSVParser<T>`
3. **Add new filters**: Extend `DataManager` methods
4. **Create custom test types**: Extend `TestGenerator` methods

## Version
- **Version**: 1.0.0
- **Data Format**: Standardized interfaces with backward compatibility
- **Cache Version**: Automatic invalidation on data changes
