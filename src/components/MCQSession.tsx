import React, { useEffect, useState } from "react";
import SessionLayout from "./layout/SessionLayout";
import type {
  QuizQuestion,
  QuizResults,
  QuizMistake,
} from "../types/Flashcard";

interface MCQSessionProps {
  questions: QuizQuestion[];
  title: string;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

const MCQSession: React.FC<MCQSessionProps> = ({
  questions,
  title,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);

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
        setUserAnswer("");
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

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={`p-3 sm:p-4 rounded-lg border transition-all text-left w-full ${
                showResult && option === currentQuestion.correctAnswer
                  ? "bg-green-100 border-green-500 text-green-700"
                  : showResult &&
                    option === userAnswer &&
                    option !== currentQuestion.correctAnswer
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 active:bg-gray-200"
              }`}
            >
              <span className="text-sm sm:text-base">{option}</span>
            </button>
          ))}
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className="mt-4 text-center">
            {userAnswer === currentQuestion.correctAnswer ? (
              <div className="text-green-600 font-medium">
                ✅ Correct! Well done!
              </div>
            ) : (
              <div className="text-red-600 font-medium">
                ❌ Incorrect. The correct answer is:{" "}
                <span className="font-bold">
                  {currentQuestion.correctAnswer}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SessionLayout>
  );
};

export default MCQSession;
