import React from 'react';
import type { GrammarPracticeQuestion } from '../../domain/entities/GrammarPractice';
import type { ExampleSentence, VocabularyWord } from '../../domain/entities/Vocabulary';
import { getGenderColor, getGenderDisplayName } from '../../utils/genderColors';
import type { FlashcardItem } from './FlashcardSession';

/**
 * Converts Grammar Practice Questions to Flashcard Items
 */
export const grammarToFlashcardAdapter = (questions: GrammarPracticeQuestion[]): FlashcardItem[] => {
  return questions.map(question => ({
    id: question.id?.toString() || Math.random().toString(36).substr(2, 9),
    front: question.prompt,
    back: question.correctAnswer,
    category: question.category,
    helperText: question.helperText,
    metadata: {
      type: 'grammar',
      originalQuestion: question
    }
  }));
};

/**
 * Component to render additional vocabulary information
 * Note: Adapted for vocabulary.csv which contains mainly verbs, adjectives, adverbs, pronouns
 */
const VocabularyAdditionalInfo: React.FC<{ word: VocabularyWord }> = ({ word }) => {
  const genderColor = getGenderColor(word.gender);

  return (
    <div className="space-y-4">
      {/* Word type info */}
      <div className="flex items-center justify-center gap-2">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {word.type}
        </span>
        {word.frequency && (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            Frequency: {word.frequency}/10
          </span>
        )}
      </div>

      {/* Gender and full noun form - only show if gender exists (rare in vocabulary.csv) */}
      {word.hasGender() && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
              {word.gender}
            </span>
            <span className="text-sm text-gray-600">
              ({getGenderDisplayName(word.gender)})
            </span>
          </div>
          
          {word.isNoun() && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">Full form: </span>
              {word.getFullNoun()}
            </div>
          )}
        </div>
      )}

      {/* Example sentences */}
      {word.exampleSentences.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">Examples:</h4>
          {word.exampleSentences.slice(0, 2).map((example: ExampleSentence, index: number) => (
            <div key={index} className="text-sm bg-gray-50 p-3 rounded-md">
              <p className="italic text-gray-800 mb-1">{example.german}</p>
              <p className="text-gray-600">{example.english}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {word.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {word.tags.map((tag: string) => (
            <span 
              key={tag} 
              className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 border border-green-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced vocabulary flashcard question types
 */
export const VocabularyQuestionType = {
  GERMAN_TO_ENGLISH: 'german-to-english',
  ENGLISH_TO_GERMAN: 'english-to-german', 
  GENDER_PRACTICE: 'gender-practice',
  ARTICLE_PRACTICE: 'article-practice',
  PRONUNCIATION: 'pronunciation',
  CONTEXT_CLUE: 'context-clue',
  WORD_BUILDING: 'word-building'
} as const;

export type VocabularyQuestionType = typeof VocabularyQuestionType[keyof typeof VocabularyQuestionType];

/**
 * Generates varied question types for vocabulary learning
 * Note: Only generates questions based on data available in vocabulary.csv
 */
const generateVocabularyQuestion = (word: VocabularyWord, type?: VocabularyQuestionType): Partial<FlashcardItem> => {
  const questionType = type || getRandomQuestionType(word);
  
  switch (questionType) {
    case VocabularyQuestionType.GERMAN_TO_ENGLISH:
      return {
        front: word.german,
        back: word.english,
        category: `🇩🇪→🇺🇸 ${word.type}`,
        helperText: word.pronunciation ? `/${word.pronunciation}/` : undefined
      };
      
    case VocabularyQuestionType.ENGLISH_TO_GERMAN:
      return {
        front: word.english,
        back: word.german,
        category: `🇺🇸→🇩🇪 ${word.type}`,
        helperText: 'What is the German word?'
      };
      
    case VocabularyQuestionType.GENDER_PRACTICE:
    case VocabularyQuestionType.ARTICLE_PRACTICE:
      // Disabled: vocabulary.csv contains no nouns with gender information
      // Fallback to German-to-English translation
      return generateVocabularyQuestion(word, VocabularyQuestionType.GERMAN_TO_ENGLISH);
      
    case VocabularyQuestionType.PRONUNCIATION:
      if (word.pronunciation) {
        return {
          front: `How do you pronounce "${word.german}"?`,
          back: `/${word.pronunciation}/`,
          category: '🗣️ Pronunciation',
          helperText: `${word.english} (${word.type})`
        };
      }
      return generateVocabularyQuestion(word, VocabularyQuestionType.GERMAN_TO_ENGLISH);
      
    case VocabularyQuestionType.CONTEXT_CLUE:
      if (word.exampleSentences.length > 0) {
        const example = word.exampleSentences[0];
        const hiddenWord = word.german;
        
        // Try multiple replacement strategies to ensure we find the word
        let sentenceWithBlank = example.german;
        
        // Strategy 1: Exact case-insensitive match with word boundaries
        const wordBoundaryRegex = new RegExp(`\\b${hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        sentenceWithBlank = sentenceWithBlank.replace(wordBoundaryRegex, '____');
        
        // Strategy 2: If no replacement happened, try without word boundaries (for partial matches)
        if (sentenceWithBlank === example.german) {
          const simpleRegex = new RegExp(hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          sentenceWithBlank = sentenceWithBlank.replace(simpleRegex, '____');
        }
        
        // Strategy 3: If still no replacement, check for capitalized version at start of sentence
        if (sentenceWithBlank === example.german) {
          const capitalizedWord = hiddenWord.charAt(0).toUpperCase() + hiddenWord.slice(1);
          const capitalizedRegex = new RegExp(`\\b${capitalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
          sentenceWithBlank = sentenceWithBlank.replace(capitalizedRegex, '____');
        }
        
        // Only create context question if we successfully created a blank
        if (sentenceWithBlank !== example.german && sentenceWithBlank.includes('____')) {
          return {
            front: `Fill in the blank:\n"${sentenceWithBlank}"`,
            back: hiddenWord,
            category: '📖 Context Practice',
            helperText: `Translation: "${example.english}"`
          };
        }
      }
      return generateVocabularyQuestion(word, VocabularyQuestionType.GERMAN_TO_ENGLISH);
      
    case VocabularyQuestionType.WORD_BUILDING:
      if (word.type === 'verb') {
        return {
          front: `What is the infinitive form?\n"${word.english}"`,
          back: word.german,
          category: '🔧 Word Building',
          helperText: 'Think about the verb form'
        };
      }
      return generateVocabularyQuestion(word, VocabularyQuestionType.ENGLISH_TO_GERMAN);
      
    default:
      return generateVocabularyQuestion(word, VocabularyQuestionType.GERMAN_TO_ENGLISH);
  }
};

/**
 * Determines the best question type based on word properties and available CSV data
 */
const getRandomQuestionType = (word: VocabularyWord): VocabularyQuestionType => {
  const availableTypes: VocabularyQuestionType[] = [
    VocabularyQuestionType.GERMAN_TO_ENGLISH,
    VocabularyQuestionType.ENGLISH_TO_GERMAN
  ];
  
  // NOTE: Gender/Article practice is disabled because vocabulary.csv contains no nouns with articles
  // The CSV mainly contains verbs, adjectives, adverbs, and pronouns
  
  // Add pronunciation practice if available
  if (word.pronunciation) {
    availableTypes.push(VocabularyQuestionType.PRONUNCIATION);
  }
  
  // Add context practice if examples available
  if (word.exampleSentences.length > 0) {
    availableTypes.push(VocabularyQuestionType.CONTEXT_CLUE);
  }
  
  // Add word building for verbs
  if (word.type === 'verb') {
    availableTypes.push(VocabularyQuestionType.WORD_BUILDING);
  }
  
  // Weight the selection to favor basic translation practice (50% of the time)
  const random = Math.random();
  if (random < 0.25) {
    // 25% chance for German to English
    return VocabularyQuestionType.GERMAN_TO_ENGLISH;
  } else if (random < 0.5) {
    // 25% chance for English to German
    return VocabularyQuestionType.ENGLISH_TO_GERMAN;
  } else {
    // 50% chance for other types (if available)
    const specialTypes = availableTypes.filter(type => 
      type !== VocabularyQuestionType.GERMAN_TO_ENGLISH && 
      type !== VocabularyQuestionType.ENGLISH_TO_GERMAN
    );
    
    if (specialTypes.length > 0) {
      return specialTypes[Math.floor(Math.random() * specialTypes.length)];
    } else {
      return VocabularyQuestionType.GERMAN_TO_ENGLISH;
    }
  }
};

/**
 * Enhanced vocabulary flashcard adapter with varied question types
 */
export const vocabularyToFlashcardAdapter = (words: VocabularyWord[]): FlashcardItem[] => {
  return words.map(word => {
    const questionData = generateVocabularyQuestion(word);
    
    return {
      id: word.id?.value || Math.random().toString(36).substr(2, 9),
      front: questionData.front || word.german,
      back: questionData.back || word.english,
      category: questionData.category || word.tags.join(', '),
      helperText: questionData.helperText,
      additionalInfo: (
        <VocabularyAdditionalInfo word={word} />
      ),
      metadata: {
        type: 'vocabulary',
        originalWord: word,
        gender: word.gender,
        wordType: word.type,
        questionType: questionData.category
      }
    };
  });
};

/**
 * Enhanced vocabulary adapter with specific question type control
 * Note: Gender/Article practice is disabled as vocabulary.csv contains no nouns with articles
 */
export const vocabularyToFlashcardAdapterWithType = (
  words: VocabularyWord[], 
  preferredTypes?: VocabularyQuestionType[],
  forceVariety: boolean = true
): FlashcardItem[] => {
  return words.map((word, index) => {
    let questionType: VocabularyQuestionType;
    
    if (preferredTypes && preferredTypes.length > 0) {
      // Filter to only available types for this word based on CSV data
      const availablePreferred = preferredTypes.filter(type => {
        switch (type) {
          case VocabularyQuestionType.GENDER_PRACTICE:
          case VocabularyQuestionType.ARTICLE_PRACTICE:
            // Disabled: No gender data in vocabulary.csv
            return false;
          case VocabularyQuestionType.PRONUNCIATION:
            return !!word.pronunciation;
          case VocabularyQuestionType.CONTEXT_CLUE:
            return word.exampleSentences.length > 0;
          case VocabularyQuestionType.WORD_BUILDING:
            return word.type === 'verb';
          default:
            return true;
        }
      });
      
      if (availablePreferred.length > 0) {
        if (forceVariety && words.length > 1) {
          // Cycle through types to ensure variety
          questionType = availablePreferred[index % availablePreferred.length];
        } else {
          // Random selection from preferred types
          questionType = availablePreferred[Math.floor(Math.random() * availablePreferred.length)];
        }
      } else {
        // Fallback to automatic selection
        questionType = getRandomQuestionType(word);
      }
    } else {
      // Automatic selection
      questionType = getRandomQuestionType(word);
    }
    
    const questionData = generateVocabularyQuestion(word, questionType);
    
    return {
      id: word.id?.value || Math.random().toString(36).substr(2, 9),
      front: questionData.front || word.german,
      back: questionData.back || word.english,
      category: questionData.category || word.tags.join(', '),
      helperText: questionData.helperText,
      additionalInfo: (
        <VocabularyAdditionalInfo word={word} />
      ),
      metadata: {
        type: 'vocabulary',
        originalWord: word,
        gender: word.gender,
        wordType: word.type,
        questionType: questionData.category,
        generatedType: questionType
      }
    };
  });
};

/**
 * Utility function to get human-readable question type descriptions
 * Note: Gender/Article practice disabled as vocabulary.csv contains no nouns with articles
 */
export const getQuestionTypeDescription = (type: VocabularyQuestionType): { name: string; emoji: string; description: string } => {
  switch (type) {
    case VocabularyQuestionType.GERMAN_TO_ENGLISH:
      return { 
        name: 'German → English', 
        emoji: '🇩🇪→🇺🇸', 
        description: 'Translate German words to English' 
      };
    case VocabularyQuestionType.ENGLISH_TO_GERMAN:
      return { 
        name: 'English → German', 
        emoji: '🇺🇸→🇩🇪', 
        description: 'Translate English words to German' 
      };
    case VocabularyQuestionType.GENDER_PRACTICE:
      return { 
        name: 'Gender Practice (Disabled)', 
        emoji: '❌', 
        description: 'Not available - vocabulary data contains no nouns with articles' 
      };
    case VocabularyQuestionType.ARTICLE_PRACTICE:
      return { 
        name: 'Article Practice (Disabled)', 
        emoji: '❌', 
        description: 'Not available - vocabulary data contains no nouns with articles' 
      };
    case VocabularyQuestionType.PRONUNCIATION:
      return { 
        name: 'Pronunciation', 
        emoji: '🗣️', 
        description: 'Learn correct pronunciation with IPA notation' 
      };
    case VocabularyQuestionType.CONTEXT_CLUE:
      return { 
        name: 'Context Practice', 
        emoji: '📖', 
        description: 'Fill blanks in example sentences' 
      };
    case VocabularyQuestionType.WORD_BUILDING:
      return { 
        name: 'Word Building', 
        emoji: '🔧', 
        description: 'Practice verb forms and word construction' 
      };
    default:
      return { 
        name: 'Mixed Practice', 
        emoji: '🎲', 
        description: 'Variety of question types based on available data' 
      };
  }
};

/**
 * Enhanced custom renderer for vocabulary flashcards 
 * Adapted for vocabulary.csv which mainly contains verbs, adjectives, adverbs, pronouns
 */
export const vocabularyFlashcardRenderer = (item: FlashcardItem, showAnswer: boolean): React.ReactNode => {
  const word = item.metadata?.originalWord as VocabularyWord;
  const questionType = item.metadata?.questionType as string;
  const genderColor = getGenderColor(word?.gender);

  // Minimal styling without background colors
  const getQuestionTypeStyles = () => {
    // Remove all background gradients and colors for clean appearance
    return 'rounded-lg p-6 -m-6';
  };

  return (
    <div className={`${getQuestionTypeStyles()}`}>
      {/* Enhanced Category Display */}
      {item.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-gray-600 text-sm font-medium rounded-full border border-gray-300">
            {item.category}
          </span>
        </div>
      )}

      {/* Front of card with enhanced styling */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center leading-tight text-gray-800">
            {item.front.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < item.front.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          
          {/* Show gender badge for German words (rare in vocabulary.csv) */}
          {word?.hasGender() && !questionType?.includes('🇺🇸→🇩🇪') && !questionType?.includes('Article') && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border} ml-2`}>
              {word.gender}
            </span>
          )}
          
          {/* Show word type badge for better context */}
          {word?.type && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 ml-2">
              {word.type}
            </span>
          )}
        </div>
        
        {/* Enhanced Helper text */}
        {item.helperText && !showAnswer && (
          <div className="text-center">
            <p className="text-sm italic text-gray-600">
              {item.helperText}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Answer section */}
      {showAnswer && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-600 mb-4">
              {item.back}
            </h3>
            
            {/* Show additional context for special question types */}
            {questionType?.includes('Article') && word?.hasGender() && (
              <div className="rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Remember: <span className={`font-bold ${genderColor.text}`}>{word.gender}</span> is {getGenderDisplayName(word.gender)}
                </p>
              </div>
            )}
            
            {questionType?.includes('Pronunciation') && (
              <div className="rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Word:</span> {word?.german} → {word?.english}
                </p>
              </div>
            )}
            
            {questionType?.includes('Context') && word?.exampleSentences.length > 0 && (
              <div className="rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Full sentence:</span><br />
                  "{word.exampleSentences[0].german}"
                </p>
              </div>
            )}
            
            {questionType?.includes('Building') && word?.type === 'verb' && (
              <div className="rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Verb type:</span> German infinitive verbs typically end in -en, -n, or -ern
                </p>
              </div>
            )}
          </div>
          
          {/* Additional word information - adapted for vocabulary.csv content */}
          {item.additionalInfo && !questionType?.includes('Article') && !questionType?.includes('Context') && (
            <div className="text-left rounded-lg p-4">
              {item.additionalInfo}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Custom renderer for grammar flashcards
 */
export const grammarFlashcardRenderer = (item: FlashcardItem, showAnswer: boolean): React.ReactNode => {
  return (
    <>
      {/* Category */}
      {item.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
            {item.category}
          </span>
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {item.front}
        </h2>
        {item.helperText && !showAnswer && (
          <p className="text-sm text-gray-500 italic">
            {item.helperText}
          </p>
        )}
      </div>

      {/* Answer - only show when revealed */}
      {showAnswer && (
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-green-600">
            {item.back}
          </h3>
        </div>
      )}
    </>
  );
};
