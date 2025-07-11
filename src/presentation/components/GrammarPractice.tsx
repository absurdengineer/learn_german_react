import React, { useEffect, useState } from 'react';
import { GrammarPracticeQuestion } from '../../domain/entities/GrammarPractice';
import { NavigationHeader } from './ui';

interface GrammarMistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface GrammarSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: GrammarMistake[];
}

interface GrammarPracticeProps {
  questions: GrammarPracticeQuestion[];
  onComplete: (results: GrammarSessionResult) => void;
  onExit: () => void;
}

const GrammarPractice: React.FC<GrammarPracticeProps> = ({ questions, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState<GrammarMistake[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          question: currentQuestion.prompt,
          userAnswer,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ]);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        const endTime = Date.now();
        onComplete({
          totalQuestions: questions.length,
          correctAnswers: score + (isCorrect ? 1 : 0),
          wrongAnswers: questions.length - (score + (isCorrect ? 1 : 0)),
          timeSpent: endTime - sessionStartTime,
          mistakes,
        });
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No practice questions available.</p>
          <button onClick={onExit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <NavigationHeader
          title="Grammar Practice"
          subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
          onBack={onExit}
          backLabel="Exit"
          score={{ current: score, total: questions.length }}
        />
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">{currentQuestion.category}</p>
            <p className="text-lg sm:text-xl text-gray-800">{currentQuestion.prompt}</p>
            {currentQuestion.helperText && <p className="text-sm text-gray-500 mt-2 italic">{currentQuestion.helperText}</p>}
          </div>

          <div className="flex flex-col items-center space-y-4 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => setUserAnswer(option)}
                className={`w-full max-w-md px-6 py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                  userAnswer === option ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg ${userAnswer === currentQuestion.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className={`text-lg font-bold ${userAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                {userAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Wrong!'}
              </div>
              {userAnswer !== currentQuestion.correctAnswer && (
                <div className="text-sm text-gray-700 mt-2">
                  The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                </div>
              )}
            </div>
          )}

          {!showResult && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                  userAnswer ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarPractice;