import React, { useEffect, useState } from "react";
import SessionLayout from "./layout/SessionLayout";
import type { QuizResults, QuizMistake } from "../types/Flashcard";

interface TestSessionProps {
  questions: any[]; // Mixed question types
  title: string;
  onComplete: (results: QuizResults) => void;
  onExit: () => void;
}

const TestSession: React.FC<TestSessionProps> = ({
  questions,
  title,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const isAnswerCorrect = (
    userAnswer: string,
    correctAnswer: string
  ): boolean => {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();

    // Check if the correct answer contains alternative answers separated by "/"
    if (normalizedCorrectAnswer.includes("/")) {
      const alternatives = normalizedCorrectAnswer
        .split("/")
        .map((alt) => alt.trim());
      return alternatives.some((alt) => alt === normalizedUserAnswer);
    }

    // Regular exact match
    return normalizedUserAnswer === normalizedCorrectAnswer;
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;

    const isCorrect = isAnswerCorrect(
      answer,
      currentQuestion.correctAnswer || currentQuestion.answer
    );
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          id: currentQuestion.id,
          prompt: currentQuestion.prompt,
          correctAnswer:
            currentQuestion.correctAnswer || currentQuestion.answer,
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
        setTextInput("");
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
    if (e.key === "Enter" && textInput.trim()) {
      handleTextSubmit();
    }
  };

  const handleFlashcardNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
    } else {
      const endTime = Date.now();
      onComplete({
        totalQuestions: questions.length,
        correctAnswers: score,
        wrongAnswers: questions.length - score,
        timeSpent: endTime - sessionStartTime,
        mistakes,
      });
    }
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

  // Determine question type and render appropriate UI
  const questionType = currentQuestion.mode || currentQuestion.type || "mcq";
  const isFlashcard =
    questionType === "flashcards" || questionType === "flashcard";
  const isMCQ = currentQuestion.options && currentQuestion.options.length > 0;
  const isFreestyle = !isFlashcard && !isMCQ;

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

        {/* Flashcard Mode */}
        {isFlashcard && (
          <div className="text-center">
            {!showResult ? (
              <button
                onClick={() => setShowResult(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Show Answer
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-lg sm:text-xl font-semibold text-green-600">
                  {currentQuestion.answer || currentQuestion.correctAnswer}
                </div>
                <button
                  onClick={handleFlashcardNext}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Finish Test"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MCQ Mode */}
        {isMCQ && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {currentQuestion.options.map((option: string) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-3 sm:p-4 rounded-lg border transition-all text-left w-full ${
                  showResult &&
                  option ===
                    (currentQuestion.correctAnswer || currentQuestion.answer)
                    ? "bg-green-100 border-green-500 text-green-700"
                    : showResult &&
                      option === userAnswer &&
                      option !==
                        (currentQuestion.correctAnswer ||
                          currentQuestion.answer)
                    ? "bg-red-100 border-red-500 text-red-700"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                <span className="text-sm sm:text-base">{option}</span>
              </button>
            ))}
          </div>
        )}

        {/* Freestyle Input Mode */}
        {isFreestyle && (
          <div className="max-w-lg mx-auto">
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={showResult}
                placeholder="Type your answer..."
                className={`w-full p-3 sm:p-4 text-base sm:text-lg border rounded-lg focus:outline-none focus:ring-2 ${
                  showResult
                    ? isAnswerCorrect(
                        textInput,
                        currentQuestion.correctAnswer || currentQuestion.answer
                      )
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />

              {!showResult && (
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="w-full py-3 sm:py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Result Feedback for MCQ and Freestyle */}
        {showResult && (isMCQ || isFreestyle) && (
          <div className="mt-4 text-center">
            {userAnswer ===
            (currentQuestion.correctAnswer || currentQuestion.answer) ? (
              <div className="text-green-600 font-medium">
                ✅ Correct! Well done!
              </div>
            ) : (
              <div className="text-red-600 font-medium">
                ❌ Incorrect. The correct answer is:{" "}
                <span className="font-bold">
                  {currentQuestion.correctAnswer || currentQuestion.answer}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SessionLayout>
  );
};

export default TestSession;
