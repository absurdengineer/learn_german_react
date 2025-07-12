import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Test, TestQuestion, TestResult } from "../types/Flashcard";
import { calculateTestScore, saveTestResult } from "../lib/quizUtils";

import SessionLayout from "./layout/SessionLayout";

const TestSession = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { test } = (state as { test: Test }) || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!test) return;

    questionStartTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Use a ref to capture current userAnswers to avoid dependency issues
          handleNextQuestion(userAnswers);
          return 20;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Prevent accidental navigation away from test
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your test progress will be lost.";
      return "Are you sure you want to leave? Your test progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test]);

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigate("/tests");
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showExitConfirm) {
        setShowExitConfirm(false);
      }
    };

    if (showExitConfirm) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showExitConfirm]);

  if (!test) {
    return <div>Test data is missing. Please start a new test.</div>;
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion(userAnswers);
          return 20;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleNextQuestion = (currentAnswers: { [key: string]: string }) => {
    const timeSpent = Date.now() - questionStartTime.current;
    setTotalTime((prev) => prev + timeSpent);

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      questionStartTime.current = Date.now();
      resetTimer();
    } else {
      handleSubmit(currentAnswers);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    if (selectedOption) return; // Prevent changing answer

    const newAnswers = { ...userAnswers, [questionId]: answer };
    setUserAnswers(newAnswers);
    setSelectedOption(answer);

    setTimeout(() => {
      handleNextQuestion(newAnswers);
    }, 500); // Delay to show selection before moving to next question
  };

  const handleSubmit = (finalAnswers: { [key: string]: string }) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const score = test.questions.reduce((acc, question) => {
      return finalAnswers[question.id] === question.answer ? acc + 1 : acc;
    }, 0);

    const result = {
      testId: test.id,
      title: test.title,
      score,
      totalQuestions: test.questions.length,
      userAnswers: finalAnswers,
      totalTime,
      date: new Date().toISOString(),
    };

    const pastResults = JSON.parse(localStorage.getItem("testResults") || "[]");
    localStorage.setItem(
      "testResults",
      JSON.stringify([...pastResults, result])
    );

    navigate(`/tests/results`, {
      state: { userAnswers: finalAnswers, test, result },
    });
  };

  const question = test.questions[currentQuestionIndex];

  return (
    <SessionLayout title={`🧪 ${test.title}`} onExit={handleExitClick}>
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Time Remaining</span>
          <span>{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft <= 5
                ? "bg-red-500"
                : timeLeft <= 10
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 leading-relaxed px-2">
            {question.question}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {question.options.map((option) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                disabled={!!selectedOption}
                className={`w-full p-3 sm:p-4 text-center rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  isSelected
                    ? "bg-blue-500 text-white border-2 border-blue-600 shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border-2 border-gray-200 text-gray-700"
                } ${!!selectedOption && !isSelected ? "opacity-50" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showExitConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCancelExit}
        >
          <div
            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="exit-dialog-title"
            aria-describedby="exit-dialog-description"
          >
            <div className="text-center">
              <div className="text-2xl mb-3 sm:mb-4">⚠️</div>
              <h3
                id="exit-dialog-title"
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
              >
                Exit Test?
              </h3>
              <p
                id="exit-dialog-description"
                className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
              >
                Are you sure you want to exit? Your test progress will be lost
                and cannot be recovered.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleCancelExit}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Exit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SessionLayout>
  );
};

export default TestSession;
