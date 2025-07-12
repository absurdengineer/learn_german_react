import React from 'react';
import { useArticles } from '../hooks/useArticles';
import ArticlesLearning from '../components/ArticlesLearning';
import ArticlesPractice from '../components/ArticlesPractice';
import SessionResults from '../components/SessionResults';
import PageLayout from '../components/layout/PageLayout';
import SectionGrid from '../components/layout/SectionGrid';
import { CategoryCard } from '../components/CategoryCard';
import { PracticeCard } from '../components/PracticeCard';
import { GradientCard, StatCard } from '../components';
import type { ArticlesSessionResult } from '../hooks/useArticles';

const Articles: React.FC = () => {
  const {
    sessionMode,
    sessionResults,
    selectedCategory,
    sessionLength,
    reviewWords,
    articleCategories,
    handleStartPractice,
    handleStartLearning,
    handleSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  } = useArticles();

  if (sessionMode === 'practice') {
    return (
      <ArticlesPractice
        onComplete={handleSessionComplete as (results: ArticlesSessionResult) => void}
        onExit={handleSessionExit}
        sessionLength={sessionLength}
        focusCategory={selectedCategory}
        showCategoryFilter={!!selectedCategory}
        reviewWords={reviewWords}
      />
    );
  }

  if (sessionMode === 'learning') {
    return (
      <ArticlesLearning
        onExit={handleSessionExit}
        sessionLength={sessionLength}
        focusCategory={selectedCategory}
      />
    );
  }

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

  const practiceModes = [
    {
      title: 'Quick Practice',
      description: '20 random essential words',
      icon: '🚀',
      buttonText: 'Start Now',
      color: 'bg-blue-600',
      onClick: () => handleStartPractice('', 20),
    },
    {
      title: 'Intensive Session',
      description: '50 words for comprehensive practice',
      icon: '💪',
      buttonText: 'Start Intensive',
      color: 'bg-purple-600',
      onClick: () => handleStartPractice('', 50),
    },
    {
      title: 'Speed Round',
      description: '10 words for quick review',
      icon: '⚡',
      buttonText: 'Speed Practice',
      color: 'bg-green-600',
      onClick: () => handleStartPractice('', 10),
    },
  ];

  const learningModes = [
    {
      title: 'Visual Learning',
      description: '30 words with auto-advance',
      icon: '🧠',
      buttonText: 'Start Learning',
      color: 'bg-indigo-600',
      onClick: () => handleStartLearning('', 30),
    },
    {
      title: 'Color Memory',
      description: '50 words for intensive association',
      icon: '🎨',
      buttonText: 'Deep Learning',
      color: 'bg-purple-600',
      onClick: () => handleStartLearning('', 50),
    },
    {
      title: 'Quick Review',
      description: '20 words for fast visual review',
      icon: '⚡',
      buttonText: 'Quick Learn',
      color: 'bg-teal-600',
      onClick: () => handleStartLearning('', 20),
    },
  ];

  const stats = [
    {
      label: 'DER words',
      value: '68',
      subtitle: 'masculine nouns',
      color: 'text-blue-600',
    },
    {
      label: 'DIE words',
      value: '74',
      subtitle: 'feminine nouns',
      color: 'text-pink-600',
    },
    {
      label: 'DAS words',
      value: '58',
      subtitle: 'neuter nouns',
      color: 'text-gray-700',
    },
  ];

  return (
    <PageLayout
      pageData={{
        title: 'German Articles',
        subtitle: 'Master der, die, das with the 80-20 rule',
        description: 'Focus on the most essential nouns for A1 exam success',
        icon: '🎯',
        gradient: 'from-yellow-400 to-orange-500',
      }}
      bannerContent={explanationBanner}
    >

      <div className="space-y-8">
        <SectionGrid title="Practice Modes">
          {practiceModes.map((mode, index) => (
            <PracticeCard
              key={index}
              title={mode.title}
              description={mode.description}
              icon={mode.icon}
              buttonText={mode.buttonText}
              color={mode.color}
              onClick={mode.onClick}
            />
          ))}
        </SectionGrid>

        <SectionGrid title="Learning Modes">
          {learningModes.map((mode, index) => (
            <PracticeCard
              key={index}
              title={mode.title}
              description={mode.description}
              icon={mode.icon}
              buttonText={mode.buttonText}
              color={mode.color}
              onClick={mode.onClick}
            />
          ))}
        </SectionGrid>

        <SectionGrid title="Study by Category" columns={6}>
          {articleCategories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              onLearn={() => handleStartLearning(category.name, 20)}
              onPractice={() => handleStartPractice(category.name, 15)}
            />
          ))}
        </SectionGrid>

        <SectionGrid title="Article Statistics">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              color={stat.color}
            />
          ))}
        </SectionGrid>
      </div>
    </PageLayout>
  );
};

export default Articles;