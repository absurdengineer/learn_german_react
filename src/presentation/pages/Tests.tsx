import React from 'react';
import { useTests } from '../../hooks/useTests';
import TestResults from '../components/TestResults';
import TestSession from '../components/TestSession';
import PageLayout from '../components/layout/PageLayout';
import {
  GradientCard,
  QuickActionCard,
  SectionHeader,
  StatsCard,
  TestTypeCard,
} from '../components/ui';

const Tests: React.FC = () => {
  const {
    sessionMode,
    dataStats,
    startTest,
    generateA1Test,
    generateVocabularyTest,
    generateArticlesTest,
    generateGrammarTest,
  } = useTests();

  if (sessionMode === 'session') {
    return <TestSession />;
  }

  if (sessionMode === 'results') {
    return <TestResults />;
  }

  const explanationBanner = (
    <GradientCard gradient="blue-purple" className="border border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="text-3xl">🧪</div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            Standardized A1 German Test System
          </h3>
          <p className="mb-2">
            Our <strong>unified test generator</strong> draws from standardized vocabulary, articles, and grammar data
            to create comprehensive assessments. Each test is <strong>dynamically generated</strong> for unique practice every time!
          </p>
          <p className="text-sm opacity-90">
            ✨ Built with {dataStats.vocabulary.total} vocabulary words, {dataStats.articles.total} article patterns, 
            and {dataStats.grammarLessons.total + dataStats.grammarPractice.total} grammar exercises for complete A1 coverage.
          </p>
        </div>
      </div>
    </GradientCard>
  );

  return (
    <PageLayout pageData={{
      title: 'German A1 Tests',
      subtitle: 'Test your knowledge with dynamic, adaptive questions',
      description: 'Comprehensive testing across vocabulary, grammar, and articles',
      icon: '🧪',
      gradient: 'from-blue-500 to-purple-600',
    }}
    bannerContent={explanationBanner}
    >

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        <SectionHeader 
          title="Quick Start Tests"
          subtitle="Jump right into practice with these popular test formats"
          className="mb-6 sm:mb-8"
          size="md"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <QuickActionCard
            title="Quick Test"
            description="10 mixed questions for rapid assessment"
            icon="⚡"
            color="from-green-500 to-teal-600"
            onClick={() => startTest(generateA1Test, 10, 'quick')}
          />
          
          <QuickActionCard
            title="Standard Test"
            description="20 questions covering all A1 topics"
            icon="🎯"
            color="from-blue-500 to-purple-600"
            onClick={() => startTest(generateA1Test, 20, 'standard')}
          />
          
          <QuickActionCard
            title="Comprehensive Test"
            description="30 questions for thorough evaluation"
            icon="🚀"
            color="from-purple-500 to-pink-600"
            onClick={() => startTest(generateA1Test, 30, 'comprehensive')}
          />
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 sm:p-8 mb-8 sm:mb-12 border border-yellow-200">
          <SectionHeader 
            title="🎭 Specialized Tests"
            subtitle="Focus on Specific Skills"
            description="Target specific areas where you want to improve your A1 German skills"
            className="mb-6 sm:mb-8"
            size="md"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <TestTypeCard
              title="Vocabulary Test"
              description="Focus on German-English word translations"
              icon="📚"
              onStart={(count) => startTest(generateVocabularyTest, count, 'vocabulary')}
            />
            <TestTypeCard
              title="Articles Test"
              description="Master der, die, das with targeted practice"
              icon="🎯"
              onStart={(count) => startTest(generateArticlesTest, count, 'articles')}
            />
            <TestTypeCard
              title="Grammar Test"
              description="Test your knowledge of German grammar rules"
              icon="📝"
              onStart={(count) => startTest(generateGrammarTest, count, 'grammar')}
            />
          </div>
        </div>

        <SectionHeader 
          title="📊 Test Coverage"
          subtitle="Comprehensive question database"
          className="mb-6 sm:mb-8"
          size="md"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatsCard
            title="Vocabulary"
            value={`${dataStats.vocabulary.total}+`}
            subtitle="test questions"
            icon="📚"
          />
          <StatsCard
            title="Articles"
            value={`${dataStats.articles.total}+`}
            subtitle="test questions"
            icon="🎯"
          />
          <StatsCard
            title="Grammar"
            value={`${dataStats.grammarLessons.total + dataStats.grammarPractice.total}+`}
            subtitle="test questions"
            icon="📝"
          />
          <StatsCard
            title="Unique Tests"
            value="∞"
            subtitle="never repeat"
            icon="🔄"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Tests;