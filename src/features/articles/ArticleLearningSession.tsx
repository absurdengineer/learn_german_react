import React, { useEffect, useRef, useState } from "react";
import type { Question } from "../../core/question-engine/questionTypes";
import PronunciationButton from "../../components/PronunciationButton";

interface ArticleLearningSessionProps {
  questions: Question[];
  title?: string;
  onExit: () => void;
  autoAdvanceDelay?: number;
}

const SPEED_OPTIONS = [
  { label: "Slow", value: 5000 },
  { label: "Normal", value: 3000 },
  { label: "Fast", value: 1500 },
  { label: "Super Fast", value: 800 },
];

const ArticleLearningSession: React.FC<ArticleLearningSessionProps> = ({
  questions,
  title = "Article Learning",
  onExit,
  autoAdvanceDelay = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(autoAdvanceDelay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (playing) {
      timerRef.current = setTimeout(() => {
        handleNext();
      }, speed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line
  }, [currentIndex, playing, speed]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : 0));
  };

  const handlePlayPause = () => {
    setPlaying((p) => !p);
  };

  const current = questions[currentIndex];
  const genderRaw = current.data?.gender;
  const gender: "der" | "die" | "das" =
    genderRaw === "der" || genderRaw === "die" || genderRaw === "das"
      ? genderRaw
      : "das";
  // Use even lighter gender colors for the card background
  let bgColor = "bg-gray-100 border-none text-gray-900";
  if (gender === "der") bgColor = "bg-blue-100 border-none text-blue-900";
  if (gender === "die") bgColor = "bg-pink-100 border-none text-pink-900";
  if (gender === "das") bgColor = "bg-gray-100 border-none text-gray-900";

  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-lg text-gray-700 mb-6">
            You reviewed {questions.length} cards.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setShowSummary(false);
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Restart
            </button>
            <button
              onClick={onExit}
              className="px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold text-lg hover:bg-gray-500 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-gray-800 px-3 py-1 rounded-lg border border-gray-200"
          >
            Exit
          </button>
        </div>
        <div
          className={`rounded-2xl shadow-lg p-12 mb-8 text-center transition-colors duration-300 ${bgColor} max-w-7xl mx-auto min-h-[400px] flex flex-col justify-center`}
        >
          <div className="text-5xl font-extrabold mb-6 flex items-center justify-center gap-4 text-gray-900">
            {current.answer} {current.data?.german}
            {current.data?.german && (
              <PronunciationButton
                text={`${current.answer} ${current.data.german}`}
              />
            )}
          </div>
          {current.helperText && (
            <div className="text-2xl italic mt-4 text-gray-700">
              {current.helperText}
            </div>
          )}
        </div>
        {/* Controls above speed */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous"
            className="p-3 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handlePlayPause}
            aria-label={playing ? "Pause" : "Play"}
            className={`p-4 rounded-full shadow-md border transition-all ${
              playing
                ? "bg-yellow-400 hover:bg-yellow-500 text-white border-yellow-400"
                : "bg-green-500 hover:bg-green-600 text-white border-green-500"
            }`}
          >
            {playing ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            aria-label="Next"
            className="p-3 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Speed selection below controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-gray-700 font-medium">Speed:</span>
          {SPEED_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer px-3 py-1.5 rounded-md font-medium border text-sm transition-colors duration-200
              ${
                speed === opt.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              <input
                type="radio"
                name="speed"
                value={opt.value}
                checked={speed === opt.value}
                onChange={() => setSpeed(opt.value)}
                className="hidden"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm">
          Card {currentIndex + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
};

export default ArticleLearningSession;
