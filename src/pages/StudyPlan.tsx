import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageData } from '../hooks/usePageData';
import PageLayout from '../components/layout/PageLayout';
import SectionGrid from '../components/layout/SectionGrid';
import { FeatureCard, GradientCard, ProgressCard } from '../components';

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { getPageData } = usePageData();
  
  const pageData = getPageData('studyPlan');

  const currentDay = 7; // This would come from user progress
  const totalDays = 30;
  const progressPercentage = (currentDay / totalDays) * 100;

  const todaysLessons = [
    {
      title: 'Vocabulary: Family Members',
      description: 'Learn 15 new words about family',
      icon: '👨‍👩‍👧‍👦',
      duration: '15 min',
      completed: false,
      onClick: () => navigate('/vocabulary/category/people')
    },
    {
      title: 'Grammar: Present Tense',
      description: 'Practice verb conjugations',
      icon: '📚',
      duration: '20 min',
      completed: true,
      onClick: () => navigate('/grammar/lesson/present-tense')
    },
    {
      title: 'Articles Practice',
      description: 'Master der, die, das',
      icon: '🎭',
      duration: '10 min',
      completed: false,
      onClick: () => navigate('/articles/practice')
    }
  ];

  const weeklyOverview = [
    { day: 'Mon', completed: true, current: false },
    { day: 'Tue', completed: true, current: false },
    { day: 'Wed', completed: true, current: false },
    { day: 'Thu', completed: true, current: false },
    { day: 'Fri', completed: true, current: false },
    { day: 'Sat', completed: false, current: true },
    { day: 'Sun', completed: false, current: false },
  ];

  const achievements = [
    {
      title: '7-Day Streak',
      description: 'Completed 7 days in a row!',
      icon: '🔥',
      earned: true
    },
    {
      title: 'Vocabulary Master',
      description: '100 words learned',
      icon: '📚',
      earned: false
    },
    {
      title: 'Grammar Expert',
      description: 'All grammar lessons completed',
      icon: '🎓',
      earned: false
    }
  ];

  return (
    <PageLayout pageData={pageData}>
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Day {currentDay} of {totalDays}</h2>
            <p className="text-blue-100 text-lg">You're making great progress!</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-white/20 rounded-full p-4">
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-4">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Weekly Overview */}
        <div className="flex justify-between">
          {weeklyOverview.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                day.completed 
                  ? 'bg-green-500 text-white' 
                  : day.current 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'bg-white/20 text-white'
              }`}>
                {day.completed ? '✓' : index + 1}
              </div>
              <div className="text-xs text-blue-100">{day.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Lessons */}
      <SectionGrid title="Today's Lessons" className="mb-8">
        {todaysLessons.map((lesson, index) => (
          <GradientCard
            key={index}
            gradient={lesson.completed ? 'green-blue' : 'blue-purple'}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl mr-4">{lesson.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-white/80 text-sm">{lesson.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{lesson.duration}</span>
                {lesson.completed && (
                  <span className="text-green-200 font-semibold">✓ Completed</span>
                )}
              </div>
              <button
                onClick={lesson.onClick}
                className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {lesson.completed ? 'Review' : 'Start Lesson'}
              </button>
            </div>
          </GradientCard>
        ))}
      </SectionGrid>

      {/* Study Progress */}
      <SectionGrid title="Your Progress" className="mb-8">
        <ProgressCard
          title="Vocabulary"
          current={75}
          total={200}
          color="green"
        />
        <ProgressCard
          title="Grammar"
          current={45}
          total={100}
          color="blue"
        />
        <ProgressCard
          title="Practice Tests"
          current={30}
          total={50}
          color="purple"
        />
      </SectionGrid>

      {/* Achievements */}
      <SectionGrid title="Achievements">
        {achievements.map((achievement, index) => (
          <FeatureCard
            key={index}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            color={achievement.earned ? 'text-yellow-600' : 'text-gray-400'}
          />
        ))}
      </SectionGrid>
    </PageLayout>
  );
};

export default StudyPlan;
