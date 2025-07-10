import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress, useUser } from '../../hooks/useApp';
import { Card, GradientCard, PageHero, ProgressCard, QuickActionCard } from '../components/ui';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={`Guten Tag, ${user.name || 'Learner'}! 👋`}
        subtitle="Welcome to your German A1 learning journey"
        description="Your personalized dashboard to track progress and access learning materials."
        icon=""
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">

        {/* Featured Learning Modes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Articles Practice Banner */}
          <GradientCard gradient="blue-purple">
            <div className="flex flex-col items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">🎯 Master German Articles</h3>
                <p className="opacity-90 text-sm">
                  Practice der, die, das with 200+ essential A1 words using the 80-20 rule
                </p>
              </div>
              <button
                onClick={() => navigate('/articles')}
                className="w-full bg-white text-blue-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <span>Start Articles Practice</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </GradientCard>

          {/* Vocabulary Practice Banner */}
          <GradientCard gradient="green-blue">
            <div className="flex flex-col items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">📚 Build Your Vocabulary</h3>
                <p className="opacity-90 text-sm">
                  Learn essential German words with interactive exercises and spaced repetition
                </p>
              </div>
              <button
                onClick={() => navigate('/vocabulary')}
                className="w-full bg-white text-green-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <span>Start Vocabulary Practice</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </GradientCard>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Today's Progress
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Day</span>
              <span className="text-lg font-bold text-primary-600">
                {progress.currentDay}/30
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProgressCard
              title="Vocabulary"
              current={progress.vocabularyLearned}
              total={500}
              color="blue"
            />

            <ProgressCard
              title="Grammar"
              current={progress.grammarTopicsCompleted.length}
              total={6}
              color="green"
            />

            <ProgressCard
              title="Overall"
              current={progress.currentDay}
              total={30}
              color="purple"
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </div>

        {/* Streak & Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
