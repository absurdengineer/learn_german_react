import React, { useState } from 'react';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import ArticlesLearning from '../components/ArticlesLearning';
import ArticlesPractice from '../components/ArticlesPractice';
import SessionResults from '../components/SessionResults';

interface ArticlesSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: VocabularyWord[];
  mistakes: Array<{
    word: VocabularyWord;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

const Articles: React.FC<{ mainRef?: React.RefObject<HTMLElement> }> = ({ mainRef }) => {
  const [sessionMode, setSessionMode] = useState<'menu' | 'practice' | 'learning' | 'results'>('menu');
  const [sessionResults, setSessionResults] = useState<ArticlesSessionResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sessionLength, setSessionLength] = useState(20);
  const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);

  const handleStartPractice = (category: string = '', length: number = 20) => {
    setSelectedCategory(category);
    setSessionLength(length);
    setReviewWords([]); // Clear review words when starting a new session
    setSessionMode('practice');
  };

  const handleStartLearning = (category: string = '', length: number = 30) => {
    setSelectedCategory(category);
    setSessionLength(length);
    setSessionMode('learning');
  };

  const handleSessionComplete = (results: ArticlesSessionResult) => {
    setSessionResults(results);
    setSessionMode('results');
  };

  const handleSessionExit = () => {
    setSessionMode('menu');
    setSessionResults(null);
  };

  const handleRestart = () => {
    handleStartPractice(selectedCategory, sessionLength);
  };

  const handleReviewMistakes = () => {
    if (sessionResults && sessionResults.mistakes.length > 0) {
      const mistakenWords = sessionResults.mistakes.map((mistake) => mistake.word);
      setReviewWords(mistakenWords);
      setSessionMode('practice');
    }
  };

  // Practice mode rendering
  if (sessionMode === 'practice') {
    return (
      <ArticlesPractice
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
        sessionLength={sessionLength}
        focusCategory={selectedCategory}
        showCategoryFilter={!!selectedCategory}
        mainRef={mainRef}
        reviewWords={reviewWords}
      />
    );
  }

  // Learning mode rendering
  if (sessionMode === 'learning') {
    return (
      <ArticlesLearning
        onExit={handleSessionExit}
        sessionLength={sessionLength}
        focusCategory={selectedCategory}
        mainRef={mainRef}
      />
    );
  }

  // Results mode rendering
  if (sessionMode === 'results' && sessionResults) {
    return (
      <SessionResults
        results={sessionResults}
        sessionType="multiple-choice"
        onRestart={handleRestart}
        onReviewMistakes={handleReviewMistakes}
        onExit={handleSessionExit}
        mainRef={mainRef}
      />
    );
  }

  // Menu mode rendering
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            German Articles 🎯
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Master der, die, das with the 80-20 rule
          </p>
          <p className="text-lg text-gray-500">
            Focus on the most essential nouns for A1 exam success
          </p>
        </div>

        {/* 80-20 Rule Explanation */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                80-20 Rule for German Articles
              </h3>
              <p className="text-yellow-700 mb-2">
                Research shows that <strong>20% of German nouns</strong> account for <strong>80% of daily usage</strong>. 
                By mastering these essential words, you'll handle most A1 exam situations with confidence!
              </p>
              <p className="text-sm text-yellow-600">
                ✨ We've curated 200+ high-frequency nouns that appear most often in A1 exams and real conversations.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Practice</h3>
              <p className="text-gray-600 mb-4">
                20 random essential words for quick practice
              </p>
              <button
                onClick={() => handleStartPractice('', 20)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Intensive Session</h3>
              <p className="text-gray-600 mb-4">
                50 words for comprehensive practice
              </p>
              <button
                onClick={() => handleStartPractice('', 50)}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Start Intensive
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Speed Round</h3>
              <p className="text-gray-600 mb-4">
                10 words for quick review
              </p>
              <button
                onClick={() => handleStartPractice('', 10)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Speed Practice
              </button>
            </div>
          </div>
        </div>

        {/* Learning Mode Options */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
            📚 Learning Mode - Study with Colors
          </h3>
          <p className="text-center text-indigo-700 mb-6">
            See articles with their gender colors automatically - perfect for visual learners!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-bold text-gray-900 mb-2">Visual Learning</h4>
                <p className="text-sm text-gray-600 mb-4">
                  30 words with auto-advance and color coding
                </p>
                <button
                  onClick={() => handleStartLearning('', 30)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Start Learning
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <h4 className="font-bold text-gray-900 mb-2">Color Memory</h4>
                <p className="text-sm text-gray-600 mb-4">
                  50 words for intensive color association
                </p>
                <button
                  onClick={() => handleStartLearning('', 50)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Deep Learning
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-gray-900 mb-2">Quick Review</h4>
                <p className="text-sm text-gray-600 mb-4">
                  20 words for fast visual review
                </p>
                <button
                  onClick={() => handleStartLearning('', 20)}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  Quick Learn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category-Based Practice */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Study by Category
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Choose practice mode or learning mode for each category
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'family', icon: '👨‍👩‍👧‍👦', label: 'Family' },
              { name: 'people', icon: '👥', label: 'People' },
              { name: 'occupations', icon: '💼', label: 'Jobs' },
              { name: 'food', icon: '🍽️', label: 'Food' },
              { name: 'places', icon: '🏢', label: 'Places' },
              { name: 'time', icon: '⏰', label: 'Time' },
              { name: 'furniture', icon: '🪑', label: 'Furniture' },
              { name: 'transport', icon: '🚗', label: 'Transport' },
              { name: 'technology', icon: '💻', label: 'Technology' },
              { name: 'body', icon: '👤', label: 'Body' },
              { name: 'clothing', icon: '👕', label: 'Clothing' },
              { name: 'animals', icon: '🐕', label: 'Animals' },
            ].map((category) => (
              <div
                key={category.name}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-700 mb-3">{category.label}</div>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => handleStartLearning(category.name, 20)}
                    className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => handleStartPractice(category.name, 15)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 rounded-lg p-6 text-center border border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-2">68</div>
            <div className="text-sm text-blue-600 font-medium">DER words</div>
            <div className="text-xs text-blue-500">masculine nouns</div>
          </div>
          <div className="bg-pink-100 rounded-lg p-6 text-center border border-pink-200">
            <div className="text-3xl font-bold text-pink-700 mb-2">74</div>
            <div className="text-sm text-pink-600 font-medium">DIE words</div>
            <div className="text-xs text-pink-500">feminine nouns</div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6 text-center border border-gray-400">
            <div className="text-3xl font-bold text-gray-900 mb-2">58</div>
            <div className="text-sm text-gray-700 font-medium">DAS words</div>
            <div className="text-xs text-gray-600">neuter nouns</div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            💡 Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">1.</div>
                <div className="text-gray-700">
                  <strong>Focus on patterns:</strong> Many words ending in -ung, -heit, -keit are feminine (die)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">2.</div>
                <div className="text-gray-700">
                  <strong>Practice daily:</strong> 10-15 minutes of consistent practice beats cramming
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">3.</div>
                <div className="text-gray-700">
                  <strong>Use mnemonics:</strong> Create memorable associations with each word
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">4.</div>
                <div className="text-gray-700">
                  <strong>Review mistakes:</strong> Focus extra attention on words you get wrong
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">5.</div>
                <div className="text-gray-700">
                  <strong>Think in phrases:</strong> Learn "der Tisch" as one unit, not separately
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold">6.</div>
                <div className="text-gray-700">
                  <strong>Use in context:</strong> Try to use new words in sentences
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
