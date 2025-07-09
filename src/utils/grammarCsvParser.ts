// Define the structure of a question object for type safety
export interface GrammarQuestion {
  id: string;
  category: string;
  question_type: string;
  prompt: string;
  correct_answer: string;
  option_b: string;
  option_c: string;
  helper_text: string;
  jumbled_words?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: string;
  category: string;
  helper_text: string;
}

/**
 * Simple CSV parser for grammar questions
 * @param csvContent The CSV file content as a string
 * @returns Array of GrammarQuestion objects
 */
export function parseGrammarCSV(csvContent: string): GrammarQuestion[] {
  try {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',');
    const questions: GrammarQuestion[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length) {
        const question: Record<string, string> = {};
        headers.forEach((header, index) => {
          question[header.trim()] = values[index]?.trim() || '';
        });
        questions.push(question as unknown as GrammarQuestion);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing grammar CSV:', error);
    return [];
  }
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

/**
 * Gets the punctuation from the correct sentence
 * @param correctSentence The correct sentence
 * @returns The punctuation character ('.' or '?')
 */
function getPunctuation(correctSentence: string): string {
  const trimmed = correctSentence.trim();
  const lastChar = trimmed[trimmed.length - 1];
  return (lastChar === '?' || lastChar === '.') ? lastChar : '.';
}

/**
 * Generates incorrect sentence options by randomly arranging words
 * @param words Array of words to arrange
 * @param correctSentence The correct sentence to avoid duplicating
 * @param count Number of incorrect options to generate
 * @returns Array of incorrect sentence options
 */
function generateIncorrectSentences(words: string[], correctSentence: string, count: number): string[] {
  const incorrectOptions: string[] = [];
  const maxAttempts = 50; // Prevent infinite loops
  const punctuation = getPunctuation(correctSentence);
  
  while (incorrectOptions.length < count && incorrectOptions.length < maxAttempts) {
    // Shuffle the words randomly
    const shuffledWords = [...words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }
    
    // Create a sentence from shuffled words with correct punctuation
    const shuffledSentence = shuffledWords.join(' ') + punctuation;
    
    // Only add if it's different from the correct answer and not already added
    if (shuffledSentence !== correctSentence && !incorrectOptions.includes(shuffledSentence)) {
      incorrectOptions.push(shuffledSentence);
    }
  }
  
  // If we couldn't generate enough unique options, fill with variations
  while (incorrectOptions.length < count) {
    const variation = generateSentenceVariation(words, correctSentence, incorrectOptions, punctuation);
    if (variation && !incorrectOptions.includes(variation)) {
      incorrectOptions.push(variation);
    } else {
      // Fallback: create a simple incorrect sentence
      const fallback = words.slice().reverse().join(' ') + punctuation;
      if (!incorrectOptions.includes(fallback) && fallback !== correctSentence) {
        incorrectOptions.push(fallback);
      } else {
        break; // Can't generate more unique options
      }
    }
  }
  
  return incorrectOptions;
}

/**
 * Generates a sentence variation using different arrangements
 * @param words Array of words
 * @param correctSentence Correct sentence to avoid
 * @param existingOptions Already generated options to avoid
 * @param punctuation The punctuation to use for the sentence
 * @returns A new sentence variation or null if none can be generated
 */
function generateSentenceVariation(words: string[], correctSentence: string, existingOptions: string[], punctuation: string): string | null {
  // Try moving the first word to different positions
  for (let pos = 1; pos < words.length; pos++) {
    const variation = [...words];
    const firstWord = variation.shift();
    if (firstWord) {
      variation.splice(pos, 0, firstWord);
      const sentence = variation.join(' ') + punctuation;
      
      if (sentence !== correctSentence && !existingOptions.includes(sentence)) {
        return sentence;
      }
    }
  }
  
  // Try swapping adjacent words
  for (let i = 0; i < words.length - 1; i++) {
    const variation = [...words];
    [variation[i], variation[i + 1]] = [variation[i + 1], variation[i]];
    const sentence = variation.join(' ') + punctuation;
    
    if (sentence !== correctSentence && !existingOptions.includes(sentence)) {
      return sentence;
    }
  }
  
  return null;
}

/**
 * Converts a GrammarQuestion from CSV format to a TestQuestion for the quiz
 * @param grammarQuestion The question from the CSV
 * @returns A TestQuestion object ready for the quiz
 */
export function convertToTestQuestion(grammarQuestion: GrammarQuestion): TestQuestion {
  const { id, category, question_type, prompt, correct_answer, option_b, option_c, helper_text } = grammarQuestion;
  
  let question: string;
  let options: string[];
  let answer: string;

  switch (question_type) {
    case 'fill_in_blank': {
      question = prompt;
      options = [correct_answer, option_b, option_c].filter(Boolean);
      answer = correct_answer;
      break;
    }
      
    case 'multiple_choice': {
      question = prompt;
      options = [correct_answer, option_b, option_c].filter(Boolean);
      answer = correct_answer;
      break;
    }
      
    case 'build_sentence': {
      // For build_sentence, the prompt contains pipe-separated words
      // and the correct_answer is the complete sentence
      const words = prompt.split('|').map(w => w.trim());
      question = `Build a correct German sentence using these words: ${words.join(', ')}`;
      
      // Generate incorrect sentence options by randomly arranging the words
      const incorrectOptions = generateIncorrectSentences(words, correct_answer, 3);
      options = [correct_answer, ...incorrectOptions];
      answer = correct_answer;
      break;
    }
      
    default: {
      question = prompt;
      options = [correct_answer, option_b, option_c].filter(Boolean);
      answer = correct_answer;
    }
  }

  return {
    id: `g-${id}`,
    question,
    options: shuffleOptions(options),
    answer,
    type: question_type,
    category,
    helper_text
  };
}

/**
 * Shuffles options array
 * @param options Array of answer options
 * @returns Shuffled array of options
 */
function shuffleOptions(options: string[]): string[] {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Loads and parses grammar questions from CSV data
 * @param csvContent The CSV content string
 * @returns Array of TestQuestion objects
 */
export function loadGrammarQuestions(csvContent: string): TestQuestion[] {
  const grammarQuestions = parseGrammarCSV(csvContent);
  return grammarQuestions.map((q) => convertToTestQuestion(q));
}

/**
 * Filters questions by category
 * @param questions Array of test questions
 * @param category Category to filter by
 * @returns Filtered array of questions
 */
export function filterQuestionsByCategory(questions: TestQuestion[], category: string): TestQuestion[] {
  return questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
}

/**
 * Filters questions by type
 * @param questions Array of test questions
 * @param type Question type to filter by
 * @returns Filtered array of questions
 */
export function filterQuestionsByType(questions: TestQuestion[], type: string): TestQuestion[] {
  return questions.filter(q => q.type === type);
}

/**
 * Gets available categories from questions
 * @param questions Array of test questions
 * @returns Array of unique categories
 */
export function getAvailableCategories(questions: TestQuestion[]): string[] {
  const categories = questions.map(q => q.category);
  return [...new Set(categories)];
}

/**
 * Gets available question types from questions
 * @param questions Array of test questions
 * @returns Array of unique question types
 */
export function getAvailableTypes(questions: TestQuestion[]): string[] {
  const types = questions.map(q => q.type);
  return [...new Set(types)];
}
