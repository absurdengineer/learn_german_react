import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SESSION_KEYS, SessionManager } from '../../utils/sessionManager';
import {
    generateA1Test,
} from '../../utils/testGenerator';
import {
    StandardizedTestGenerator,
    getDataStatistics,
} from '../../data/standardized';
import TestResults from '../components/TestResults';
import TestSession from '../components/TestSession';
import { GradientCard, PageHero } from '../components/ui';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface TestData {
  id: string;
  title: string;
  type: string;
  questions: Question[];
}

type TestGenerator = (count: number) => TestData;

// Wrapper functions to convert standardized tests to legacy format
const generateVocabularyTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateVocabularyTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

const generateArticlesTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateArticlesTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

const generateGrammarTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateGrammarTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

const Tests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testType } = useParams<{ testType?: string }>();

  // Determine current mode from URL
  const getCurrentMode = useCallback((): 'menu' | 'session' | 'results' => {
    const pathname = location.pathname;
    if (pathname.includes('/results')) return 'results';
    if (pathname.includes('/session')) return 'session';
    return 'menu';
  }, [location.pathname]);

  const [sessionMode, setSessionMode] = useState<'menu' | 'session' | 'results'>(getCurrentMode());

  // Update mode when URL changes
  useEffect(() => {
    const mode = getCurrentMode();
    setSessionMode(mode);
  }, [location.pathname, getCurrentMode]);

  // Get statistics from standardized data
  const dataStats = getDataStatistics();

  const startTest = (generator: TestGenerator, count: number, type: string) => {
    const test = generator(count);
    
    // Set session data
    const sessionData = {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: 'test' as const,
      mode: type,
      config: { count, testType: type }
    };
    SessionManager.setSession(SESSION_KEYS.TEST, sessionData);
    
    // Navigate to session with test data
    if (testType) {
      navigate(`/tests/${testType}/session`, { state: { test } });
    } else {
      navigate('/tests/session', { state: { test } });
    }
  };

  // Session mode rendering
  if (sessionMode === 'session') {
    return <TestSession />;
  }

  // Results mode rendering
  if (sessionMode === 'results') {
    return <TestResults />;
  }

  // Menu mode rendering
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
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="German A1 Tests"
        subtitle="Test your knowledge with dynamic, adaptive questions"
        description="Comprehensive testing across vocabulary, grammar, and articles"
        icon="🧪"
        bannerContent={explanationBanner}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        {/* Quick Start Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Quick Test</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                10 mixed questions for rapid assessment
              </p>
              <button
                onClick={() => startTest(generateA1Test, 10, 'quick')}
                className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Start Quick Test
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Standard Test</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                20 questions covering all A1 topics
              </p>
              <button
                onClick={() => startTest(generateA1Test, 20, 'standard')}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Start Standard Test
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Comprehensive Test</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                30 questions for thorough evaluation
              </p>
              <button
                onClick={() => startTest(generateA1Test, 30, 'comprehensive')}
                className="w-full bg-purple-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base touch-manipulation"
              >
                Start Comprehensive
              </button>
            </div>
          </div>
        </div>

        {/* Specialized Tests */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-yellow-200">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-900 mb-3 sm:mb-4 text-center">
            🎭 Specialized Tests - Focus on Specific Skills
          </h3>
          <p className="text-center text-yellow-700 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            Target specific areas where you want to improve your A1 German skills
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">📚</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Vocabulary Test</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Focus on German-English word translations
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => startTest(generateVocabularyTest, 15, 'vocabulary')}
                    className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    15 Questions
                  </button>
                  <button
                    onClick={() => startTest(generateVocabularyTest, 25, 'vocabulary')}
                    className="w-full bg-blue-500 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    25 Questions
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">🎯</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Articles Test</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Master der, die, das with targeted practice
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => startTest(generateArticlesTest, 15, 'articles')}
                    className="w-full bg-green-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    15 Questions
                  </button>
                  <button
                    onClick={() => startTest(generateArticlesTest, 25, 'articles')}
                    className="w-full bg-green-500 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-green-600 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    25 Questions
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl mb-2">📝</div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Grammar Test</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Test your knowledge of German grammar rules
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => startTest(generateGrammarTest, 15, 'grammar')}
                    className="w-full bg-purple-600 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    15 Questions
                  </button>
                  <button
                    onClick={() => startTest(generateGrammarTest, 25, 'grammar')}
                    className="w-full bg-purple-500 text-white py-2 px-3 sm:px-4 rounded-md hover:bg-purple-600 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
                  >
                    25 Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-blue-100 rounded-lg p-4 sm:p-6 text-center border border-blue-200">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1 sm:mb-2">{dataStats.vocabulary.total}+</div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium">Vocabulary</div>
            <div className="text-xs text-blue-500">test questions</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 sm:p-6 text-center border border-green-200">
            <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-1 sm:mb-2">{dataStats.articles.total}+</div>
            <div className="text-xs sm:text-sm text-green-600 font-medium">Articles</div>
            <div className="text-xs text-green-500">test questions</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 sm:p-6 text-center border border-purple-200">
            <div className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1 sm:mb-2">{dataStats.grammarLessons.total + dataStats.grammarPractice.total}+</div>
            <div className="text-xs sm:text-sm text-purple-600 font-medium">Grammar</div>
            <div className="text-xs text-purple-500">test questions</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 sm:p-6 text-center border border-yellow-200">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-700 mb-1 sm:mb-2">∞</div>
            <div className="text-xs sm:text-sm text-yellow-600 font-medium">Unique Tests</div>
            <div className="text-xs text-yellow-500">never repeat</div>
          </div>
        </div>

        {/* Test Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
            🎯 Test Taking Tips
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">1.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Read carefully:</strong> Take your time to understand each question completely
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">2.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Process of elimination:</strong> Rule out obviously wrong answers first
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">3.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Trust your instincts:</strong> Your first answer is often correct
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">4.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Manage your time:</strong> Don't spend too long on any single question
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">5.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Stay calm:</strong> A relaxed mind performs better than a stressed one
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 font-bold text-sm sm:text-base">6.</div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <strong>Review mistakes:</strong> Learn from incorrect answers to improve
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
