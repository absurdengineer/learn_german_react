import { A1_VOCABULARY_WORDS, loadArticleNouns } from '../data';
import { loadRandomGrammarPractice } from '../data/grammarPractice';

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateVocabularyTest = (count = 10) => {
  const allWords = A1_VOCABULARY_WORDS;
  const uniqueWords = allWords.filter(
    (word, index, self) =>
      index === self.findIndex((t) => t.german === word.german)
  );

  const selectedWords = shuffleArray([...uniqueWords]).slice(0, count);

  const questions = selectedWords.map((word, index) => {
    const otherWords = uniqueWords.filter((w) => w.english !== word.english);
    const wrongOptions = new Set<string>();
    
    // Ensure we get exactly 3 unique wrong options
    while (wrongOptions.size < 3 && otherWords.length > wrongOptions.size) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      const option = otherWords[randomIndex].english;
      if (option && option.trim() !== '' && option !== word.english) {
        wrongOptions.add(option);
      }
      // Remove used option to avoid duplicates
      otherWords.splice(randomIndex, 1);
    }
    
    // Create exactly 4 options: 1 correct + 3 wrong, then shuffle
    const options = shuffleArray([word.english, ...Array.from(wrongOptions)]).slice(0, 4);

    return {
      id: `v-q${index + 1}`,
      question: `What is the English translation of "${word.german}"?`,
      options,
      answer: word.english,
    };
  });

  return {
    id: `vocab-test-${Date.now()}`,
    title: 'Dynamic Vocabulary Test',
    type: 'vocabulary',
    questions,
  };
};

export const generateArticlesTest = (count = 10) => {
  const allNouns = loadArticleNouns();
  const selectedNouns = shuffleArray([...allNouns]).slice(0, count);

  const questions = selectedNouns.map((noun, index) => {
    return {
      id: `a-q${index + 1}`,
      question: `What is the correct article for "${noun.german}"?`,
      options: ['der', 'die', 'das'],
      answer: noun.gender,
    };
  });

  return {
    id: `articles-test-${Date.now()}`,
    title: 'Dynamic Articles Test',
    type: 'articles',
    questions,
  };
};

export const generateGrammarTest = (count = 10) => {
  const allQuestions = loadRandomGrammarPractice(count * 3); // Get more questions to shuffle from
  const selectedQuestions = shuffleArray([...allQuestions]).slice(0, count);

  const questions = selectedQuestions.map((q, index) => {
    // Filter out empty options and ensure max 4 options
    const validOptions = q.options.filter(option => option && option.trim() !== '');
    const finalOptions = validOptions.slice(0, 4); // Limit to max 4 options
    
    return {
      id: `g-q${index + 1}`,
      question: q.prompt,
      options: finalOptions,
      answer: q.correctAnswer,
    };
  });

  return {
    id: `grammar-test-${Date.now()}`,
    title: 'Dynamic Grammar Test',
    type: 'grammar',
    questions,
  };
};

export const generateA1Test = (count = 10) => {
  const vocabCount = Math.ceil(count * 0.4);
  const articlesCount = Math.ceil(count * 0.4);
  const grammarCount = Math.floor(count * 0.2);

  const vocabQuestions = generateVocabularyTest(vocabCount).questions;
  const articlesQuestions = generateArticlesTest(articlesCount).questions;
  const grammarQuestions = generateGrammarTest(grammarCount).questions;

  const allQuestions = shuffleArray([
    ...vocabQuestions,
    ...articlesQuestions,
    ...grammarQuestions,
  ]);

  return {
    id: `a1-test-${Date.now()}`,
    title: 'A1 Comprehensive Test',
    type: 'mixed',
    questions: allQuestions.slice(0, count),
  };
};
