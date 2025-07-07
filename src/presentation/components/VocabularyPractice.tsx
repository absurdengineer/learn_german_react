import React, { useCallback, useEffect, useState } from 'react';
import { A1_VOCABULARY, A1_VOCABULARY_BY_CATEGORY } from '../../data/vocabulary';
import { ExampleSentence, VocabularyWord } from '../../domain/entities/Vocabulary.js';

interface VocabularyCardProps {
  word: VocabularyWord;
  onStudy: (word: VocabularyWord, isCorrect: boolean) => void;
  showAnswer: boolean;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onStudy, showAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

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
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{word.german}</h3>
        {word.isNoun() && word.hasGender() && (
          <p className="text-sm text-gray-600 mb-2">{word.getFullNoun()}</p>
        )}
        {word.pronunciation && (
          <p className="text-sm text-gray-500 italic">/{word.pronunciation}/</p>
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
          <p className="text-xl font-semibold text-green-600 mb-4">{word.english}</p>
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
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState<'all' | keyof typeof A1_VOCABULARY_BY_CATEGORY>('all');
  const [practiceMode, setPracticeMode] = useState<'flashcards' | 'quiz'>('quiz');

  const initializePractice = useCallback(() => {
    let wordsToStudy: VocabularyWord[];
    
    if (selectedCategory === 'all') {
      wordsToStudy = [...A1_VOCABULARY];
    } else {
      wordsToStudy = [...A1_VOCABULARY_BY_CATEGORY[selectedCategory]];
    }
    
    // Shuffle words
    const shuffled = wordsToStudy.sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 20)); // Limit to 20 words per session
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setStats({ correct: 0, total: 0 });
  }, [selectedCategory]);

  useEffect(() => {
    initializePractice();
  }, [initializePractice]);

  const handleStudy = (_word: VocabularyWord, isCorrect: boolean) => {
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Move to next word after delay
    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        // Session complete
        alert(`Session complete! Score: ${stats.correct + (isCorrect ? 1 : 0)}/${stats.total + 1}`);
        initializePractice();
      }
    }, 2000);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  if (words.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">German Vocabulary Practice</h1>
          
          {/* Category Selector */}
          <div className="flex justify-center mb-6">
            <select
              value={selectedCategory as string}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | keyof typeof A1_VOCABULARY_BY_CATEGORY)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Practice Mode Toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setPracticeMode('quiz')}
              className={`px-4 py-2 rounded-md transition-colors ${
                practiceMode === 'quiz'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Quiz Mode
            </button>
            <button
              onClick={() => setPracticeMode('flashcards')}
              className={`px-4 py-2 rounded-md transition-colors ${
                practiceMode === 'flashcards'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Flashcard Mode
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {currentWordIndex + 1} / {words.length}</span>
            <span>Score: {stats.correct} / {stats.total}</span>
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
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentWord.german}</h3>
                {showAnswer && (
                  <div className="space-y-4">
                    <p className="text-xl text-green-600">{currentWord.english}</p>
                    {currentWord.exampleSentences.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Example:</h4>
                        <div className="text-sm text-gray-600">
                          <p className="italic">{currentWord.exampleSentences[0].german}</p>
                          <p>{currentWord.exampleSentences[0].english}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {practiceMode === 'flashcards' && !showAnswer && (
            <button
              onClick={handleShowAnswer}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Show Answer
            </button>
          )}
          
          {(practiceMode === 'flashcards' && showAnswer) && (
            <div className="flex gap-4">
              <button
                onClick={() => handleStudy(currentWord, false)}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Need Practice
              </button>
              <button
                onClick={() => handleStudy(currentWord, true)}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Know It!
              </button>
            </div>
          )}
          
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
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">nouns</span>
              <span className="text-gray-600">people, things</span>
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
