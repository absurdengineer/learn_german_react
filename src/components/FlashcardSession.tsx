import React, { useCallback, useEffect, useState } from "react";
import SessionLayout from "./layout/SessionLayout";
import type { FlashcardItem, FlashcardSessionResult } from "../types/Flashcard";

// Props interface
interface FlashcardSessionProps {
  items: FlashcardItem[];
  title: string;
  onComplete: (results: FlashcardSessionResult) => void;
  onExit: () => void;
  showProgress?: boolean;
  autoAdvanceDelay?: number;
  enableScoring?: boolean;
  customRenderer?: (
    item: FlashcardItem,
    showAnswer: boolean
  ) => React.ReactNode;
}

const FlashcardSession: React.FC<FlashcardSessionProps> = ({
  items,
  title,
  onComplete,
  onExit,
  showProgress = true,
  autoAdvanceDelay = 0,
  enableScoring = false,
  customRenderer,
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime] = useState(Date.now());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [mistakes, setMistakes] = useState<
    Array<{ item: FlashcardItem; userAction?: string }>
  >([]);
  const [completedItems, setCompletedItems] = useState<FlashcardItem[]>([]);

  // Auto-scroll to top when item changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentItemIndex]);

  const handleNext = useCallback(
    (wasCorrect?: boolean) => {
      const currentItem = items[currentItemIndex];

      // Track completion
      setCompletedItems((prev) => [...prev, currentItem]);

      // Track scoring if enabled
      if (enableScoring && wasCorrect !== undefined) {
        if (wasCorrect) {
          setCorrectAnswers((prev) => prev + 1);
        } else {
          setWrongAnswers((prev) => prev + 1);
          setMistakes((prev) => [
            ...prev,
            { item: currentItem, userAction: "incorrect" },
          ]);
        }
      }

      if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        setShowAnswer(false);
      } else {
        // Session complete
        const endTime = Date.now();
        const results: FlashcardSessionResult = {
          totalQuestions: items.length,
          correctAnswers: enableScoring
            ? correctAnswers + (wasCorrect ? 1 : 0)
            : items.length,
          wrongAnswers: enableScoring ? wrongAnswers + (wasCorrect ? 0 : 1) : 0,
          timeSpent: endTime - startTime,
          mistakes,
          completedItems: [...completedItems, currentItem],
        };
        onComplete(results);
      }
    },
    [
      currentItemIndex,
      items,
      enableScoring,
      correctAnswers,
      wrongAnswers,
      mistakes,
      completedItems,
      startTime,
      onComplete,
    ]
  );

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvanceDelay > 0 && showAnswer) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [showAnswer, autoAdvanceDelay, handleNext]);

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentItem = items[currentItemIndex];

  // Handle empty items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Flashcards Available
          </h3>
          <p className="text-gray-500 mb-6">
            There are no flashcards to study in this session.
          </p>
          <button
            onClick={onExit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = showProgress
    ? ((currentItemIndex + 1) / items.length) * 100
    : 0;

  return (
    <SessionLayout title={title} onExit={onExit}>
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>
              Progress: {currentItemIndex + 1} of {items.length}
            </span>
            {enableScoring && (
              <span>
                Score: {correctAnswers}/{correctAnswers + wrongAnswers}
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Render flashcard directly, no extra card */}
      <div className="flex flex-col items-center">
        {customRenderer ? (
          customRenderer(currentItem, showAnswer)
        ) : (
          <>
            {currentItem.category && (
              <div className="mb-3 sm:mb-4">
                <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                  {currentItem.category}
                </span>
              </div>
            )}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">
                {currentItem.front}
              </h2>
              {currentItem.helperText && !showAnswer && (
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  {currentItem.helperText}
                </p>
              )}
            </div>
            {showAnswer && (
              <div className="text-lg sm:text-xl font-semibold text-green-600 mb-2">
                {currentItem.back}
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls below the card */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Show Answer
          </button>
        ) : enableScoring ? (
          <>
            <button
              onClick={() => handleNext(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
            >
              ❌ Incorrect
            </button>
            <button
              onClick={() => handleNext(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base"
            >
              ✅ Correct
            </button>
          </>
        ) : (
          <button
            onClick={() => handleNext()}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
          >
            {currentItemIndex < items.length - 1
              ? "Next Card"
              : "Finish Session"}
          </button>
        )}
      </div>

      {/* Navigation below controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentItemIndex === 0}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Previous</span>
        </button>
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Card {currentItemIndex + 1} of {items.length}
          </div>
        </div>
      </div>
    </SessionLayout>
  );
};

export default FlashcardSession;
