import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress, useUser } from '../../hooks/useApp';
import PageHeader from '../components/PageHeader';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const progress = useProgress();

  const quickActions = [
    {
      title: 'Continue Study Plan',
      description: 'Pick up where you left off',
      path: '/study-plan',
      icon: '📚',
      color: 'bg-blue-500',
    },
    {
      title: 'Vocabulary Practice',
      description: 'Learn new words',
      path: '/vocabulary',
      icon: '🔤',
      color: 'bg-green-500',
    },
    {
      title: 'Grammar Lessons',
      description: 'Master German grammar',
      path: '/grammar',
      icon: '📝',
      color: 'bg-purple-500',
    },
    {
      title: 'Speaking Practice',
      description: 'Practice pronunciation',
      path: '/speaking',
      icon: '🗣️',
      color: 'bg-orange-500',
    },
    {
      title: 'Take a Test',
      description: 'Test your knowledge',
      path: '/tests',
      icon: '🎯',
      color: 'bg-red-500',
    },
    {
      title: 'View Progress',
      description: 'Track your learning',
      path: '/progress',
      icon: '📊',
      color: 'bg-indigo-500',
    },
  ];

  const todayProgress = {
    vocabulary: Math.floor((progress.vocabularyLearned / 500) * 100),
    grammar: Math.floor((progress.grammarTopicsCompleted.length / 6) * 100),
    overall: Math.floor((progress.currentDay / 30) * 100),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={`Guten Tag, ${user.name || 'Learner'}! 👋`}
          subtitle="Welcome to your German A1 learning journey"
          description="Your personalized dashboard to track progress and access learning materials."
        />

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Today's Progress
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Day</span>
              <span className="text-lg font-bold text-primary-600">
                {progress.currentDay}/30
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">
                  Vocabulary
                </span>
                <span className="text-sm text-blue-600">
                  {progress.vocabularyLearned}/500
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${todayProgress.vocabulary}%` }}
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">
                  Grammar
                </span>
                <span className="text-sm text-green-600">
                  {progress.grammarTopicsCompleted.length}/6
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${todayProgress.grammar}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">
                  Overall
                </span>
                <span className="text-sm text-purple-600">
                  {todayProgress.overall}%
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${todayProgress.overall}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                      {action.icon}
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Study Streak
              </h3>
              <div className="text-2xl">🔥</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {progress.streakDays}
              </div>
              <p className="text-sm text-gray-600">
                {progress.streakDays === 1 ? 'day' : 'days'} in a row
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Words Mastered
              </h3>
              <div className="text-2xl">⭐</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {progress.vocabularyMastered}
              </div>
              <p className="text-sm text-gray-600">
                words mastered
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6 mt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">💪</div>
            <p className="text-lg font-medium mb-2">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </p>
            <p className="text-blue-100 text-sm">
              Keep going! Every word you learn brings you closer to fluency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
