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
 */
const VocabularyAdditionalInfo: React.FC<{ word: VocabularyWord }> = ({ word }) => {
  const genderColor = getGenderColor(word.gender);

  return (
    <div className="space-y-4">
      {/* Gender and word type info */}
      {word.hasGender() && (
        <div className="flex items-center justify-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
            {word.gender}
          </span>
          <span className="text-sm text-gray-600">
            ({getGenderDisplayName(word.gender)})
          </span>
        </div>
      )}

      {/* Full noun form */}
      {word.isNoun() && word.hasGender() && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">Full form: </span>
          {word.getFullNoun()}
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
              className={`px-2 py-1 text-xs rounded-full ${
                word.hasGender() && word.type === 'article' 
                  ? `${genderColor.bg} ${genderColor.text} border ${genderColor.border}`
                  : 'bg-blue-100 text-blue-800'
              }`}
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
 * Converts Vocabulary Words to Flashcard Items with rich rendering
 */
export const vocabularyToFlashcardAdapter = (words: VocabularyWord[]): FlashcardItem[] => {
  return words.map(word => ({
    id: word.id?.value || Math.random().toString(36).substr(2, 9),
    front: word.german,
    back: word.english,
    category: word.tags.join(', '),
    helperText: word.pronunciation ? `/${word.pronunciation}/` : undefined,
    additionalInfo: (
      <VocabularyAdditionalInfo word={word} />
    ),
    metadata: {
      type: 'vocabulary',
      originalWord: word,
      gender: word.gender,
      wordType: word.type
    }
  }));
};



/**
 * Custom renderer for vocabulary flashcards with gender colors
 */
export const vocabularyFlashcardRenderer = (item: FlashcardItem, showAnswer: boolean): React.ReactNode => {
  const word = item.metadata?.originalWord as VocabularyWord;
  const genderColor = getGenderColor(word?.gender);

  return (
    <div className={`${
      word?.hasGender() ? `${genderColor.bg} ${genderColor.border} border-2 rounded-lg p-6 -m-6` : ''
    }`}>
      {/* Category */}
      {item.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {item.category}
          </span>
        </div>
      )}

      {/* Front of card with gender styling */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className={`text-2xl sm:text-3xl font-bold ${
            word?.hasGender() ? genderColor.text : 'text-gray-800'
          }`}>
            {item.front}
          </h2>
          {word?.hasGender() && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
              {word.gender}
            </span>
          )}
        </div>
        
        {/* Helper text (pronunciation) */}
        {item.helperText && !showAnswer && (
          <p className={`text-sm italic ${
            word?.hasGender() ? genderColor.text + ' opacity-75' : 'text-gray-500'
          }`}>
            {item.helperText}
          </p>
        )}
      </div>

      {/* Answer section - only show when answer is revealed */}
      {showAnswer && (
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-green-600 mb-4">
            {item.back}
          </h3>
          {item.additionalInfo && (
            <div className="text-left">
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
