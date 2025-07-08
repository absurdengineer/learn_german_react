import React, { useEffect, useState } from "react";
import { loadArticleNouns, type ArticleNoun } from "../../data";
import { getGenderColor } from "../../utils/genderColors";
import GenderLegend from "./GenderLegend";

interface ArticlesLearningProps {
  onExit: () => void;
  sessionLength?: number;
  focusCategory?: string;
  autoAdvanceSpeed?: number; // milliseconds
}

// Load essential A1 nouns from JSON
const ESSENTIAL_A1_NOUNS: ArticleNoun[] = loadArticleNouns();

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
  const [wordsStudied, setWordsStudied] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(autoAdvanceSpeed);

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
        setCurrentIndex((prev) => prev + 1);
        setWordsStudied((prev) => prev + 1);
      } else {
        // Session complete - restart from beginning
        setCurrentIndex(0);
        setWordsStudied(0);
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
      setCurrentIndex((prev) => prev + 1);
      setWordsStudied((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
      setWordsStudied(0);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-gray-700">Exit</span>
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Articles Learning
            </h2>
            <p className="text-sm text-gray-600">
              Word {currentIndex + 1} of {shuffledWords.length}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Words studied: {wordsStudied}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Gender Legend */}
        <div className="mb-6">
          <GenderLegend className="bg-white rounded-lg p-4 shadow-sm" />
        </div>

        {/* Main Learning Card */}
        <div
          className={`rounded-xl shadow-lg p-8 mb-6 transition-all duration-500 ${genderColor.bg} ${genderColor.border} border-2`}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className={`text-6xl font-bold ${genderColor.text}`}>
                {currentWord.gender}
              </h1>
              <h1 className={`text-6xl font-bold ${genderColor.text}`}>
                {currentWord.german}
              </h1>
            </div>

            <p className={`text-2xl mb-4 ${genderColor.text} opacity-80`}>
              {currentWord.english}
            </p>

            <div
              className={`inline-block px-4 py-2 rounded-lg border-2 ${genderColor.border} ${genderColor.bg}`}
            >
              <span className={`text-sm font-medium ${genderColor.text}`}>
                {currentWord.category} • {genderColor.name}
              </span>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isPlaying ? (
                <svg
                  className="w-8 h-8"
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
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={goToNext}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <svg
                className="w-6 h-6 text-gray-600"
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

        {/* Speed Controls */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Speed:</span>
            <div className="flex space-x-2">
              {[
                { speed: 5000, label: "Slow" },
                { speed: 3000, label: "Normal" },
                { speed: 1500, label: "Fast" },
                { speed: 800, label: "Very Fast" },
              ].map(({ speed, label }) => (
                <button
                  key={speed}
                  onClick={() => setCurrentSpeed(speed)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    currentSpeed === speed
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesLearning;
