import React from 'react';

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  currentStep?: number;
  totalSteps?: number;
  score?: {
    current: number;
    total: number;
  };
  timeLeft?: number;
  showProgress?: boolean;
  className?: string;
  rightContent?: React.ReactNode;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  currentStep,
  totalSteps,
  score,
  timeLeft,
  showProgress = true,
  className = '',
  rightContent
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Left: Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 sm:p-1 -ml-2 sm:ml-0 rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm sm:text-base">{backLabel}</span>
            </button>
          )}

          {/* Center: Title and subtitle */}
          <div className="text-center flex-1 px-2 sm:px-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">
              {title}
            </div>
            {subtitle && (
              <div className="text-sm sm:text-lg font-bold text-gray-800">
                {subtitle}
              </div>
            )}
            {currentStep && totalSteps && showProgress && (
              <div className="text-sm sm:text-lg font-bold text-gray-800">
                Step {currentStep} of {totalSteps}
              </div>
            )}
          </div>

          {/* Right: Score, timer, or custom content */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {score && (
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600">Score</div>
                <div className="text-sm sm:text-lg font-bold text-green-600">
                  {score.current}/{score.total}
                </div>
              </div>
            )}
            {timeLeft !== undefined && (
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600">Timer</div>
                <div className={`text-sm sm:text-lg font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                  {timeLeft}s
                </div>
              </div>
            )}
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
