import React from 'react';

interface Mistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  data?: any;
}

interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: Mistake[];
}

interface SessionResultsProps {
  results: SessionResult;
  sessionType: string;
  onRestart: () => void;
  onReviewMistakes: () => void;
  onExit: () => void;
}

const SessionResults: React.FC<SessionResultsProps> = ({
  results,
  sessionType,
  onRestart,
  onReviewMistakes,
  onExit,
}) => {
  const {
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    timeSpent,
    mistakes,
  } = results;

  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const timePerQuestion = totalQuestions > 0 ? (timeSpent / 1000 / totalQuestions).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">Session Complete!</h1>
            <p className="mt-2 text-lg text-gray-600">
              You've completed a <span className="font-semibold text-indigo-600">{sessionType}</span> session.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-sm font-medium text-green-600">Accuracy</p>
              <p className="mt-2 text-4xl font-bold text-green-800">{accuracy.toFixed(0)}%</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm font-medium text-blue-600">Correct</p>
              <p className="mt-2 text-4xl font-bold text-blue-800">{correctAnswers}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-sm font-medium text-red-600">Mistakes</p>
              <p className="mt-2 text-4xl font-bold text-red-800">{wrongAnswers}</p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>Total questions: {totalQuestions}</p>
            <p>Time spent: {(timeSpent / 1000).toFixed(1)} seconds</p>
            <p>Average time per question: {timePerQuestion} seconds</p>
          </div>

          {mistakes.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Review Your Mistakes</h2>
              <div className="mt-6 bg-gray-50 rounded-xl p-6 max-h-80 overflow-y-auto">
                <ul className="space-y-4">
                  {mistakes.map((mistake, index) => (
                    <li key={index} className="p-4 bg-white rounded-lg shadow-md">
                      {mistake.data?.german && <p className="font-semibold text-lg text-gray-800">{mistake.data.german}</p>}
                      {mistake.data?.english && <p className="text-sm text-gray-600">({mistake.data.english})</p>}
                      {!mistake.data && <p className="font-semibold text-lg text-gray-800">{mistake.question}</p>}
                      <div className="mt-2 text-sm">
                        <p>Your answer: <span className="font-semibold text-red-600">{mistake.userAnswer}</span></p>
                        <p>Correct answer: <span className="font-semibold text-green-600">{mistake.correctAnswer}</span></p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={onRestart}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 font-semibold"
            >
              Restart Session
            </button>
            {mistakes.length > 0 && (
              <button
                onClick={onReviewMistakes}
                className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105 font-semibold"
              >
                Review Mistakes
              </button>
            )}
            <button
              onClick={onExit}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105 font-semibold"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;