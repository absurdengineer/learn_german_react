import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { usePageData } from '../../hooks/usePageData';
import PageLayout from '../components/layout/PageLayout';
import SectionGrid from '../components/layout/SectionGrid';
import { FeatureCard, QuickActionCard, StatCard } from '../components/ui';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { getPageData } = usePageData();
  
  const pageData = getPageData('home');
  const user = state.user;

  const quickActions = [
    {
      title: 'Daily Practice',
      description: 'Continue your learning streak',
      icon: '🎯',
      color: 'from-blue-500 to-purple-600',
      onClick: () => navigate('/study-plan'),
    },
    {
      title: 'Vocabulary',
      description: 'Learn new words',
      icon: '📚',
      color: 'from-green-500 to-teal-600',
      onClick: () => navigate('/vocabulary'),
    },
    {
      title: 'Practice Test',
      description: 'Test your knowledge',
      icon: '📝',
      color: 'from-orange-500 to-red-600',
      onClick: () => navigate('/tests'),
    },
    {
      title: 'Grammar',
      description: 'Master German grammar',
      icon: '📖',
      color: 'from-purple-500 to-pink-600',
      onClick: () => navigate('/grammar'),
    },
  ];

  const stats = [
    {
      label: 'Words Learned',
      value: '150',
      change: '+12 this week',
      color: 'text-green-600',
    },
    {
      label: 'Study Streak',
      value: '7 days',
      change: 'Keep it up!',
      color: 'text-blue-600',
    },
    {
      label: 'Lessons Completed',
      value: '24',
      change: '+3 this week',
      color: 'text-purple-600',
    },
  ];

  const features = [
    {
      title: 'Articles Practice',
      description: 'Master der, die, das with interactive exercises',
      icon: '🎭',
      href: '/articles',
    },
    {
      title: 'Speaking Practice',
      description: 'Improve pronunciation with voice exercises',
      icon: '🗣️',
      href: '/speaking',
    },
    {
      title: 'Writing Practice',
      description: 'Practice writing with guided exercises',
      icon: '✍️',
      href: '/writing',
    },
  ];

  return (
    <PageLayout
      pageData={pageData}
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 sm:p-8 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Willkommen zurück, {user?.name || 'Learner'}! 👋
        </h2>
        <p className="text-blue-100 text-lg">
          Ready to continue your German learning journey?
        </p>
      </div>

      {/* Quick Actions */}
      <SectionGrid title="Quick Actions" className="mb-8">
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </SectionGrid>

      {/* Progress Stats */}
      <SectionGrid title="Your Progress" className="mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.label}
            value={stat.value}
            subtitle={stat.change}
            color={stat.color}
          />
        ))}
      </SectionGrid>

      {/* Features */}
      <SectionGrid title="Explore Features">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            onClick={() => navigate(feature.href)}
          />
        ))}
      </SectionGrid>
    </PageLayout>
  );
};

export default Home;
