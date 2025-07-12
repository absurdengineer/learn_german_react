import React from "react";
import type { FlashcardItem } from "../types/Flashcard";
import type { VocabularyWord } from "../types/Vocabulary";
import { getGenderColor, getGenderDisplayName } from "./genderColors";

/**
 * Component to render additional vocabulary information
 * Note: Adapted for vocabulary.csv which contains mainly verbs, adjectives, adverbs, pronouns
 */
export const VocabularyAdditionalInfo: React.FC<{ word: VocabularyWord }> = ({
  word,
}) => {
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
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}
            >
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
          {word.exampleSentences.slice(0, 2).map((example, index) => (
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
 * Renders vocabulary flashcards with enhanced styling
 */
export const vocabularyFlashcardRenderer = (
  item: FlashcardItem,
  showAnswer: boolean
): React.ReactNode => {
  const getQuestionTypeStyles = () => {
    const category = item.category || "";

    if (category.includes("🇩🇪→🇺🇸")) {
      return {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-800",
        accent: "text-blue-600",
      };
    } else if (category.includes("🇺🇸→🇩🇪")) {
      return {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800",
        accent: "text-green-600",
      };
    } else if (category.includes("🗣️")) {
      return {
        bg: "bg-gradient-to-br from-purple-50 to-violet-50",
        border: "border-purple-200",
        text: "text-purple-800",
        accent: "text-purple-600",
      };
    } else if (category.includes("📖")) {
      return {
        bg: "bg-gradient-to-br from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-orange-800",
        accent: "text-orange-600",
      };
    } else if (category.includes("🔧")) {
      return {
        bg: "bg-gradient-to-br from-teal-50 to-cyan-50",
        border: "border-teal-200",
        text: "text-teal-800",
        accent: "text-teal-600",
      };
    }

    return {
      bg: "bg-gradient-to-br from-gray-50 to-slate-50",
      border: "border-gray-200",
      text: "text-gray-800",
      accent: "text-gray-600",
    };
  };

  const styles = getQuestionTypeStyles();
  const word = item.metadata?.originalWord as VocabularyWord;

  return (
    <div
      className={`${styles.bg} ${styles.border} border-2 rounded-xl p-6 sm:p-8 lg:p-10 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center`}
    >
      <div className="text-center">
        {/* Category badge */}
        {item.category && (
          <div className="mb-4 sm:mb-6">
            <span
              className={`inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}
            >
              {item.category}
            </span>
          </div>
        )}

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <h2
            className={`text-xl sm:text-2xl lg:text-3xl font-bold ${styles.text} mb-3 sm:mb-4 leading-tight whitespace-pre-line`}
          >
            {item.front}
          </h2>
          {item.helperText && !showAnswer && (
            <p className={`text-xs sm:text-sm ${styles.accent} italic`}>
              {item.helperText}
            </p>
          )}
        </div>

        {/* Answer */}
        {showAnswer && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h3
                className={`text-lg sm:text-xl lg:text-2xl font-semibold ${styles.accent} mb-3 sm:mb-4`}
              >
                {item.back}
              </h3>

              {/* Additional vocabulary info */}
              {word && <VocabularyAdditionalInfo word={word} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Renders grammar flashcards with enhanced styling
 */
export const grammarFlashcardRenderer = (
  item: FlashcardItem,
  showAnswer: boolean
): React.ReactNode => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 sm:p-8 lg:p-10 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
      <div className="text-center">
        {/* Category badge */}
        {item.category && (
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {item.category}
            </span>
          </div>
        )}

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-800 mb-3 sm:mb-4 leading-tight">
            {item.front}
          </h2>
          {item.helperText && !showAnswer && (
            <p className="text-xs sm:text-sm text-indigo-600 italic">
              {item.helperText}
            </p>
          )}
        </div>

        {/* Answer */}
        {showAnswer && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-600 mb-3 sm:mb-4">
                {item.back}
              </h3>

              {/* Additional grammar info if available */}
              {item.additionalInfo && (
                <div className="text-sm text-gray-700">
                  {item.additionalInfo}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
