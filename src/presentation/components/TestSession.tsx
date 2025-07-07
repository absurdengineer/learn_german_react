import React, { useEffect, useState } from 'react';
import { getRandomVocabularyWords } from '../../data';
import { VocabularyWord } from '../../domain/entities/Vocabulary';

interface TestQuestion {
  id: number;
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

interface TestSessionProps {
  testType: 'vocabulary' | 'grammar' | 'mixed';
  questionCount: number;
  onComplete: (results: TestResults) => void;
  onExit: () => void;
}

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  accuracy: number;
  questions: TestQuestion[];
}

const TestSession: React.FC<TestSessionProps> = ({
  testType,
  questionCount,
  onComplete,
  onExit,
}) => {
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [startTime] = useState(Date.now());

  useEffect(() => {
    generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testType, questionCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          completeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateQuestions = () => {
    const vocabularyWords = getRandomVocabularyWords(questionCount);
    const generatedQuestions: TestQuestion[] = vocabularyWords.map((word: VocabularyWord, index: number) => {
      const otherOptions = getRandomVocabularyWords(3).filter((w: VocabularyWord) => w.english !== word.english);
      const options = [word.english, ...otherOptions.map((w: VocabularyWord) => w.english)];
      
      return {
        id: index + 1,
        word,
        options: options.sort(() => Math.random() - 0.5),
        correctAnswer: word.english,
      };
    });
    
    setQuestions(generatedQuestions);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const updatedQuestions = [...questions];
    const current = updatedQuestions[currentQuestion];
    current.userAnswer = selectedAnswer;
    current.isCorrect = selectedAnswer === current.correctAnswer;
    
    setQuestions(updatedQuestions);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowFeedback(false);
      } else {
        completeTest();
      }
    }, 2000);
  };

  const completeTest = () => {
    const correctCount = questions.filter(q => q.isCorrect).length;
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    
    const results: TestResults = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeSpent: totalTime,
      accuracy: (correctCount / questions.length) * 100,
      questions,
    };
    
    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your test...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700">Exit Test</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`text-lg font-bold ${
              timeRemaining < 60 ? 'text-red-600' : 'text-gray-700'
            }`}>
              ⏰ {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Translate this word:</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {currentQ.word.german}
            </h1>
            {currentQ.word.isNoun() && currentQ.word.hasGender() && (
              <p className="text-lg text-gray-600">
                {currentQ.word.getFullNoun()}
              </p>
            )}
            {currentQ.word.pronunciation && (
              <p className="text-sm text-gray-500 italic mt-2">
                /{currentQ.word.pronunciation}/
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  showFeedback
                    ? option === currentQ.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : option === selectedAnswer && option !== currentQ.correctAnswer
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                    : selectedAnswer === option
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!showFeedback && (
            <div className="text-center">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className={`text-center p-4 rounded-lg ${
              currentQ.isCorrect 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {currentQ.isCorrect ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-lg">Correct! ✨</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-lg">Incorrect</span>
                  </div>
                  <p>
                    The correct answer is: <strong>{currentQ.correctAnswer}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {questions.filter(q => q.isCorrect).length}
              </div>
              <div>Correct</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {questions.filter(q => q.isCorrect === false).length}
              </div>
              <div>Wrong</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
              <div>Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSession;
