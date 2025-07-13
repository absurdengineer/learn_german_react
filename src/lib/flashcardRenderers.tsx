import React from "react";
import type { FlashcardItem } from "../types/Flashcard";
import type { VocabularyWord } from "../types/Vocabulary";
import { getGenderColor, getGenderDisplayName } from "./genderColors";
import PronunciationButton from "../components/PronunciationButton";

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
        accent: "text-blue-700 bg-blue-50",
        text: "text-blue-800",
        answerBg: "bg-blue-50",
      };
    } else if (category.includes("🇺🇸→🇩🇪")) {
      return {
        accent: "text-green-700 bg-green-50",
        text: "text-green-800",
        answerBg: "bg-green-50",
      };
    } else if (category.includes("🗣️")) {
      return {
        accent: "text-purple-700 bg-purple-50",
        text: "text-purple-800",
        answerBg: "bg-purple-50",
      };
    } else if (category.includes("📖")) {
      return {
        accent: "text-orange-700 bg-orange-50",
        text: "text-orange-800",
        answerBg: "bg-orange-50",
      };
    } else if (category.includes("🔧")) {
      return {
        accent: "text-teal-700 bg-teal-50",
        text: "text-teal-800",
        answerBg: "bg-teal-50",
      };
    }
    return {
      accent: "text-gray-700 bg-gray-100",
      text: "text-gray-800",
      answerBg: "bg-gray-100",
    };
  };

  const styles = getQuestionTypeStyles();
  const word = item.metadata?.originalWord as VocabularyWord;

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow p-4 sm:p-6 flex flex-col items-center">
      {/* Category badge */}
      {item.category && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-50 border border-gray-200 text-gray-600">
            {item.category}
          </span>
        </div>
      )}

      {/* Card content area with fixed min-height */}
      <div className="w-full text-center min-h-[160px] sm:min-h-[200px] flex flex-col justify-center">
        {/* Question */}
        <h2
          className={`text-lg sm:text-xl font-semibold ${styles.text} mb-3 leading-tight whitespace-pre-line`}
        >
          {item.prompt}
        </h2>
        {/* Divider */}
        <div className="w-full flex justify-center items-center my-2">
          <div className="h-1 w-8 rounded-full bg-gray-200" />
        </div>
        {/* Answer with fade-in animation */}
        <div
          className={`transition-opacity duration-300 ${
            showAnswer
              ? "opacity-100"
              : "opacity-0 pointer-events-none select-none"
          }`}
        >
          {showAnswer && (
            <div
              className={`inline-block w-full px-4 py-3 rounded-lg ${styles.answerBg} shadow-sm mb-2 animate-fade-in`}
            >
              <div
                className={`text-2xl sm:text-3xl font-bold ${styles.accent} break-words`}
              >
                {item.answer}
              </div>
              {/* Pronunciation (IPA + button) if available */}
              {word?.pronunciation && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-base text-gray-500 italic">
                    /{word.pronunciation}/
                  </span>
                  <PronunciationButton
                    text={word.german}
                    className="flex-shrink-0"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease; }
      `}</style>
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
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[250px] flex flex-col justify-center">
      <div className="text-center">
        {/* Category badge */}
        {item.category && (
          <div className="mb-3 sm:mb-4">
            <span className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {item.category}
            </span>
          </div>
        )}

        {/* Question */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-800 mb-2 sm:mb-3 leading-tight">
            {item.prompt}
          </h2>
          {item.helperText && !showAnswer && (
            <p className="text-xs sm:text-sm text-indigo-600 italic">
              {item.helperText}
            </p>
          )}
        </div>

        {/* Answer */}
        {showAnswer && (
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-green-600 mb-2">
              {item.answer}
            </h3>

            {/* Additional grammar info if available */}
            {item.additionalInfo && (
              <div className="text-sm text-gray-700">{item.additionalInfo}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
