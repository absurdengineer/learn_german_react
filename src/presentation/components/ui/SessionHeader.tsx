import React from 'react';

interface SessionHeaderProps {
  title: string;
  subtitle?: string;
  currentQuestion?: number;
  totalQuestions?: number;
  score?: {
    current: number;
    total: number;
  };
  timeLeft?: number;
  onExit: () => void;
  className?: string;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  title,
  subtitle,
  currentQuestion,
  totalQuestions,
  score,
  timeLeft,
  onExit,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between mb-6 gap-4 ${className}`}>
      <button
        onClick={onExit}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="text-gray-700">Exit</span>
      </button>

      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-1">
          {title}
        </div>
        {subtitle && (
          <div className="text-lg font-bold text-gray-800">
            {subtitle}
          </div>
        )}
        {currentQuestion && totalQuestions && (
          <div className="text-lg font-bold text-gray-800">
            Question {currentQuestion} of {totalQuestions}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {score && (
          <div className="text-center">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-lg font-bold text-green-600">
              {score.current}/{score.total}
            </div>
          </div>
        )}
        {timeLeft !== undefined && (
          <div className="text-center">
            <div className="text-sm text-gray-600">Timer</div>
            <div className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
              {timeLeft}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHeader;
