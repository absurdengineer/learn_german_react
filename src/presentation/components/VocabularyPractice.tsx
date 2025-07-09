import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { A1_VOCABULARY_WORDS, A1_VOCABULARY_WORDS_BY_CATEGORY, loadVocabulary } from '../../data';
import { ExampleSentence, VocabularyWord } from '../../domain/entities/Vocabulary.js';
import { getGenderColor, getGenderDisplayName } from '../../utils/genderColors';

interface VocabularyCardProps {
  word: VocabularyWord;
  onStudy: (word: VocabularyWord, isCorrect: boolean) => void;
  showAnswer: boolean;
}

interface FlashcardProps {
  word: VocabularyWord;
  showAnswer: boolean;
  onNext: () => void;
  onShowAnswer: () => void;
}

// Quiz mode component with user input and feedback
const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onStudy, showAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const genderColor = getGenderColor(word.gender);

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === word.english.toLowerCase().trim();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onStudy(word, isCorrect);
    
    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 max-w-md mx-auto transition-all duration-300 ${
      word.hasGender() ? `${genderColor.bg} ${genderColor.border} border-2` : 'bg-white'
    }`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className={`text-xl sm:text-2xl font-bold ${word.hasGender() ? genderColor.text : 'text-gray-800'}`}>
            {word.german}
          </h3>
          {word.hasGender() && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
              {word.gender}
            </span>
          )}
        </div>
        {word.isNoun() && word.hasGender() && (
          <p className={`text-sm mb-2 ${word.hasGender() ? genderColor.text : 'text-gray-600'}`}>
            {word.getFullNoun()}
            {word.hasGender() && (
              <span className={`ml-2 text-xs ${genderColor.text} opacity-75`}>
                ({getGenderDisplayName(word.gender)})
              </span>
            )}
          </p>
        )}
        {word.pronunciation && (
          <p className={`text-sm italic ${word.hasGender() ? genderColor.text + ' opacity-75' : 'text-gray-500'}`}>
            /{word.pronunciation}/
          </p>
        )}
      </div>

      {!showAnswer ? (
        <div className="space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter English translation..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={feedback !== null}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || feedback !== null}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg sm:text-xl font-semibold text-green-600 mb-4">{word.english}</p>
          {word.exampleSentences.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Examples:</h4>
              {word.exampleSentences.slice(0, 2).map((example: ExampleSentence, index: number) => (
                <div key={index} className="text-sm text-gray-600">
                  <p className="italic">{example.german}</p>
                  <p>{example.english}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div className={`mt-4 p-3 rounded-md text-center ${
          feedback === 'correct' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {feedback === 'correct' ? '✅ Correct!' : `❌ Incorrect. The answer is: ${word.english}`}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1">
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
    </div>
  );
};

// Learning-focused flashcard component (no scoring or feedback)
const VocabularyFlashcard: React.FC<FlashcardProps> = ({ word, showAnswer, onNext, onShowAnswer }) => {
  const genderColor = getGenderColor(word.gender);

  return (
    <div className={`rounded-lg shadow-lg p-6 max-w-md mx-auto transition-all duration-300 ${
      word.hasGender() ? `${genderColor.bg} ${genderColor.border} border-2` : 'bg-white'
    }`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className={`text-xl sm:text-2xl font-bold ${word.hasGender() ? genderColor.text : 'text-gray-800'}`}>
            {word.german}
          </h3>
          {word.hasGender() && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border ${genderColor.border}`}>
              {word.gender}
            </span>
          )}
        </div>
        {word.isNoun() && word.hasGender() && (
          <p className={`text-sm mb-2 ${word.hasGender() ? genderColor.text : 'text-gray-600'}`}>
            {word.getFullNoun()}
            {word.hasGender() && (
              <span className={`ml-2 text-xs ${genderColor.text} opacity-75`}>
                ({getGenderDisplayName(word.gender)})
              </span>
            )}
          </p>
        )}
        {word.pronunciation && (
          <p className={`text-sm italic ${word.hasGender() ? genderColor.text + ' opacity-75' : 'text-gray-500'}`}>
            /{word.pronunciation}/
          </p>
        )}
      </div>

      {!showAnswer ? (
        <div className="text-center">
          <button
            onClick={onShowAnswer}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
          >
            Show Translation
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg sm:text-xl font-semibold text-green-600 mb-4">{word.english}</p>
          {word.exampleSentences.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="font-medium text-gray-700">Example:</h4>
              {word.exampleSentences.slice(0, 2).map((example: ExampleSentence, index: number) => (
                <div key={index} className="text-sm text-gray-600">
                  <p className="italic">{example.german}</p>
                  <p>{example.english}</p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onNext}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
          >
            Next Word
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1">
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
    </div>
  );
};


const VocabularyPractice: React.FC = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [practiceMode, setPracticeMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [vocabularyData, setVocabularyData] = useState<{
    allWords: VocabularyWord[];
    wordsByCategory: Record<string, VocabularyWord[]>;
  }>({ allWords: [], wordsByCategory: {} });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load vocabulary data on component mount
  useEffect(() => {
    try {
      // Try to use the imported data first
      let allWords = A1_VOCABULARY_WORDS || [];
      let wordsByCategory = A1_VOCABULARY_WORDS_BY_CATEGORY || {};

      console.log('Initial data check:', {
        allWordsLength: allWords.length,
        wordsByCategoryKeys: Object.keys(wordsByCategory),
        wordsByCategoryCount: Object.keys(wordsByCategory).length
      });

      // If the imported data is empty, try to load directly
      if (allWords.length === 0 || Object.keys(wordsByCategory).length === 0) {
        console.log('Imported data is insufficient, trying to load directly...');
        const rawVocabulary = loadVocabulary();
        console.log('Raw vocabulary loaded:', rawVocabulary.length, 'items');
        
        // Convert raw vocabulary to VocabularyWord format
        allWords = rawVocabulary.map(item => ({
          id: { value: item.id },
          german: item.german,
          english: item.english,
          type: item.type,
          level: item.level,
          gender: item.gender,
          pronunciation: item.pronunciation,
          tags: item.tags || [],
          frequency: item.frequency,
          exampleSentences: item.examples?.map(ex => ({
            german: ex.german,
            english: ex.english,
            audioUrl: undefined
          })) || [],
          hasGender: () => !!item.gender,
          isNoun: () => item.type === 'noun',
          getFullNoun: () => item.german,
        })) as VocabularyWord[];

        // Group by categories
        wordsByCategory = {};
        allWords.forEach(word => {
          word.tags.forEach(tag => {
            if (!wordsByCategory[tag]) {
              wordsByCategory[tag] = [];
            }
            wordsByCategory[tag].push(word);
          });
        });
        
        console.log('Generated categories:', Object.keys(wordsByCategory));
      }

      console.log('Final data:', {
        allWordsCount: allWords.length,
        categories: Object.keys(wordsByCategory),
        categoryCount: Object.keys(wordsByCategory).length,
        sampleCategories: Object.keys(wordsByCategory).slice(0, 10)
      });

      setVocabularyData({ allWords, wordsByCategory });
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
      // Use fallback empty data
      setVocabularyData({ allWords: [], wordsByCategory: {} });
      setIsDataLoaded(true);
    }
  }, []);

  // Generate available categories dynamically from the loaded data
  const availableCategories = useMemo(() => {
    if (!vocabularyData.wordsByCategory || Object.keys(vocabularyData.wordsByCategory).length === 0) {
      console.log('No categories found in vocabularyData, returning empty array');
      return [];
    }
    
    const categories = Object.keys(vocabularyData.wordsByCategory).filter(
      category => vocabularyData.wordsByCategory[category].length > 0
    ).sort();
    
    console.log('Generated categories:', categories);
    console.log('Category details:', categories.map(cat => ({
      name: cat,
      count: vocabularyData.wordsByCategory[cat].length
    })));
    
    return categories;
  }, [vocabularyData]);

  // Helper function to get category display name with emoji
  const getCategoryDisplayInfo = useCallback((category: string): { name: string; emoji: string } => {
    const categoryMap: Record<string, { name: string; emoji: string }> = {
      'verb': { name: 'Verbs', emoji: '⚡' },
      'adjective': { name: 'Adjectives', emoji: '🎨' },
      'pronoun': { name: 'Pronouns', emoji: '👤' },
      'adverb': { name: 'Adverbs', emoji: '📍' },
      'conjunction': { name: 'Conjunctions', emoji: '🔗' },
      'preposition': { name: 'Prepositions', emoji: '🗺️' },
      'particle': { name: 'Particles', emoji: '💬' },
      'interjection': { name: 'Interjections', emoji: '❗' },
      'article': { name: 'Articles', emoji: '📄' },
      'noun': { name: 'Nouns', emoji: '🏠' },
      'number': { name: 'Numbers', emoji: '🔢' },
      'modal': { name: 'Modal Verbs', emoji: '🎯' },
      'separable': { name: 'Separable Verbs', emoji: '✂️' },
      'question': { name: 'Question Words', emoji: '❓' },
      'greeting': { name: 'Greetings', emoji: '👋' },
      'time': { name: 'Time', emoji: '⏰' },
      'family': { name: 'Family', emoji: '👨‍👩‍👧‍👦' },
      'food': { name: 'Food', emoji: '🍽️' },
      'color': { name: 'Colors', emoji: '🌈' },
      'basic': { name: 'Basic Words', emoji: '📚' },
      'essential': { name: 'Essential', emoji: '⭐' },
      'common': { name: 'Common', emoji: '👍' },
      'irregular': { name: 'Irregular', emoji: '🔄' },
      'personal': { name: 'Personal Pronouns', emoji: '👤' },
      'possessive': { name: 'Possessive', emoji: '🤝' },
      'demonstrative': { name: 'Demonstrative', emoji: '👉' },
      'interrogative': { name: 'Question Words', emoji: '❓' },
      'indefinite': { name: 'Indefinite', emoji: '❔' },
      'reflexive': { name: 'Reflexive', emoji: '🔄' },
      'nominative': { name: 'Nominative Case', emoji: '1️⃣' },
      'accusative': { name: 'Accusative Case', emoji: '2️⃣' },
      'dative': { name: 'Dative Case', emoji: '3️⃣' },
      'genitive': { name: 'Genitive Case', emoji: '4️⃣' },
      'frequency': { name: 'Frequency', emoji: '📊' },
      'place': { name: 'Places', emoji: '🌍' },
      'direction': { name: 'Directions', emoji: '🧭' },
      'quantity': { name: 'Quantity', emoji: '📏' },
      'comparative': { name: 'Comparative', emoji: '📈' },
      'superlative': { name: 'Superlative', emoji: '🏆' },
      'coordinating': { name: 'Coordinating', emoji: '➕' },
      'subordinating': { name: 'Subordinating', emoji: '⬇️' },
      'conversational': { name: 'Conversational', emoji: '💬' },
      'politeness': { name: 'Politeness', emoji: '🙏' },
      'farewell': { name: 'Farewells', emoji: '👋' },
      'response': { name: 'Responses', emoji: '💭' },
      'phrase': { name: 'Phrases', emoji: '💭' },
      'pronominal': { name: 'Pronominal', emoji: '🔤' },
      'intensifier': { name: 'Intensifiers', emoji: '💪' },
      'impersonal': { name: 'Impersonal', emoji: '🔘' },
      'two-way': { name: 'Two-way Prepositions', emoji: '↔️' },
    };

    // Return the mapped info or create a default one
    if (categoryMap[category]) {
      return categoryMap[category];
    }
    
    // Create a default display info for unmapped categories
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      emoji: '🔤'
    };
  }, []);

  const initializePractice = useCallback(() => {
    let wordsToStudy: VocabularyWord[];
    
    if (selectedCategory === 'all') {
      wordsToStudy = [...vocabularyData.allWords];
    } else {
      wordsToStudy = vocabularyData.wordsByCategory[selectedCategory] ? [...vocabularyData.wordsByCategory[selectedCategory]] : [];
    }
    
    console.log(`Initializing practice with category "${selectedCategory}": ${wordsToStudy.length} words`);
    
    // Shuffle words
    const shuffled = wordsToStudy.sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 20)); // Limit to 20 words per session
    setCurrentWordIndex(0);
    setShowAnswer(false);
  }, [selectedCategory, vocabularyData]);

  useEffect(() => {
    initializePractice();
  }, [initializePractice]);

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      // Session complete, restart
      initializePractice();
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleStudy = () => {
    setTimeout(() => {
      handleNextWord();
    }, 2000);
  };

  if (!isDataLoaded || words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">German Vocabulary Practice</h1>
          
          {/* Category Selector */}
          <div className="flex justify-center mb-6">
            <select
              value={selectedCategory as string}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
            >
              <option value="all">📚 All Categories ({vocabularyData.allWords.length} words)</option>
              {availableCategories.length === 0 ? (
                <option disabled>No categories available</option>
              ) : (
                availableCategories.map(category => {
                  const { name, emoji } = getCategoryDisplayInfo(category);
                  const wordCount = vocabularyData.wordsByCategory[category]?.length || 0;
                  console.log(`Category "${category}": ${wordCount} words`);
                  return (
                    <option key={category} value={category}>
                      {emoji} {name} ({wordCount})
                    </option>
                  );
                })
              )}
            </select>
          </div>
          
          {/* Debug info (remove in production) */}
          {availableCategories.length === 0 && (
            <div className="text-red-600 text-sm mb-4">
              Debug: No categories loaded. Check console for details.
            </div>
          )}

          {/* Practice Mode Toggle */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6">
            <button
              onClick={() => setPracticeMode('quiz')}
              className={`w-full sm:w-auto px-6 py-3 rounded-md transition-colors font-medium ${
                practiceMode === 'quiz'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
              }`}
            >
              🧩 Quiz Mode
            </button>
            <button
              onClick={() => setPracticeMode('flashcards')}
              className={`w-full sm:w-auto px-6 py-3 rounded-md transition-colors font-medium ${
                practiceMode === 'flashcards'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
              }`}
            >
              📚 Flashcard Mode
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {currentWordIndex + 1} / {words.length}</span>
            <span>Learning Mode</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Vocabulary Card */}
        <div className="mb-8">
          {practiceMode === 'quiz' ? (
            <VocabularyCard 
              word={currentWord}
              onStudy={handleStudy}
              showAnswer={showAnswer}
            />
          ) : (
            <VocabularyFlashcard 
              word={currentWord}
              showAnswer={showAnswer}
              onNext={handleNextWord}
              onShowAnswer={handleShowAnswer}
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={initializePractice}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Restart Session
          </button>
        </div>

        {/* Word Type Legend */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Word Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">articles</span>
              <span className="text-gray-600">der, die, das</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">verbs</span>
              <span className="text-gray-600">actions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">adjectives</span>
              <span className="text-gray-600">descriptive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPractice;
