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

interface GrammarQuizProps {
  questions: GrammarPracticeQuestion[];
  onComplete: (results: GrammarSessionResult) => void;
  onExit: () => void;
}

const GrammarQuiz: React.FC<GrammarQuizProps> = ({ questions, onComplete, onExit }) => {
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

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          question: currentQuestion.prompt,
          userAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
        },
      ]);
    }

    setUserAnswer(answer);
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
          <p className="text-lg text-gray-600">No quiz questions available.</p>
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
          title="Grammar Quiz"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg border transition-all ${
                  showResult && option === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : showResult && option === userAnswer && option !== currentQuestion.correctAnswer
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarQuiz;