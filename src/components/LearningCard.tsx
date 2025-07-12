import React from "react";
import { PronunciationButton } from ".";

interface LearningCardProps {
  word: string;
  translation?: string;
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
  gender?: "der" | "die" | "das";
  showAnswer: boolean;
  onFlip: () => void;
  genderColors?: {
    bg: string;
    border: string;
    text: string;
  };
  className?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

const LearningCard: React.FC<LearningCardProps> = ({
  word,
  translation,
  pronunciation,
  example,
  exampleTranslation,
  category,
  gender,
  showAnswer,
  onFlip,
  genderColors,
  className = "",
  frontContent,
  backContent,
}) => {
  const cardBgColor =
    genderColors && !showAnswer
      ? `${genderColors.bg} ${genderColors.border} border-2`
      : "bg-white";

  return (
    <div
      className={`rounded-xl shadow-lg p-8 transition-all duration-300 cursor-pointer ${cardBgColor} ${className}`}
      onClick={onFlip}
    >
      <div className="text-center min-h-[200px] flex flex-col justify-center">
        {!showAnswer ? (
          <div>
            {/* Front side - German word */}
            <div className="text-4xl font-bold text-gray-900 mb-4">
              {gender && (
                <span
                  className={`text-2xl mr-2 ${
                    genderColors?.text || "text-gray-600"
                  }`}
                >
                  {gender}
                </span>
              )}
              {word}
            </div>

            {pronunciation && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-lg text-gray-600 italic">
                  /{pronunciation}/
                </div>
                <PronunciationButton text={word} className="flex-shrink-0" />
              </div>
            )}

            {category && (
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                {category.replace(/_/g, " ")}
              </div>
            )}

            {frontContent}

            <div className="text-sm text-gray-500 mt-6">
              Click to reveal translation
            </div>
          </div>
        ) : (
          <div>
            {/* Back side - English translation and details */}
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {translation}
            </div>

            {example && (
              <div className="mb-4">
                <div className="text-lg text-gray-700 italic mb-2">
                  "{example}"
                </div>
                {exampleTranslation && (
                  <div className="text-md text-gray-600">
                    "{exampleTranslation}"
                  </div>
                )}
              </div>
            )}

            {backContent}

            <div className="text-sm text-gray-500 mt-6">
              Click to show German word
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCard;
