
import React, { useEffect, useRef, useState } from 'react';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import { NavigationHeader } from './ui';

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: QuizMistake[];
}

export interface QuizMistake {
  id: string;
  prompt: string;
  correctAnswer: string;
  userAnswer: string;
  category?: string;
  word?: VocabularyWord;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  category?: string;
  helperText?: string;
  word?: VocabularyWord; // Optional: for vocabulary quizzes
}

interface QuizSessionProps {
  questions: QuizQuestion[];
  title: string;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({ questions, title, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  // Focus the text input when question changes or component mounts (for translation questions)
  useEffect(() => {
    if (!showResult && questions[currentQuestionIndex]?.options.length === 0) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [currentQuestionIndex, showResult, questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();
    
    // Check if the correct answer contains alternative answers separated by "/"
    if (normalizedCorrectAnswer.includes('/')) {
      const alternatives = normalizedCorrectAnswer.split('/').map(alt => alt.trim());
      return alternatives.some(alt => alt === normalizedUserAnswer);
    }
    
    // Regular exact match
    return normalizedUserAnswer === normalizedCorrectAnswer;
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = isAnswerCorrect(answer, currentQuestion.correctAnswer);
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          id: currentQuestion.id,
          prompt: currentQuestion.prompt,
          correctAnswer: currentQuestion.correctAnswer,
          userAnswer: answer,
          category: currentQuestion.category,
          word: currentQuestion.word,
        },
      ]);
    }

    setUserAnswer(answer);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setTextInput('');
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

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textInput.trim()) {
      handleTextSubmit();
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No questions available.</p>
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
          title={title}
          subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
          onBack={onExit}
          backLabel="Exit"
          score={{ current: score, total: questions.length }}
        />
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
          <div className="text-center mb-8">
            {currentQuestion.category && <p className="text-sm text-gray-500 mb-2">{currentQuestion.category}</p>}
            <p className="text-lg sm:text-xl text-gray-800">{currentQuestion.prompt}</p>
            {currentQuestion.helperText && <p className="text-sm text-gray-500 mt-2 italic">{currentQuestion.helperText}</p>}
          </div>

          <div className="space-y-4">
            {currentQuestion.options.length > 0 ? (
              // Multiple choice questions
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
            ) : (
              // Translation questions with text input
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={showResult}
                    placeholder="Type your answer..."
                    className={`w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 ${
                      showResult
                        ? isAnswerCorrect(textInput, currentQuestion.correctAnswer)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  
                  {!showResult && (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                  
                  {showResult && (
                    <div className="text-center space-y-2">
                      <p className={`font-medium ${
                        isAnswerCorrect(textInput, currentQuestion.correctAnswer)
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {isAnswerCorrect(textInput, currentQuestion.correctAnswer)
                          ? '✓ Correct!'
                          : '✗ Incorrect'}
                      </p>
                      {!isAnswerCorrect(textInput, currentQuestion.correctAnswer) && (
                        <p className="text-gray-600">
                          Correct answer: <span className="font-medium text-green-600">{currentQuestion.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSession;
