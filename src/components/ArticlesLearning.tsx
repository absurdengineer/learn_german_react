import React, { useEffect, useState } from "react";
import { getGenderColor } from "../lib/genderColors";
import GenderLegend from "./GenderLegend";
import {
  ESSENTIAL_A1_NOUNS,
  DEFAULT_SESSION_LENGTH,
  DEFAULT_AUTO_ADVANCE_SPEED,
} from "../data/constants";

interface ArticlesLearningProps {
  onExit: () => void;
  sessionLength?: number;
  focusCategory?: string;
  autoAdvanceSpeed?: number; // milliseconds
}

import SessionLayout from "./layout/SessionLayout";

const ArticlesLearning: React.FC<ArticlesLearningProps> = ({
  onExit,
  sessionLength = 30,
  focusCategory,
  autoAdvanceSpeed = 3000, // 3 seconds per word
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shuffledWords, setShuffledWords] = useState<typeof ESSENTIAL_A1_NOUNS>(
    []
  );
  const [currentSpeed, setCurrentSpeed] = useState(autoAdvanceSpeed);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  // Initialize shuffled words
  useEffect(() => {
    let wordsToStudy = ESSENTIAL_A1_NOUNS;
    if (focusCategory) {
      wordsToStudy = ESSENTIAL_A1_NOUNS.filter(
        (noun) => noun.category === focusCategory
      );
    }

    const shuffled = [...wordsToStudy].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled.slice(0, sessionLength));
  }, [focusCategory, sessionLength]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || shuffledWords.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < shuffledWords.length - 1) {
        setCurrentIndex((prev: number) => prev + 1);
      } else {
        // Session complete - restart from beginning
        setCurrentIndex(0);
        // Re-shuffle for variety
        const newShuffled = [...shuffledWords].sort(() => Math.random() - 0.5);
        setShuffledWords(newShuffled);
      }
    }, currentSpeed);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, shuffledWords, currentSpeed]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
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

  if (shuffledWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];
  const genderColor = getGenderColor(
    currentWord.gender as "der" | "die" | "das"
  );
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

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

      <div
        className={`rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 mb-4 sm:mb-6 transition-all duration-500 ${genderColor.bg} ${genderColor.border} border-2 min-h-[350px] sm:min-h-[450px] flex flex-col justify-center`}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-2">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold ${genderColor.text} break-words hyphens-auto max-w-full`}
            >
              {currentWord.gender}
            </h1>
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold ${genderColor.text} break-words hyphens-auto leading-tight max-w-full overflow-wrap-anywhere`}
            >
              {currentWord.german}
            </h1>
          </div>

          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 ${genderColor.text} opacity-80 break-words leading-relaxed px-2 max-w-full overflow-wrap-anywhere`}
          >
            {currentWord.english}
          </p>
          {currentWord.pronunciation && (
            <p
              className={`text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 ${genderColor.text} opacity-70 px-2`}
            >
              /{currentWord.pronunciation}/
            </p>
          )}

          <div
            className={`inline-block px-4 sm:px-5 py-2 sm:py-3 mx-2 rounded-lg border-2 ${genderColor.border} ${genderColor.bg} max-w-full`}
          >
            <span
              className={`text-sm sm:text-base lg:text-lg font-medium ${genderColor.text} break-words`}
            >
              {currentWord.category} • {genderColor.name}
            </span>
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
