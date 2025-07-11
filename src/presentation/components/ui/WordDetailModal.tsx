import React from 'react';
import { VocabularyWord } from '../../../domain/entities/Vocabulary';

interface WordDetailModalProps {
  word: VocabularyWord;
  onClose: () => void;
}

const getWordTypeColor = (type: string) => {
  const colors = {
    'noun': 'bg-blue-100 text-blue-800',
    'verb': 'bg-green-100 text-green-800',
    'adjective': 'bg-purple-100 text-purple-800',
    'pronoun': 'bg-yellow-100 text-yellow-800',
    'article': 'bg-pink-100 text-pink-800',
    'conjunction': 'bg-orange-100 text-orange-800',
    'interjection': 'bg-red-100 text-red-800',
    'preposition': 'bg-gray-100 text-gray-800',
    'adverb': 'bg-indigo-100 text-indigo-800',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getGenderColor = (gender?: string) => {
  const colors = {
    'der': 'bg-blue-100 text-blue-800',
    'die': 'bg-red-100 text-red-800',
    'das': 'bg-green-100 text-green-800',
    'plural': 'bg-purple-100 text-purple-800',
  };
  return colors[gender as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pr-4">{word.german}</h2>
              {word.pronunciation && (
                <p className="text-lg text-blue-600 italic mt-2">
                  {word.pronunciation}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Translation</h3>
              <p className="text-gray-700 text-lg">{word.english}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className={`px-3 sm:px-4 py-2 text-sm rounded-xl font-medium ${getWordTypeColor(word.type)}`}>
                {word.type}
              </span>
              {word.gender && (
                <span className={`px-3 sm:px-4 py-2 text-sm rounded-xl font-medium ${getGenderColor(word.gender)}`}>
                  {word.gender}
                </span>
              )}
              <span className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl font-medium">
                Level: {word.level}
              </span>
            </div>
            
            {word.plural && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Plural</h3>
                <p className="text-gray-700 text-lg">{word.plural}</p>
              </div>
            )}
            
            {word.conjugations && word.conjugations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Conjugations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {word.conjugations.map((conjugation, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium">
                      {conjugation}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {word.exampleSentences.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {word.exampleSentences.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-800 font-medium text-lg mb-2">{example.german}</p>
                      <p className="text-gray-600">{example.english}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {word.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
