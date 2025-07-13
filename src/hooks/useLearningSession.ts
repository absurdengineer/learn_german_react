import { useEffect, useState } from "react";

export function useLearningSession({ questions }: { questions: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvanceDelay, setAutoAdvanceDelay] = useState(3000); // 3 seconds default
  const [autoAdvanceTimer, setAutoAdvanceTimer] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentIndex, autoAdvanceDelay]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(questions.length - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSpeedChange = (speed: number) => {
    setAutoAdvanceDelay(speed);
  };

  return {
    currentIndex,
    isPlaying,
    autoAdvanceDelay,
    currentQuestion,
    handleNext,
    handlePrevious,
    handlePlayPause,
    handleSpeedChange,
  };
}
