import React from 'react';
import { VocabularyWord } from '../../domain/entities/Vocabulary';

interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: VocabularyWord[];
  mistakes: Array<{
    word: VocabularyWord;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

interface SessionResultsProps {
  results: SessionResult;
  sessionType: 'flashcards' | 'translation' | 'multiple-choice';
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
  const accuracy = results.totalQuestions > 0 ? (results.correctAnswers / results.totalQuestions) * 100 : 0;
  const timePerQuestion = results.totalQuestions > 0 ? results.timeSpent / results.totalQuestions : 0;

  const getPerformanceMessage = () => {
    if (sessionType === 'flashcards') {
      return { text: "Learning session complete! 📚", color: "text-blue-600" };
    }
    if (accuracy >= 90) return { text: "Excellent work! 🎉", color: "text-green-600" };
    if (accuracy >= 70) return { text: "Good job! 👍", color: "text-blue-600" };
    if (accuracy >= 50) return { text: "Keep practicing! 📚", color: "text-yellow-600" };
    return { text: "Need more practice 💪", color: "text-orange-600" };
  };

  const performanceMessage = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Session Complete!</h1>
          <p className={`text-2xl font-semibold ${performanceMessage.color}`}>
            {performanceMessage.text}
          </p>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {sessionType === 'flashcards' ? 'Learning Summary' : 'Your Performance'}
          </h2>
          
          {sessionType === 'flashcards' ? (
            // Learning mode - show study stats without scoring
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{results.wordsStudied.length}</div>
                <div className="text-sm text-gray-600">Words Studied</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.round(timePerQuestion)}s</div>
                <div className="text-sm text-gray-600">Avg per Word</div>
              </div>
            </div>
          ) : (
            // Quiz mode - show performance stats
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{results.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{results.wrongAnswers}</div>
                <div className="text-sm text-gray-600">Wrong</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Math.round(accuracy)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.round(timePerQuestion)}s</div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>
          )}

          {/* Progress Bar - Only for quiz mode */}
          {sessionType !== 'flashcards' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-sm text-gray-600">{Math.round(accuracy)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    accuracy >= 80 ? 'bg-green-500' : accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          )}

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Questions:</span> {results.totalQuestions}
            </div>
            <div>
              <span className="font-medium">Time Spent:</span> {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
            </div>
            <div>
              <span className="font-medium">Words Studied:</span> {results.wordsStudied.length}
            </div>
            {sessionType !== 'flashcards' && (
              <div>
                <span className="font-medium">Mistakes:</span> {results.mistakes.length}
              </div>
            )}
          </div>
        </div>

        {/* Mistakes Review - Only for quiz mode */}
        {sessionType !== 'flashcards' && results.mistakes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Mistakes</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {results.mistakes.map((mistake, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{mistake.word.german}</p>
                      <p className="text-sm text-gray-600">
                        You answered: <span className="text-red-600 font-medium">{mistake.userAnswer}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Correct answer: <span className="text-green-600 font-medium">{mistake.correctAnswer}</span>
                      </p>
                    </div>
                    <div className="text-2xl">{mistake.word.german}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Practice Again</span>
          </button>
          
          {results.mistakes.length > 0 && sessionType !== 'flashcards' && (
            <button
              onClick={onReviewMistakes}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Review Mistakes</span>
            </button>
          )}
          
          <button
            onClick={onExit}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exit</span>
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {sessionType === 'flashcards' 
                ? "Great job studying! Every word you learn brings you closer to fluency!" 
                : "Every mistake is a learning opportunity!"
              }
            </p>
            <p className="text-sm text-gray-600">
              Keep practicing to improve your German skills! 🇩🇪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;
