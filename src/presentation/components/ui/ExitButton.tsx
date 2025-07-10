import React from 'react';

interface ExitButtonProps {
  onExit: () => void;
  label?: string;
  className?: string;
}

const ExitButton: React.FC<ExitButtonProps> = ({
  onExit,
  label = 'Exit',
  className = ''
}) => {
  return (
    <button
      onClick={onExit}
      className={`flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
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
      <span className="text-gray-700">{label}</span>
    </button>
  );
};

export default ExitButton;
