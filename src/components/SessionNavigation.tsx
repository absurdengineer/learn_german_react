import React from 'react';

interface SessionNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onExit: () => void;
  nextLabel?: string;
  previousLabel?: string;
  exitLabel?: string;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  showNext?: boolean;
  showPrevious?: boolean;
  className?: string;
}

const SessionNavigation: React.FC<SessionNavigationProps> = ({
  onNext,
  onPrevious,
  onExit,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  exitLabel = 'Exit',
  nextDisabled = false,
  previousDisabled = false,
  showNext = true,
  showPrevious = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between space-x-4 ${className}`}>
      {/* Previous button */}
      {showPrevious && onPrevious ? (
        <button
          onClick={onPrevious}
          disabled={previousDisabled}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ← {previousLabel}
        </button>
      ) : (
        <div></div> // Spacer for layout
      )}

      {/* Exit button */}
      <button
        onClick={onExit}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        {exitLabel}
      </button>

      {/* Next button */}
      {showNext && onNext ? (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {nextLabel} →
        </button>
      ) : (
        <div></div> // Spacer for layout
      )}
    </div>
  );
};

export default SessionNavigation;
