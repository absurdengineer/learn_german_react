import React from 'react';
import type { ExampleSentence, VocabularyWord } from '../../domain/entities/Vocabulary';
import { getGenderColor, getGenderDisplayName } from '../../utils/genderColors';

/**
 * Component to render additional vocabulary information
 */
export const VocabularyAdditionalInfo: React.FC<{ word: VocabularyWord }> = ({ word }) => {
  const genderColor = getGenderColor(word.gender);

  return (
    <div className="space-y-4">
      {/* Gender and word type info */}
      {word.hasGender() && (
        <div className="flex items-center justify-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
            {word.gender}
          </span>
          <span className="text-sm text-gray-600">
            ({getGenderDisplayName(word.gender)})
          </span>
        </div>
      )}

      {/* Full noun form */}
      {word.isNoun() && word.hasGender() && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">Full form: </span>
          {word.getFullNoun()}
        </div>
      )}

      {/* Example sentences */}
      {word.exampleSentences.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">Examples:</h4>
          {word.exampleSentences.slice(0, 2).map((example: ExampleSentence, index: number) => (
            <div key={index} className="text-sm bg-gray-50 p-3 rounded-md">
              <p className="italic text-gray-800 mb-1">{example.german}</p>
              <p className="text-gray-600">{example.english}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {word.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {word.tags.map((tag: string) => (
            <span 
              key={tag} 
              className={`px-2 py-1 text-xs rounded-full ${
                word.hasGender() && word.type === 'article' 
                  ? `${genderColor.bg} ${genderColor.text} border ${genderColor.border}`
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
