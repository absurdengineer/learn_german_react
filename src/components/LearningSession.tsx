import React, { useEffect, useState } from "react";
import SessionLayout from "./layout/SessionLayout";
import PronunciationButton from "./PronunciationButton";
import SpeedControls from "./SpeedControls";

interface LearningSessionProps {
  questions: any[];
  title: string;
  onExit: () => void;
}

const LearningSession: React.FC<LearningSessionProps> = ({
  questions,
  title,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvanceDelay, setAutoAdvanceDelay] = useState(3000); // 3 seconds default
  const [autoAdvanceTimer, setAutoAdvanceTimer] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex]);

  // Auto-advance functionality
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoAdvanceDelay);
      setAutoAdvanceTimer(timer);
      return () => clearTimeout(timer);
    } else if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
  }, [isPlaying, currentIndex, autoAdvanceDelay]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to end
      setCurrentIndex(questions.length - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    setAutoAdvanceDelay(speed);
  };

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "der":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "die":
        return "bg-pink-50 border-pink-200 text-pink-800";
      case "das":
        return "bg-gray-50 border-gray-200 text-gray-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getGenderBorderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "der":
        return "border-blue-300";
      case "die":
        return "border-pink-300";
      case "das":
        return "border-gray-300";
      default:
        return "border-gray-300";
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            No learning content available.
          </p>
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
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Counter */}
      <div className="mb-6 sm:mb-8">
        <div className="text-center text-sm sm:text-base text-gray-600">
          <span>
            Word {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Learning Card */}
      <div
        className={`border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 transition-all duration-300 ${getGenderBorderColor(
          currentQuestion.data?.gender
        )}`}
      >
        <div className="text-center space-y-6">
          {/* Gender Badge */}
          {currentQuestion.data?.gender && (
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getGenderColor(
                currentQuestion.data.gender
              )}`}
            >
              {currentQuestion.data.gender.toUpperCase()}
            </div>
          )}

          {/* German Word with Article */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              {currentQuestion.data?.gender && (
                <span
                  className={
                    currentQuestion.data.gender === "der"
                      ? "text-blue-600"
                      : currentQuestion.data.gender === "die"
                      ? "text-pink-600"
                      : "text-gray-600"
                  }
                >
                  {currentQuestion.data.gender}{" "}
                </span>
              )}
              {currentQuestion.data?.german || currentQuestion.prompt}
            </h2>
          </div>

          {/* Pronunciation */}
          <div className="flex items-center justify-center space-x-2">
            <PronunciationButton
              text={currentQuestion.data?.german || currentQuestion.prompt}
              className="text-lg"
            />
            <span className="text-sm text-gray-500">
              {currentQuestion.data?.ipa && `[${currentQuestion.data.ipa}]`}
            </span>
          </div>

          {/* English Translation */}
          <div className="text-lg sm:text-xl text-gray-600">
            {currentQuestion.data?.english || currentQuestion.answer}
          </div>

          {/* Additional Info */}
          {currentQuestion.data?.additionalInfo && (
            <div className="text-sm text-gray-500 italic">
              {currentQuestion.data.additionalInfo}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-6">
        {/* Play/Pause and Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            className="p-3 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={questions.length <= 1}
          >
            <svg
              className="w-6 h-6"
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
            onClick={handlePlayPause}
            className={`p-4 rounded-full transition-colors ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isPlaying ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={questions.length <= 1}
          >
            <svg
              className="w-6 h-6"
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

        {/* Speed Controls */}
        <SpeedControls
          currentSpeed={autoAdvanceDelay}
          onSpeedChange={handleSpeedChange}
        />
      </div>
    </SessionLayout>
  );
};

export default LearningSession;
