import React from "react";

interface MCQOptionsProps {
  options: string[];
  answer?: string;
  userAnswer?: string;
  showResult?: boolean;
  onSelect: (option: string) => void;
  disabled?: boolean;
  className?: string;
}

function isDerDieDas(options: string[]) {
  const set = new Set(options.map((o) => o.trim().toLowerCase()));
  return set.size === 3 && set.has("der") && set.has("die") && set.has("das");
}

function getOrderedDerDieDas(options: string[]) {
  // Return ["der", "die", "das"] with original casing if present, else fallback to lower
  const lowerMap = Object.fromEntries(
    options.map((o) => [o.trim().toLowerCase(), o])
  );
  return ["der", "die", "das"].map((key) => lowerMap[key] || key);
}

const MCQOptions: React.FC<MCQOptionsProps> = ({
  options,
  answer,
  userAnswer,
  showResult = false,
  onSelect,
  disabled = false,
  className = "",
}) => {
  let gridClass = "grid grid-cols-1 gap-3 sm:gap-4";
  let displayOptions = options;
  if (isDerDieDas(options)) {
    gridClass = "grid grid-cols-3 gap-3 sm:gap-4";
    displayOptions = getOrderedDerDieDas(options);
  } else if (options.length === 4) {
    gridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4";
  }

  const getOptionClass = (option: string) => {
    if (showResult) {
      if (option === answer) {
        return "bg-green-100 border-green-500 text-green-700";
      }
      if (option === userAnswer && option !== answer) {
        return "bg-red-100 border-red-500 text-red-700";
      }
      return "bg-gray-50 border-gray-200 text-gray-700";
    }
    return "bg-gray-50 border-gray-200 hover:bg-gray-100 active:bg-gray-200 text-gray-700";
  };

  return (
    <div className={`${gridClass} ${className}`}>
      {displayOptions.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          disabled={disabled || showResult}
          className={`p-3 sm:p-4 rounded-lg border transition-all text-center w-full font-medium ${getOptionClass(
            option
          )}`}
        >
          <span className="text-sm sm:text-base">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default MCQOptions;
