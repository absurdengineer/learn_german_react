import React from 'react';

interface MediaControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onReset?: () => void;
  showNext?: boolean;
  showPrevious?: boolean;
  showReset?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MediaControls: React.FC<MediaControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onReset,
  showNext = true,
  showPrevious = true,
  showReset = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      button: 'p-2',
      icon: 'w-4 h-4',
      playButton: 'p-3',
      playIcon: 'w-6 h-6'
    },
    md: {
      button: 'p-3',
      icon: 'w-6 h-6',
      playButton: 'p-4',
      playIcon: 'w-8 h-8'
    },
    lg: {
      button: 'p-4',
      icon: 'w-8 h-8',
      playButton: 'p-5',
      playIcon: 'w-10 h-10'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Previous button */}
      {showPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          className={`${sizes.button} bg-white rounded-full shadow-md hover:shadow-lg transition-shadow`}
        >
          <svg
            className={`${sizes.icon} text-gray-600`}
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
      )}

      {/* Play/Pause button */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`${sizes.playButton} rounded-full transition-colors shadow-lg ${
          isPlaying
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        {isPlaying ? (
          <svg
            className={sizes.playIcon}
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
            className={sizes.playIcon}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Next button */}
      {showNext && onNext && (
        <button
          onClick={onNext}
          className={`${sizes.button} bg-white rounded-full shadow-md hover:shadow-lg transition-shadow`}
        >
          <svg
            className={`${sizes.icon} text-gray-600`}
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
      )}

      {/* Reset button */}
      {showReset && onReset && (
        <button
          onClick={onReset}
          className={`${sizes.button} bg-white rounded-full shadow-md hover:shadow-lg transition-shadow ml-2`}
        >
          <svg
            className={`${sizes.icon} text-gray-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MediaControls;
