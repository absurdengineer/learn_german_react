import React, { useMemo, useState } from 'react';
import { loadArticleCategories } from '../../data';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import ArticlesLearning from '../components/ArticlesLearning';
import ArticlesPractice from '../components/ArticlesPractice';
import PracticeSessionResults from '../components/PracticeSessionResults';
import {
    CategoryFilter,
    GradientCard,
    PageHero,
    PracticeModeCard,
    SectionHeader
} from '../components/ui';

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

const ArticlesRefactored: React.FC = () => {
  const [sessionMode, setSessionMode] = useState<'menu' | 'practice' | 'learning' | 'results'>('menu');
  const [sessionResults, setSessionResults] = useState<ArticlesSessionResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sessionLength, setSessionLength] = useState<number>(20);
  const [reviewWords, setReviewWords] = useState<VocabularyWord[]>([]);

  const articleCategories = useMemo(() => {
    return loadArticleCategories();
  }, []);

  const availableCategories = useMemo(() => {
    return Object.keys(articleCategories);
  }, [articleCategories]);

  const handleStartPractice = (category: string, length: number) => {
    setSelectedCategory(category);
    setSessionLength(length);
    setSessionMode('practice');
  };

  const handleStartLearning = (category: string, length: number) => {
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
    setSelectedCategory('');
    setSessionResults(null);
    setReviewWords([]);
  };

  const handleRestart = () => {
    setSessionMode('practice');
  };

  const handleReviewMistakes = () => {
    if (sessionResults) {
      const mistakeWords = sessionResults.mistakes.map(mistake => mistake.word);
      setReviewWords(mistakeWords);
      setSessionLength(mistakeWords.length);
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
    return (
      <PracticeSessionResults
        results={sessionResults}
        sessionType="multiple-choice"
        onRestart={handleRestart}
        onReviewMistakes={handleReviewMistakes}
        onExit={handleSessionExit}
      />
    );
  }

  // Menu mode rendering - REFACTORED VERSION
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
        {/* Quick Start Options - Using PracticeModeCard components */}
        <SectionHeader
          title="Quick Start"
          subtitle="Jump into practice or learning mode"
          size="md"
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PracticeModeCard
            title="Quick Practice"
            description="20 random essential words for quick practice"
            icon="🚀"
            buttonText="Start Now"
            onStart={() => handleStartPractice('', 20)}
            color="blue"
          />

          <PracticeModeCard
            title="Intensive Session"
            description="50 words for comprehensive practice"
            icon="💪"
            buttonText="Start Intensive"
            onStart={() => handleStartPractice('', 50)}
            color="purple"
          />

          <PracticeModeCard
            title="Speed Round"
            description="10 words for quick review"
            icon="⚡"
            buttonText="Speed Practice"
            onStart={() => handleStartPractice('', 10)}
            color="green"
          />
        </div>

        {/* Learning Mode Options */}
        <SectionHeader
          title="Learning Mode"
          subtitle="Study with visual flashcards and audio"
          size="md"
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PracticeModeCard
            title="Quick Review"
            description="20 words for fast visual review"
            icon="⚡"
            buttonText="Quick Learn"
            onStart={() => handleStartLearning('', 20)}
            color="teal"
          />

          <PracticeModeCard
            title="Deep Study"
            description="40 words with detailed examples"
            icon="📚"
            buttonText="Start Learning"
            onStart={() => handleStartLearning('', 40)}
            color="indigo"
          />

          <PracticeModeCard
            title="Comprehensive"
            description="60 words for thorough mastery"
            icon="🎓"
            buttonText="Master All"
            onStart={() => handleStartLearning('', 60)}
            color="purple"
          />
        </div>

        {/* Category-Based Practice - Using CategoryFilter */}
        <SectionHeader
          title="Study by Category"
          subtitle="Choose practice mode or learning mode for each category"
          size="md"
          className="mb-6"
        />

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <CategoryFilter
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categoryIcons={categoryIcons}
            showAllOption={false}
            className="mb-6"
          />
          
          {selectedCategory && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PracticeModeCard
                title={`${selectedCategory.replace(/_/g, ' ')} Practice`}
                description="Practice articles for this category"
                icon={categoryIcons[selectedCategory] || '📚'}
                buttonText="Practice"
                onStart={() => handleStartPractice(selectedCategory, 15)}
                color="blue"
                className="flex-1 max-w-sm"
              />
              
              <PracticeModeCard
                title={`${selectedCategory.replace(/_/g, ' ')} Learning`}
                description="Learn words in this category"
                icon={categoryIcons[selectedCategory] || '📚'}
                buttonText="Learn"
                onStart={() => handleStartLearning(selectedCategory, 20)}
                color="green"
                className="flex-1 max-w-sm"
              />
            </div>
          )}
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradientCard gradient="blue-purple">
            <div className="text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Smart Practice</h3>
              <p className="opacity-90">
                Our algorithm focuses on words you find challenging, optimizing your learning efficiency.
              </p>
            </div>
          </GradientCard>

          <GradientCard gradient="green-blue">
            <div className="text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="opacity-90">
                Monitor your improvement with detailed statistics and achievement tracking.
              </p>
            </div>
          </GradientCard>
        </div>
      </div>
    </div>
  );
};

export default ArticlesRefactored;
