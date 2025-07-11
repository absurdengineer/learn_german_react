import React from 'react';

interface FlashcardProps {
  front: string;
  back: string;
  showAnswer: boolean;
  onFlip: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentIndex?: number;
  totalCards?: number;
  className?: string;
  frontLabel?: string;
  backLabel?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  showAnswer,
  onFlip,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  className = '',
  frontLabel = 'Question',
  backLabel = 'Answer',
  frontContent,
  backContent
}) => {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress indicator */}
      {currentIndex !== undefined && totalCards !== undefined && (
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600">
            Card {currentIndex + 1} of {totalCards}
          </div>
        </div>
      )}

      {/* Flashcard */}
      <div className="bg-white rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 mb-4">
            {showAnswer ? backLabel : frontLabel}
          </div>
          
          {!showAnswer ? (
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {front}
              </div>
              {frontContent}
            </div>
          ) : (
            <div>
              <div className="text-2xl font-semibold text-blue-600 mb-6">
                {back}
              </div>
              {backContent}
            </div>
          )}

          {/* Flip button */}
          <button
            onClick={onFlip}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showAnswer ? `Show ${frontLabel}` : `Show ${backLabel}`}
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      {(onPrevious || onNext) && (
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            disabled={!onPrevious}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            disabled={!onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
