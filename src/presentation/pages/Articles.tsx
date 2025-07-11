import React, { useMemo, useState } from 'react';
import { loadArticleCategories } from '../../data';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import { shuffleArray } from '../../utils/testGenerator';
import ArticlesLearning from '../components/ArticlesLearning';
import ArticlesPractice from '../components/ArticlesPractice';
import SessionResults from '../components/SessionResults';
import { GradientCard, PageHero } from '../components/ui';

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

const categoryIcons: Record<string, string> = {
  people: '👥',
  time: '⏰',
  work: '💼',
  transport: '🚗',
  living: '🏠',
  food_drink: '🍽️',
  education: '🎓',
  communication: '💬',
  personal_info: 'ℹ️',
  geography: '🌍',
  animals: '🐕',
  body: '👤',
  media: '📰',
  shopping: '🛒',
  leisure: '🎉',
  health: '❤️',
  nature: '🌳',
  public_service: '🏢',
  money: '💰',
  everyday_objects: '🔑',
  accessories: '👓',
  abstract: '🤔',
  default: '📚',
};

const Articles: React.FC = () => {
  const [sessionMode, setSessionMode] = useState<'menu' | 'practice' | 'learning' | 'results'>('menu');
  const [sessionResults, setSessionResults] = useState<ArticlesSessionResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sessionLength, setSessionLength] = useState(20);
  const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);

  const articleCategories = useMemo(() => {
    const categories = loadArticleCategories();
    return Object.values(categories).map(category => ({
      ...category,
      icon: categoryIcons[category.name] || categoryIcons.default,
    }));
  }, []);

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
      const shuffledWords = shuffleArray([...mistakenWords]);
      setReviewWords(shuffledWords);
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
      />
    );
  }

  // Results mode rendering
  if (sessionMode === 'results' && sessionResults) {
    const resultsForDisplay = {
      ...sessionResults,
      mistakes: sessionResults.mistakes.map(m => ({
        question: `What is the article for "${m.word.german}"?`,
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
        word: m.word,
      })),
    };
    return (
      <SessionResults
        results={resultsForDisplay}
        sessionType="multiple-choice"
        onRestart={handleRestart}
        onReviewMistakes={handleReviewMistakes}
        onExit={handleSessionExit}
      />
    );
  }

  // Menu mode rendering
  const explanationBanner = (
    <GradientCard gradient="yellow-orange" className="border border-yellow-200">
      <div className="flex items-start space-x-4">
        <div className="text-3xl">🎯</div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            80-20 Rule for German Articles
          </h3>
          <p className="mb-2">
            Research shows that <strong>20% of German nouns</strong> account for <strong>80% of daily usage</strong>. 
            By mastering these essential words, you'll handle most A1 exam situations with confidence!
          </p>
          <p className="text-sm opacity-90">
            ✨ We've curated 200+ high-frequency nouns that appear most often in A1 exams and real conversations.
          </p>
        </div>
      </div>
    </GradientCard>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="German Articles"
        subtitle="Master der, die, das with the 80-20 rule"
        description="Focus on the most essential nouns for A1 exam success"
        icon="🎯"
        bannerContent={explanationBanner}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        {/* Quick Start Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Quick Practice</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                20 random essential words for quick practice
              </p>
              <button
                onClick={() => handleStartPractice('', 20)}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Start Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💪</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Intensive Session</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                50 words for comprehensive practice
              </p>
              <button
                onClick={() => handleStartPractice('', 50)}
                className="w-full bg-purple-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Start Intensive
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Speed Round</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                10 words for quick review
              </p>
              <button
                onClick={() => handleStartPractice('', 10)}
                className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Speed Practice
              </button>
            </div>
          </div>
        </div>

        {/* Learning Mode Options */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-indigo-200">
          <h3 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-3 sm:mb-4 text-center">
            📚 Learning Mode - Study with Colors
          </h3>
          <p className="text-center text-indigo-700 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            See articles with their gender colors automatically - perfect for visual learners!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">🧠</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Visual Learning</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  30 words with auto-advance and color coding
                </p>
                <button
                  onClick={() => handleStartLearning('', 30)}
                  className="w-full bg-indigo-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                >
                  Start Learning
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">🎨</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Color Memory</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  50 words for intensive color association
                </p>
                <button
                  onClick={() => handleStartLearning('', 50)}
                  className="w-full bg-purple-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                >
                  Deep Learning
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Quick Review</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  20 words for fast visual review
                </p>
                <button
                  onClick={() => handleStartLearning('', 20)}
                  className="w-full bg-teal-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-teal-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                >
                  Quick Learn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category-Based Practice */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            Study by Category
          </h3>
          <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            Choose practice mode or learning mode for each category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {articleCategories.map((category) => (
              <div
                key={category.name}
                className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-xl sm:text-2xl mb-2">{category.icon}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 mb-3 capitalize text-center leading-tight">
                  {category.name.replace(/_/g, ' ')}
                </div>
                <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                  <button
                    onClick={() => handleStartLearning(category.name, 20)}
                    className="text-xs bg-indigo-500 text-white px-2 py-1.5 rounded hover:bg-indigo-600 transition-colors font-medium touch-manipulation"
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => handleStartPractice(category.name, 15)}
                    className="text-xs bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 transition-colors font-medium touch-manipulation"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-blue-100 rounded-lg p-4 sm:p-6 text-center border border-blue-200">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1 sm:mb-2">68</div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium">DER words</div>
            <div className="text-xs text-blue-500">masculine nouns</div>
          </div>
          <div className="bg-pink-100 rounded-lg p-4 sm:p-6 text-center border border-pink-200">
            <div className="text-2xl sm:text-3xl font-bold text-pink-700 mb-1 sm:mb-2">74</div>
            <div className="text-xs sm:text-sm text-pink-600 font-medium">DIE words</div>
            <div className="text-xs text-pink-500">feminine nouns</div>
          </div>
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6 text-center border border-gray-400">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">58</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium">DAS words</div>
            <div className="text-xs text-gray-600">neuter nouns</div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
            💡 Tips for Success
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">1.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Focus on patterns:</strong> Many words ending in -ung, -heit, -keit are feminine (die)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">2.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Practice daily:</strong> 10-15 minutes of consistent practice beats cramming
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">3.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Use mnemonics:</strong> Create memorable associations with each word
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">4.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Review mistakes:</strong> Focus extra attention on words you get wrong
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">5.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Think in phrases:</strong> Learn "der Tisch" as one unit, not separately
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">6.</div>
                <div className="text-gray-700 text-sm sm:text-base">
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
