import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../hooks/useApp';

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const progress = useProgress();

  const studyPlan = [
    {
      day: 1,
      title: 'Welcome to German!',
      description: 'Basic greetings and introductions',
      activities: [
        { type: 'vocabulary', title: 'Learn 10 basic greetings', duration: '15 min' },
        { type: 'grammar', title: 'Personal pronouns', duration: '20 min' },
        { type: 'speaking', title: 'Practice introductions', duration: '10 min' },
      ],
      completed: true,
    },
    {
      day: 2,
      title: 'Numbers and Time',
      description: 'Learn numbers 1-20 and basic time expressions',
      activities: [
        { type: 'vocabulary', title: 'Numbers 1-20', duration: '20 min' },
        { type: 'grammar', title: 'Time expressions', duration: '15 min' },
        { type: 'listening', title: 'Number recognition', duration: '10 min' },
      ],
      completed: true,
    },
    {
      day: 3,
      title: 'Family and Relationships',
      description: 'Family members and describing relationships',
      activities: [
        { type: 'vocabulary', title: 'Family vocabulary', duration: '25 min' },
        { type: 'grammar', title: 'Possessive pronouns', duration: '20 min' },
        { type: 'speaking', title: 'Describe your family', duration: '15 min' },
      ],
      completed: true,
    },
    {
      day: 4,
      title: 'Colors and Descriptions',
      description: 'Learn colors and basic adjectives',
      activities: [
        { type: 'vocabulary', title: 'Colors and adjectives', duration: '20 min' },
        { type: 'grammar', title: 'Adjective endings', duration: '25 min' },
        { type: 'writing', title: 'Describe objects', duration: '15 min' },
      ],
      completed: progress.currentDay > 4,
    },
    {
      day: 5,
      title: 'Food and Drinks',
      description: 'Essential food vocabulary and ordering',
      activities: [
        { type: 'vocabulary', title: 'Food and drinks', duration: '25 min' },
        { type: 'grammar', title: 'Modal verbs (möchten)', duration: '20 min' },
        { type: 'speaking', title: 'Order food', duration: '15 min' },
      ],
      completed: progress.currentDay > 5,
    },
    {
      day: 6,
      title: 'Daily Routines',
      description: 'Express daily activities and routines',
      activities: [
        { type: 'vocabulary', title: 'Daily activities', duration: '20 min' },
        { type: 'grammar', title: 'Separable verbs', duration: '25 min' },
        { type: 'writing', title: 'Write about your day', duration: '15 min' },
      ],
      completed: progress.currentDay > 6,
    },
    {
      day: 7,
      title: 'Review Week 1',
      description: 'Test your knowledge from the first week',
      activities: [
        { type: 'test', title: 'Week 1 vocabulary test', duration: '20 min' },
        { type: 'test', title: 'Week 1 grammar test', duration: '25 min' },
        { type: 'speaking', title: 'Speaking assessment', duration: '15 min' },
      ],
      completed: progress.currentDay > 7,
    },
  ];

  const weeklyProgress = {
    week1: studyPlan.slice(0, 7).filter(day => day.completed).length,
    week2: 0, // Would be calculated based on days 8-14
    week3: 0, // Would be calculated based on days 15-21
    week4: 0, // Would be calculated based on days 22-28
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return '📚';
      case 'grammar':
        return '📝';
      case 'speaking':
        return '🗣️';
      case 'listening':
        return '🎧';
      case 'reading':
        return '📖';
      case 'writing':
        return '✍️';
      case 'test':
        return '🎯';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return 'bg-blue-100 text-blue-800';
      case 'grammar':
        return 'bg-green-100 text-green-800';
      case 'speaking':
        return 'bg-orange-100 text-orange-800';
      case 'listening':
        return 'bg-purple-100 text-purple-800';
      case 'reading':
        return 'bg-indigo-100 text-indigo-800';
      case 'writing':
        return 'bg-red-100 text-red-800';
      case 'test':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            30-Day Study Plan 📚
          </h1>
          <p className="text-lg text-gray-600">
            Your structured path to German A1 proficiency
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Weekly Progress
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Current Day</span>
              <span className="text-lg font-bold text-blue-600">
                {progress.currentDay}/30
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Week 1</span>
                <span className="text-sm text-blue-600">{weeklyProgress.week1}/7</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.week1 / 7) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Week 2</span>
                <span className="text-sm text-green-600">{weeklyProgress.week2}/7</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.week2 / 7) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">Week 3</span>
                <span className="text-sm text-purple-600">{weeklyProgress.week3}/7</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.week3 / 7) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">Week 4</span>
                <span className="text-sm text-orange-600">{weeklyProgress.week4}/7</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.week4 / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Study Plan Days */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Daily Lessons
          </h2>

          {studyPlan.map((day) => (
            <div
              key={day.day}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${
                day.completed 
                  ? 'border-green-200 bg-green-50' 
                  : progress.currentDay === day.day 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                      day.completed 
                        ? 'bg-green-500' 
                        : progress.currentDay === day.day 
                          ? 'bg-blue-500' 
                          : 'bg-gray-400'
                    }`}>
                      {day.completed ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        day.day
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Day {day.day}: {day.title}
                        </h3>
                        {progress.currentDay === day.day && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {day.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {day.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {activity.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                                  {activity.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {activity.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {progress.currentDay === day.day && (
                      <button
                        onClick={() => navigate(`/study-plan/day/${day.day}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Day
                      </button>
                    )}
                    {day.completed && (
                      <button
                        onClick={() => navigate(`/study-plan/day/${day.day}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white p-6 mt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-xl font-semibold mb-2">
              Stay Consistent!
            </h3>
            <p className="text-purple-100 text-sm mb-4">
              You're on day {progress.currentDay} of your 30-day journey. 
              Consistency is key to language learning success!
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{progress.currentDay}</div>
                <div className="text-xs text-purple-200">Days Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{30 - progress.currentDay}</div>
                <div className="text-xs text-purple-200">Days Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round((progress.currentDay / 30) * 100)}%</div>
                <div className="text-xs text-purple-200">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
