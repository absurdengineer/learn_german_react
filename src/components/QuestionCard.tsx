import React from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption?: string;
  correctAnswer?: string;
  showResult?: boolean;
  onOptionSelect: (option: string) => void;
  disabled?: boolean;
  className?: string;
  questionNumber?: number;
  category?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  selectedOption,
  correctAnswer,
  showResult = false,
  onOptionSelect,
  disabled = false,
  className = '',
  questionNumber,
  category
}) => {
  const getOptionStyles = (option: string) => {
    if (!showResult) {
      return selectedOption === option
        ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg'
        : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-700';
    }

    if (option === correctAnswer) {
      return 'bg-green-500 text-white border-2 border-green-600 shadow-lg';
    }
    
    if (option === selectedOption && option !== correctAnswer) {
      return 'bg-red-500 text-white border-2 border-red-600 shadow-lg';
    }
    
    return 'bg-gray-100 text-gray-500 border-2 border-gray-200';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 ${className}`}>
      {/* Question header */}
      <div className="text-center mb-8">
        {questionNumber && (
          <div className="text-sm text-gray-600 mb-2">
            Question {questionNumber}
          </div>
        )}
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {question}
        </p>
        {category && (
          <div className="text-sm text-gray-500 capitalize">
            Category: {category}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !disabled && onOptionSelect(option)}
            disabled={disabled}
            className={`w-full p-4 text-center rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none ${getOptionStyles(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="mt-6 text-center">
          {selectedOption === correctAnswer ? (
            <div className="text-green-600 font-semibold text-lg">
              ✅ Correct!
            </div>
          ) : (
            <div className="text-red-600 font-semibold text-lg">
              ❌ Incorrect. The correct answer is: {correctAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
