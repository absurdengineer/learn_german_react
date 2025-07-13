import React, { useEffect, useState } from "react";
import { getGenderColor } from "../../lib/genderColors";
import GenderLegend from "../../components/GenderLegend";
import PronunciationButton from "../../components/PronunciationButton";
import SessionLayout from "../../components/layout/SessionLayout";
import type { Question } from "../../core/question-engine/questionTypes";
import type { StandardizedArticle } from "../../lib/parsers/DataLoader";

interface ArticlesLearningProps {
  onExit: () => void;
  sessionLength?: number;
  focusCategory?: string;
  autoAdvanceSpeed?: number; // milliseconds
  questions?: Question[];
}

const ArticlesLearning: React.FC<ArticlesLearningProps> = ({
  onExit,
  autoAdvanceSpeed = 3000, // 3 seconds per word
  questions: propQuestions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState(autoAdvanceSpeed);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  // Initialize session questions
  useEffect(() => {
    if (propQuestions && propQuestions.length > 0) {
      setSessionQuestions(propQuestions);
    }
  }, [propQuestions]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || sessionQuestions.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < sessionQuestions.length - 1) {
        setCurrentIndex((prev: number) => prev + 1);
      } else {
        // Session complete - restart from beginning
        setCurrentIndex(0);
        // Re-shuffle for variety
        const newShuffled = [...sessionQuestions].sort(
          () => Math.random() - 0.5
        );
        setSessionQuestions(newShuffled);
      }
    }, currentSpeed);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, sessionQuestions, currentSpeed]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1);
    }
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentIndex];
  const currentArticle = currentQuestion?.data as StandardizedArticle;
  const genderColor = getGenderColor(currentArticle.gender);
  const progress = ((currentIndex + 1) / sessionQuestions.length) * 100;

  return (
    <SessionLayout title="Articles Learning" onExit={onExit}>
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm sm:text-base text-gray-600 font-medium">
            Progress
          </span>
          <span className="text-sm sm:text-base text-gray-600 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 sm:h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <GenderLegend className="bg-white rounded-lg p-3 sm:p-4 shadow-sm" />
      </div>

      <div className="flex flex-col items-center bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-600 mb-2">Article:</div>
          <div
            className={`inline-block px-6 py-3 rounded-xl font-bold text-white mb-4 ${genderColor.bg}`}
          >
            {currentArticle.gender}
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {currentArticle.german}
          </div>
          <div className="text-lg sm:text-xl text-gray-600">
            {currentArticle.english}
          </div>
          {currentArticle.pronunciation && (
            <div className="flex items-center justify-center gap-2">
              <div className="text-md sm:text-lg text-gray-500">
                /{currentArticle.pronunciation}/
              </div>
              <PronunciationButton
                text={currentArticle.german}
                className="flex-shrink-0"
              />
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2 capitalize">
            Category: {currentArticle.category}
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 sm:space-x-6 px-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="p-3 sm:p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-w-[52px] min-h-[52px] sm:min-w-[56px] sm:min-h-[56px] flex items-center justify-center"
            aria-label="Previous word"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className={`p-4 sm:p-5 rounded-full shadow-lg hover:shadow-xl transition-all touch-manipulation min-w-[64px] min-h-[64px] sm:min-w-[72px] sm:min-h-[72px] flex items-center justify-center ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
            aria-label={isPlaying ? "Pause learning" : "Start learning"}
          >
            {isPlaying ? (
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={goToNext}
            className="p-3 sm:p-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow touch-manipulation min-w-[52px] min-h-[52px] sm:min-w-[56px] sm:min-h-[56px] flex items-center justify-center"
            aria-label="Next word"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <span className="text-base sm:text-lg font-medium text-gray-700">
            Learning Speed:
          </span>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {[
              { speed: 5000, label: "Slow" },
              { speed: 3000, label: "Normal" },
              { speed: 1500, label: "Fast" },
              { speed: 800, label: "Very Fast" },
            ].map(({ speed, label }) => (
              <button
                key={speed}
                onClick={() => setCurrentSpeed(speed)}
                className={`px-4 py-3 rounded-full text-sm sm:text-base font-medium transition-colors touch-manipulation min-h-[44px] flex-1 sm:flex-none ${
                  currentSpeed === speed
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={`Set speed to ${label.toLowerCase()}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SessionLayout>
  );
};

export default ArticlesLearning;
