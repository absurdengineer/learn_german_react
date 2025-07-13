import React, { useEffect, useState } from "react";
import SessionLayout from "./layout/SessionLayout";
import type {
  QuizQuestion,
  QuizResults,
  QuizMistake,
} from "../types/Flashcard";
import MCQOptions from "./MCQOptions";

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
  // Fallback for compatibility
  const answer = currentQuestion.answer;

  const handleAnswer = (selected: string) => {
    if (!currentQuestion) return;
    const isCorrect = selected === answer;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          id: currentQuestion.id,
          prompt: currentQuestion.prompt,
          correctAnswer: answer,
          userAnswer: selected,
          category: currentQuestion.category,
          options: currentQuestion.options,
        },
      ]);
    }

    setUserAnswer(selected);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        setShowResult(false);
      } else {
        const endTime = Date.now();
        // If the last answer was incorrect, add it to the mistakes array
        const finalMistakes = isCorrect
          ? mistakes
          : [
              ...mistakes,
              {
                id: currentQuestion.id,
                prompt: currentQuestion.prompt,
                correctAnswer: answer,
                userAnswer: selected,
                category: currentQuestion.category,
                options: currentQuestion.options,
              },
            ];
        onComplete({
          totalQuestions: questions.length,
          correctAnswers: score + (isCorrect ? 1 : 0),
          wrongAnswers: questions.length - (score + (isCorrect ? 1 : 0)),
          timeSpent: endTime - sessionStartTime,
          mistakes: finalMistakes,
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
        <MCQOptions
          options={currentQuestion.options}
          answer={answer}
          userAnswer={userAnswer}
          showResult={showResult}
          onSelect={handleAnswer}
          disabled={showResult}
        />

        {/* Result Feedback */}
        {showResult && (
          <div className="mt-4 text-center">
            {userAnswer === answer ? (
              <div className="text-green-600 font-medium">
                ✅ Correct! Well done!
              </div>
            ) : (
              <div className="text-red-600 font-medium">
                ❌ Incorrect. The correct answer is:{" "}
                <span className="font-bold">{answer}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </SessionLayout>
  );
};

export default MCQSession;
