import React from "react";
import type { QuizQuestion, QuizResults } from "../types/Flashcard";
import SessionLayout from "./layout/SessionLayout";
import { useQuizSession } from "../hooks/useQuizSession";
import MCQOptions from "./MCQOptions";

interface QuizSessionProps {
  questions: QuizQuestion[];
  title: string;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({
  questions,
  title,
  onComplete,
  onExit,
}) => {
  const {
    currentQuestionIndex,
    score,
    userAnswer,
    textInput,
    setTextInput,
    showResult,
    textInputRef,
    currentQuestion,
    handleAnswer,
    handleTextSubmit,
    handleKeyPress,
  } = useQuizSession({ questions, onComplete });

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No questions available.</p>
          <button
            onClick={onExit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <SessionLayout title={title} onExit={onExit}>
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Score and Question Counter */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center text-sm sm:text-base text-gray-600">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            Score: {score}/{currentQuestionIndex + 1}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 bg-white">
        <div className="text-center mb-6 sm:mb-8">
          {currentQuestion.category && (
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              {currentQuestion.category}
            </p>
          )}
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed px-2">
            {currentQuestion.prompt}
          </p>
          {currentQuestion.helperText && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 italic">
              {currentQuestion.helperText}
            </p>
          )}
        </div>

        {/* Options or Text Input */}
        {currentQuestion.options.length > 0 ? (
          <MCQOptions
            options={currentQuestion.options}
            answer={currentQuestion.answer}
            userAnswer={userAnswer}
            showResult={showResult}
            onSelect={handleAnswer}
            disabled={showResult}
          />
        ) : (
          <div className="max-w-lg mx-auto">
            <input
              ref={textInputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={showResult}
              placeholder="Type your answer..."
              className={`w-full p-3 sm:p-4 text-base sm:text-lg border rounded-lg focus:outline-none focus:ring-2
                ${
                  showResult
                    ? userAnswer && userAnswer === currentQuestion.answer
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }
              `}
            />
            <button
              onClick={handleTextSubmit}
              disabled={showResult || !textInput.trim()}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </SessionLayout>
  );
};

export default QuizSession;
