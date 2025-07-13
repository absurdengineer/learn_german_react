import React from "react";
import Button from "./Button";

interface SessionNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onExit: () => void;
  nextLabel?: string;
  previousLabel?: string;
  exitLabel?: string;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  showNext?: boolean;
  showPrevious?: boolean;
  className?: string;
}

const SessionNavigation: React.FC<SessionNavigationProps> = ({
  onNext,
  onPrevious,
  onExit,
  nextLabel = "Next",
  previousLabel = "Previous",
  exitLabel = "Exit",
  nextDisabled = false,
  previousDisabled = false,
  showNext = true,
  showPrevious = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between space-x-4 ${className}`}>
      {/* Previous button */}
      {showPrevious && onPrevious ? (
        <Button
          onClick={onPrevious}
          disabled={previousDisabled}
          variant="ghost"
          size="md"
        >
          ← {previousLabel}
        </Button>
      ) : (
        <div></div> // Spacer for layout
      )}
      {/* Exit button */}
      <Button onClick={onExit} variant="danger" size="md">
        Exit ❌
      </Button>
      {/* Next button */}
      {showNext && onNext ? (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          variant="primary"
          size="md"
        >
          {nextLabel} →
        </Button>
      ) : (
        <div></div> // Spacer for layout
      )}
    </div>
  );
};

export default SessionNavigation;
