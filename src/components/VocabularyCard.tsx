import React from "react";
import { VocabularyWord } from "../types/Vocabulary";
import PronunciationButton from "./PronunciationButton";

interface VocabularyCardProps {
  word: VocabularyWord;
  onClick: () => void;
}

const getWordTypeColor = (type: string) => {
  const colors = {
    noun: "bg-blue-100 text-blue-800",
    verb: "bg-green-100 text-green-800",
    adjective: "bg-purple-100 text-purple-800",
    pronoun: "bg-yellow-100 text-yellow-800",
    article: "bg-pink-100 text-pink-800",
    conjunction: "bg-orange-100 text-orange-800",
    interjection: "bg-red-100 text-red-800",
    preposition: "bg-gray-100 text-gray-800",
    adverb: "bg-indigo-100 text-indigo-800",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getGenderColor = (gender?: string) => {
  const colors = {
    der: "bg-blue-100 text-blue-800",
    die: "bg-red-100 text-red-800",
    das: "bg-green-100 text-green-800",
    plural: "bg-purple-100 text-purple-800",
  };
  return colors[gender as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  word,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{word.german}</h3>
          {word.pronunciation && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-blue-600 italic">
                {word.pronunciation}
              </p>
              <PronunciationButton
                text={word.german}
                className="flex-shrink-0"
              />
            </div>
          )}
        </div>
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${getWordTypeColor(
            word.type
          )}`}
        >
          {word.type}
        </span>
      </div>

      <p className="text-gray-600 mb-4 text-sm">{word.english}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {word.gender && (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getGenderColor(
              word.gender
            )}`}
          >
            {word.gender}
          </span>
        )}
        {word.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {word.exampleSentences.length > 0 && (
        <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
          "{word.exampleSentences[0].german}"
        </div>
      )}
    </div>
  );
};
