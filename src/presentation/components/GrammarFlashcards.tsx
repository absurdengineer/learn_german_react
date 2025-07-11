
import React, { useEffect, useState } from 'react';
import { GrammarPracticeQuestion } from '../../domain/entities/GrammarPractice';
import { NavigationHeader } from './ui';

interface GrammarSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: any[];
}

interface GrammarFlashcardsProps {
  questions: GrammarPracticeQuestion[];
  onComplete: (results: GrammarSessionResult) => void;
  onExit: () => void;
}

const GrammarFlashcards: React.FC<GrammarFlashcardsProps> = ({ questions, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      const endTime = Date.now();
      onComplete({
        totalQuestions: questions.length,
        correctAnswers: questions.length,
        wrongAnswers: 0,
        timeSpent: endTime - startTime,
        mistakes: [],
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No flashcards available.</p>
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
          title="Grammar Flashcards"
          subtitle={`Card ${currentQuestionIndex + 1} of ${questions.length}`}
          onBack={onExit}
          backLabel="Exit"
        />
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">{currentQuestion.category}</p>
            <p className="text-lg sm:text-xl text-gray-800">{currentQuestion.prompt}</p>
            {currentQuestion.helperText && !showAnswer && <p className="text-sm text-gray-500 mt-2 italic">{currentQuestion.helperText}</p>}
          </div>

          <div className="text-center">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show Answer
              </button>
            ) : (
              <div>
                <p className="text-lg sm:text-xl font-semibold text-green-600 mb-4">{currentQuestion.correctAnswer}</p>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarFlashcards;
