/**
 * Example: Using DeutschMeister Standardized Data System Externally
 * 
 * This file demonstrates how to use the standardized data system
 * outside of the React application for various purposes.
 */

// Import the standardized data system
import {
    dataManager,
    exportToJSON,
    generateMixedTest,
    generateVocabularyTest,
    getDataStatistics,
    getVocabulary,
    StandardizedTestGenerator
} from './index';

/**
 * Example 1: Basic Data Access
 */
function basicDataAccess() {
  console.log('=== Basic Data Access ===');
  
  // Get all vocabulary
  const vocabulary = getVocabulary();
  console.log(`Total vocabulary words: ${vocabulary.length}`);
  
  // Get specific word types
  const nouns = dataManager.getVocabularyByWordType('noun');
  const verbs = dataManager.getVocabularyByWordType('verb');
  console.log(`Nouns: ${nouns.length}, Verbs: ${verbs.length}`);
  
  // Get articles by gender
  const derWords = dataManager.getArticlesByGender('der');
  const dieWords = dataManager.getArticlesByGender('die');
  const dasWords = dataManager.getArticlesByGender('das');
  console.log(`der: ${derWords.length}, die: ${dieWords.length}, das: ${dasWords.length}`);
  
  // Get grammar lessons
  const lessons = dataManager.getGrammarLessons();
  console.log(`Total grammar lessons: ${lessons.length}`);
}

/**
 * Example 2: Test Generation
 */
function testGeneration() {
  console.log('\n=== Test Generation ===');
  
  // Generate different types of tests
  const vocabTest = generateVocabularyTest(15);
  const mixedTest = generateMixedTest(25);
  
  console.log(`Generated vocabulary test with ${vocabTest.questions.length} questions`);
  console.log(`Estimated time: ${vocabTest.estimatedTime} minutes`);
  console.log(`Categories: ${vocabTest.categories.join(', ')}`);
  
  console.log(`Generated mixed test with ${mixedTest.questions.length} questions`);
  console.log(`Difficulty level: ${mixedTest.difficulty}/5`);
  
  // Generate category-specific test
  const animalTest = StandardizedTestGenerator.generateVocabularyTest({
    count: 10,
    category: 'animals',
    testType: 'translation'
  });
  console.log(`Generated animal vocabulary test with ${animalTest.questions.length} questions`);
}

/**
 * Example 3: Data Analysis
 */
function dataAnalysis() {
  console.log('\n=== Data Analysis ===');
  
  const stats = getDataStatistics();
  console.log('Data Statistics:', JSON.stringify(stats, null, 2));
  
  // Analyze word frequency distribution
  const vocabulary = getVocabulary();
  const frequencies = vocabulary.map(v => v.frequency || 1);
  const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const maxFrequency = Math.max(...frequencies);
  const minFrequency = Math.min(...frequencies);
  
  console.log(`Word frequency - Avg: ${avgFrequency.toFixed(2)}, Min: ${minFrequency}, Max: ${maxFrequency}`);
  
  // Find most common categories
  const categories = vocabulary.reduce((acc, word) => {
    const category = word.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('Top categories:', Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(', '));
}

/**
 * Example 4: Search and Filter
 */
function searchAndFilter() {
  console.log('\n=== Search and Filter ===');
  
  // Search for specific words
  const familyWords = dataManager.searchData('Familie');
  console.log(`Found ${familyWords.length} items related to "Familie"`);
  
  // Get vocabulary by category
  const animalWords = dataManager.getVocabularyByCategory('animals');
  console.log(`Found ${animalWords.length} animal words`);
  
  // Get beginner-level content
  const beginnerVocab = dataManager.getVocabularyByDifficulty(2);
  console.log(`Found ${beginnerVocab.length} beginner vocabulary words`);
  
  // Get specific grammar practice
  const day3Practice = dataManager.getGrammarPracticeByDay(3);
  console.log(`Found ${day3Practice.length} practice questions for day 3`);
}

/**
 * Example 5: Data Export
 */
function dataExport() {
  console.log('\n=== Data Export ===');
  
  // Export all data to JSON
  const allData = exportToJSON();
  console.log(`Exported data contains ${Object.keys(allData).length} sections`);
  console.log(`Export timestamp: ${allData.exportDate}`);
  
  // You could save this to a file:
  // fs.writeFileSync('deutschmeister-data.json', JSON.stringify(allData, null, 2));
}

/**
 * Example 6: Custom Test Generator
 */
function customTestGenerator() {
  console.log('\n=== Custom Test Generator ===');
  
  // Create a progressive difficulty test
  function generateProgressiveTest(days: number) {
    const tests = [];
    
    for (let day = 1; day <= days; day++) {
      const difficulty = Math.ceil(day / 7); // Increase difficulty weekly
      const test = StandardizedTestGenerator.generateMixedTest({
        count: 15,
        maxDifficulty: difficulty
      });
      
      test.title = `Day ${day} - Progressive Test`;
      tests.push(test);
    }
    
    return tests;
  }
  
  const weeklyTests = generateProgressiveTest(7);
  console.log(`Generated ${weeklyTests.length} progressive tests`);
  
  weeklyTests.forEach((test, index) => {
    console.log(`Day ${index + 1}: ${test.questions.length} questions, difficulty ${test.difficulty}/5`);
  });
}

/**
 * Example 7: Vocabulary Flashcard Generator
 */
function flashcardGenerator() {
  console.log('\n=== Flashcard Generator ===');
  
  // Generate flashcards for specific categories
  const categories = ['animals', 'family', 'food', 'colors'];
  
  categories.forEach(category => {
    const words = dataManager.getVocabularyByCategory(category);
    const flashcards = words.slice(0, 10).map(word => ({
      front: word.german,
      back: word.english,
      pronunciation: word.pronunciation,
      gender: word.gender,
      example: word.examples?.[0]
    }));
    
    console.log(`${category}: ${flashcards.length} flashcards`);
    if (flashcards.length > 0) {
      console.log(`  Sample: ${flashcards[0].front} → ${flashcards[0].back}`);
    }
  });
}

/**
 * Run all examples
 */
function runExamples() {
  try {
    basicDataAccess();
    testGeneration();
    dataAnalysis();
    searchAndFilter();
    dataExport();
    customTestGenerator();
    flashcardGenerator();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export functions for external use
export {
    basicDataAccess, customTestGenerator, dataAnalysis, dataExport, flashcardGenerator,
    runExamples, searchAndFilter, testGeneration
};

// Run examples if this file is executed directly
if (typeof window === 'undefined') {
  // We're in Node.js environment
  runExamples();
}
