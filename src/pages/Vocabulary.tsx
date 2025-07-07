import React, { useEffect, useState } from 'react';
import {
    A1_VOCABULARY,
    A1_VOCABULARY_BY_CATEGORY,
    getRandomVocabulary,
    getVocabularyByCategory,
    searchVocabulary
} from '../data/vocabulary';
import { VocabularyWord } from '../domain/entities/Vocabulary';
import VocabularyPractice from '../presentation/components/VocabularyPractice';

const Vocabulary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | keyof typeof A1_VOCABULARY_BY_CATEGORY>('all');
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>(A1_VOCABULARY);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  useEffect(() => {
    let words: VocabularyWord[] = [];
    
    if (searchTerm.trim()) {
      words = searchVocabulary(searchTerm);
    } else if (selectedCategory === 'all') {
      words = A1_VOCABULARY;
    } else {
      words = getVocabularyByCategory(selectedCategory);
    }
    
    setFilteredWords(words);
  }, [searchTerm, selectedCategory]);

  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWord(null);
  };

  const startPractice = () => {
    setPracticeMode(true);
  };

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

  if (practiceMode) {
    return <VocabularyPractice />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">German Vocabulary</h1>
          <p className="text-gray-600">Learn essential German words for A1 level</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | keyof typeof A1_VOCABULARY_BY_CATEGORY)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="articles">Articles</option>
                <option value="pronouns">Pronouns</option>
                <option value="verbs">Verbs</option>
                <option value="nouns">Nouns</option>
                <option value="adjectives">Adjectives</option>
                <option value="conjunctions">Conjunctions</option>
                <option value="interjections">Interjections</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={startPractice}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Practice Mode
              </button>
              <button
                onClick={() => setFilteredWords(getRandomVocabulary(20))}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Random Words
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Words</p>
                <p className="text-2xl font-semibold text-gray-900">{A1_VOCABULARY.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Filtered</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredWords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-2xl font-semibold text-gray-900 capitalize">{selectedCategory}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWords.map((word) => (
            <div
              key={word.id.value}
              onClick={() => handleWordClick(word)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{word.german}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getWordTypeColor(word.type)}`}>
                  {word.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{word.english}</p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {word.gender && (
                  <span className={`px-2 py-1 text-xs rounded-full ${getGenderColor(word.gender)}`}>
                    {word.gender}
                  </span>
                )}
                {word.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {word.exampleSentences.length > 0 && (
                <div className="text-sm text-gray-500 italic">
                  "{word.exampleSentences[0].german}"
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vocabulary found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Word Detail Modal */}
      {dialogOpen && selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedWord.german}</h2>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Translation</h3>
                  <p className="text-gray-700">{selectedWord.english}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${getWordTypeColor(selectedWord.type)}`}>
                    {selectedWord.type}
                  </span>
                  {selectedWord.gender && (
                    <span className={`px-3 py-1 text-sm rounded-full ${getGenderColor(selectedWord.gender)}`}>
                      {selectedWord.gender}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    Level: {selectedWord.level}
                  </span>
                </div>
                
                {selectedWord.plural && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Plural</h3>
                    <p className="text-gray-700">{selectedWord.plural}</p>
                  </div>
                )}
                
                {selectedWord.conjugations && selectedWord.conjugations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Conjugations</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedWord.conjugations.map((conjugation, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded">
                          {conjugation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedWord.exampleSentences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Examples</h3>
                    <div className="space-y-3">
                      {selectedWord.exampleSentences.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-800 font-medium">{example.german}</p>
                          <p className="text-gray-600 text-sm">{example.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
