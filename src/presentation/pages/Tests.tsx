import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionResults from '../components/SessionResults';
import TestSession from '../components/TestSession';

interface TestResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  accuracy: number;
  questions: unknown[];
}

const Tests: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'Practice' | 'Mock'>('A1');
  const [testMode, setTestMode] = useState<'browse' | 'testing' | 'results'>('browse');
  const [currentTest, setCurrentTest] = useState<{
    type: 'vocabulary' | 'grammar' | 'mixed';
    questionCount: number;
  } | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const startTest = (type: 'vocabulary' | 'grammar' | 'mixed', questionCount: number) => {
    setCurrentTest({ type, questionCount });
    setTestMode('testing');
  };

  const handleTestComplete = (results: TestResults) => {
    setTestResults(results);
    setTestMode('results');
  };

  const handleTestExit = () => {
    setTestMode('browse');
    setCurrentTest(null);
    setTestResults(null);
  };

  const handleRestart = () => {
    if (currentTest) {
      setTestMode('testing');
    }
  };

  const handleReviewMistakes = () => {
    // For now, just restart the test
    handleRestart();
  };

  // Render test session
  if (testMode === 'testing' && currentTest) {
    return (
      <TestSession
        testType={currentTest.type}
        questionCount={currentTest.questionCount}
        onComplete={handleTestComplete}
        onExit={handleTestExit}
      />
    );
  }

  // Render results
  if (testMode === 'results' && testResults) {
    return (
      <SessionResults
        results={{
          totalQuestions: testResults.totalQuestions,
          correctAnswers: testResults.correctAnswers,
          wrongAnswers: testResults.wrongAnswers,
          timeSpent: testResults.timeSpent,
          wordsStudied: [], // Empty for tests
          mistakes: [], // Empty for now
        }}
        sessionType="multiple-choice"
        onRestart={handleRestart}
        onReviewMistakes={handleReviewMistakes}
        onExit={handleTestExit}
      />
    );
  }

  const testCategories = [
    {
      id: 'vocabulary',
      title: 'Vocabulary Test',
      description: 'Test your German vocabulary knowledge',
      icon: '📚',
      color: 'bg-blue-500',
      duration: '10 min',
      questions: 20,
      lastScore: 85,
    },
    {
      id: 'grammar',
      title: 'Grammar Test',
      description: 'Test your understanding of German grammar',
      icon: '📝',
      color: 'bg-green-500',
      duration: '15 min',
      questions: 25,
      lastScore: 78,
    },
    {
      id: 'reading',
      title: 'Reading Comprehension',
      description: 'Test your reading skills',
      icon: '📖',
      color: 'bg-purple-500',
      duration: '20 min',
      questions: 15,
      lastScore: 92,
    },
    {
      id: 'listening',
      title: 'Listening Test',
      description: 'Test your listening comprehension',
      icon: '🎧',
      color: 'bg-orange-500',
      duration: '12 min',
      questions: 18,
      lastScore: 74,
    },
    {
      id: 'writing',
      title: 'Writing Exercise',
      description: 'Practice your written German',
      icon: '✍️',
      color: 'bg-red-500',
      duration: '25 min',
      questions: 5,
      lastScore: 88,
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Practice your pronunciation',
      icon: '🗣️',
      color: 'bg-indigo-500',
      duration: '8 min',
      questions: 10,
      lastScore: 80,
    },
  ];

  const mockExams = [
    {
      id: 'goethe-a1',
      title: 'Goethe A1 Mock Exam',
      description: 'Complete A1 certification practice test',
      duration: '90 min',
      sections: 4,
      difficulty: 'A1',
      icon: '🎓',
    },
    {
      id: 'telc-a1',
      title: 'TELC A1 Mock Exam',
      description: 'Practice with TELC A1 format',
      duration: '75 min',
      sections: 4,
      difficulty: 'A1',
      icon: '📋',
    },
    {
      id: 'custom-a1',
      title: 'Custom A1 Test',
      description: 'Adaptive test based on your progress',
      duration: '60 min',
      sections: 4,
      difficulty: 'A1',
      icon: '🎯',
    },
  ];

  const recentScores = [
    { test: 'Vocabulary', score: 85, date: '2024-01-15', trend: 'up' },
    { test: 'Grammar', score: 78, date: '2024-01-14', trend: 'up' },
    { test: 'Reading', score: 92, date: '2024-01-13', trend: 'up' },
    { test: 'Listening', score: 74, date: '2024-01-12', trend: 'down' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            German Tests 🎯
          </h1>
          <p className="text-lg text-gray-600">
            Test your German skills and track your progress
          </p>
        </div>

        {/* Test Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {(['A1', 'Practice', 'Mock'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedLevel === level
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'A1' ? 'A1 Level Tests' : level === 'Practice' ? 'Quick Practice' : 'Mock Exams'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Test Area */}
          <div className="lg:col-span-2">
            {selectedLevel === 'Mock' ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Mock Exams
                </h2>
                {mockExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                    onClick={() => navigate(`/tests/${exam.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                            {exam.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {exam.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {exam.description}
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Duration:</span>
                                <span className="text-sm font-medium text-gray-700">
                                  {exam.duration}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Sections:</span>
                                <span className="text-sm font-medium text-gray-700">
                                  {exam.sections}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-1 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                            {exam.difficulty}
                          </span>
                          <div className="text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {selectedLevel === 'A1' ? 'A1 Level Tests' : 'Quick Practice'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                      onClick={() => {
                        const testType = category.id === 'vocabulary' ? 'vocabulary' : 
                                       category.id === 'grammar' ? 'grammar' : 'mixed';
                        startTest(testType, category.questions);
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                            {category.icon}
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getScoreColor(category.lastScore)}`}>
                              Last: {category.lastScore}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {category.duration}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {category.questions} questions
                          </span>
                          <div className="text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Scores */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Scores
              </h3>
              <div className="space-y-3">
                {recentScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        score.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">
                        {score.test}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${getScoreColor(score.score)}`}>
                        {score.score}%
                      </span>
                      <div className={`w-1 h-1 rounded-full ${
                        score.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Test Statistics
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    87%
                  </div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    24
                  </div>
                  <p className="text-sm text-gray-600">Tests Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    A1
                  </div>
                  <p className="text-sm text-gray-600">Current Level</p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white p-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="text-lg font-semibold mb-2">
                  Keep It Up!
                </h3>
                <p className="text-blue-100 text-sm">
                  You're doing great! Regular testing helps reinforce your learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
