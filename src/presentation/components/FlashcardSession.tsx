import React, { useCallback, useEffect, useState } from 'react';
import { NavigationHeader } from './ui';

// Generic flashcard item interface
export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category?: string;
  helperText?: string;
  additionalInfo?: React.ReactNode;
  metadata?: Record<string, unknown>;
}

// Session result interface
export interface FlashcardSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: Array<{
    item: FlashcardItem;
    userAction?: string;
  }>;
  completedItems: FlashcardItem[];
}

// Props interface
interface FlashcardSessionProps {
  items: FlashcardItem[];
  title: string;
  onComplete: (results: FlashcardSessionResult) => void;
  onExit: () => void;
  showProgress?: boolean;
  autoAdvanceDelay?: number;
  enableScoring?: boolean;
  customRenderer?: (item: FlashcardItem, showAnswer: boolean) => React.ReactNode;
}

const FlashcardSession: React.FC<FlashcardSessionProps> = ({
  items,
  title,
  onComplete,
  onExit,
  showProgress = true,
  autoAdvanceDelay = 0,
  enableScoring = false,
  customRenderer
}) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime] = useState(Date.now());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [mistakes, setMistakes] = useState<Array<{ item: FlashcardItem; userAction?: string }>>([]);
  const [completedItems, setCompletedItems] = useState<FlashcardItem[]>([]);

  // Auto-scroll to top when item changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentItemIndex]);

  const handleNext = useCallback((wasCorrect?: boolean) => {
    const currentItem = items[currentItemIndex];
    
    // Track completion
    setCompletedItems(prev => [...prev, currentItem]);
    
    // Track scoring if enabled
    if (enableScoring && wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectAnswers(prev => prev + 1);
      } else {
        setWrongAnswers(prev => prev + 1);
        setMistakes(prev => [...prev, { item: currentItem, userAction: 'incorrect' }]);
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
        correctAnswers: enableScoring ? correctAnswers + (wasCorrect ? 1 : 0) : items.length,
        wrongAnswers: enableScoring ? wrongAnswers + (wasCorrect ? 0 : 1) : 0,
        timeSpent: endTime - startTime,
        mistakes,
        completedItems: [...completedItems, currentItem]
      };
      onComplete(results);
    }
  }, [currentItemIndex, items, enableScoring, correctAnswers, wrongAnswers, mistakes, completedItems, startTime, onComplete]);

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvanceDelay > 0 && showAnswer) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [showAnswer, autoAdvanceDelay, handleNext]);

  const currentItem = items[currentItemIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleMarkCorrect = () => {
    handleNext(true);
  };

  const handleMarkIncorrect = () => {
    handleNext(false);
  };

  // Handle empty items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Flashcards Available</h3>
          <p className="text-gray-500 mb-6">There are no flashcards to study in this session.</p>
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

  const progress = showProgress ? ((currentItemIndex + 1) / items.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <NavigationHeader
        title={title}
        subtitle={`Card ${currentItemIndex + 1} of ${items.length}`}
        onBack={onExit}
        backLabel="Exit"
        showProgress={false}
      />

      {/* Progress Bar */}
      {showProgress && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {currentItemIndex + 1} of {items.length}</span>
              {enableScoring && (
                <span>Score: {correctAnswers}/{correctAnswers + wrongAnswers}</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flashcard */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="text-center">
            {/* Custom or default content rendering */}
            {customRenderer ? (
              customRenderer(currentItem, showAnswer)
            ) : (
              <>
                {/* Category */}
                {currentItem.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {currentItem.category}
                    </span>
                  </div>
                )}

                {/* Front of card */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                    {currentItem.front}
                  </h2>
                  {currentItem.helperText && !showAnswer && (
                    <p className="text-sm text-gray-500 italic">
                      {currentItem.helperText}
                    </p>
                  )}
                </div>

                {/* Answer content when shown */}
                {showAnswer && (
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-semibold text-green-600 mb-4">
                      {currentItem.back}
                    </h3>
                    {currentItem.additionalInfo && (
                      <div className="text-gray-700">
                        {currentItem.additionalInfo}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Button section - always handled by FlashcardSession */}
            {!showAnswer ? (
              <button
                onClick={handleShowAnswer}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Show Answer
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                {enableScoring ? (
                  <>
                    <button
                      onClick={handleMarkIncorrect}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      ❌ Incorrect
                    </button>
                    <button
                      onClick={handleMarkCorrect}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      ✅ Correct
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNext()}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    {currentItemIndex < items.length - 1 ? 'Next Card' : 'Finish Session'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500">
              Card {currentItemIndex + 1} of {items.length}
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Exit Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSession;
