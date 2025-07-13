import React from "react";
import Button from "./Button";

interface FlashcardSessionResult {
  totalQuestions: number;
  timeSpent: number;
}

interface FlashcardSessionResultsProps {
  results: FlashcardSessionResult;
  onRestart: () => void;
  onExit: () => void;
}

const FlashcardSessionResults: React.FC<FlashcardSessionResultsProps> = ({
  results,
  onRestart,
  onExit,
}) => {
  const { totalQuestions, timeSpent } = results;

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.round(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const timePerCard =
    totalQuestions > 0 ? (timeSpent / 1000 / totalQuestions).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Session Complete!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              You've completed a flashcard session.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm font-medium text-blue-600">Cards Studied</p>
              <p className="mt-2 text-4xl font-bold text-blue-800">
                {totalQuestions}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-sm font-medium text-green-600">Time Taken</p>
              <p className="mt-2 text-4xl font-bold text-green-800">
                {formatTime(timeSpent)}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-sm font-medium text-yellow-600">
                Avg. Time / Card
              </p>
              <p className="mt-2 text-4xl font-bold text-yellow-800">
                {timePerCard}s
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={onRestart} variant="primary" size="lg" fullWidth>
              Restart Session 🔄
            </Button>
            <Button onClick={onExit} variant="danger" size="lg" fullWidth>
              Exit ❌
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSessionResults;
