import React from 'react';

interface ResultSummaryProps {
  score: number;
  total: number;
  timeSpent?: number;
  accuracy?: number;
  mistakes?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
  onRestart?: () => void;
  onReviewMistakes?: () => void;
  onExit: () => void;
  onContinue?: () => void;
  title?: string;
  className?: string;
  showMistakes?: boolean;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
  score,
  total,
  timeSpent,
  accuracy,
  mistakes = [],
  onRestart,
  onReviewMistakes,
  onExit,
  onContinue,
  title = 'Session Complete!',
  className = '',
  showMistakes = true
}) => {
  const percentage = Math.round((score / total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: 'Excellent work! 🎉', color: 'text-green-600' };
    if (percentage >= 80) return { message: 'Great job! 👏', color: 'text-blue-600' };
    if (percentage >= 70) return { message: 'Good effort! 👍', color: 'text-yellow-600' };
    if (percentage >= 60) return { message: 'Keep practicing! 💪', color: 'text-orange-600' };
    return { message: 'More practice needed! 📚', color: 'text-red-600' };
  };

  const performance = getPerformanceMessage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <div className={`text-xl font-semibold ${performance.color}`}>
            {performance.message}
          </div>
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${percentage * 2.51} 251`}
                className={percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500'}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-sm text-gray-600">{score}/{total}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{total - score}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          {timeSpent && (
            <div className="text-center p-4 bg-gray-50 rounded-lg col-span-2">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          )}
          {accuracy && (
            <div className="text-center p-4 bg-gray-50 rounded-lg col-span-2">
              <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {onContinue && (
            <button
              onClick={onContinue}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Continue Learning
            </button>
          )}
          
          {showMistakes && mistakes.length > 0 && onReviewMistakes && (
            <button
              onClick={onReviewMistakes}
              className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              Review Mistakes ({mistakes.length})
            </button>
          )}
          
          {onRestart && (
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={onExit}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
