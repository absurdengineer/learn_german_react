import React from 'react';
import { useNavigate } from 'react-router-dom';

const Grammar: React.FC = () => {
  const navigate = useNavigate();

  const grammarTopics = [
    {
      id: 1,
      title: 'Articles (der, die, das)',
      description: 'Learn the German definite and indefinite articles',
      level: 'Beginner',
      progress: 85,
      icon: '🏷️',
      color: 'bg-blue-500',
      lessons: 5,
      completed: 4,
    },
    {
      id: 2,
      title: 'Present Tense (Präsens)',
      description: 'Master the present tense conjugations',
      level: 'Beginner',
      progress: 60,
      icon: '⏰',
      color: 'bg-green-500',
      lessons: 8,
      completed: 5,
    },
    {
      id: 3,
      title: 'Pronouns (Pronomen)',
      description: 'Personal, possessive, and demonstrative pronouns',
      level: 'Beginner',
      progress: 30,
      icon: '👤',
      color: 'bg-purple-500',
      lessons: 6,
      completed: 2,
    },
    {
      id: 4,
      title: 'Plural Formation',
      description: 'Learn how to form plurals in German',
      level: 'Beginner',
      progress: 90,
      icon: '🔢',
      color: 'bg-orange-500',
      lessons: 4,
      completed: 4,
    },
    {
      id: 5,
      title: 'Question Formation',
      description: 'W-questions and Yes/No questions',
      level: 'Beginner',
      progress: 20,
      icon: '❓',
      color: 'bg-red-500',
      lessons: 5,
      completed: 1,
    },
    {
      id: 6,
      title: 'Negation (nicht, kein)',
      description: 'Learn to negate sentences correctly',
      level: 'Beginner',
      progress: 0,
      icon: '🚫',
      color: 'bg-gray-500',
      lessons: 4,
      completed: 0,
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 0) return 'Not Started';
    if (progress < 30) return 'Just Started';
    if (progress < 70) return 'In Progress';
    if (progress < 100) return 'Almost Done';
    return 'Completed';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            German Grammar 📝
          </h1>
          <p className="text-lg text-gray-600">
            Master the foundations of German grammar
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Overall Progress
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">A1 Level</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">A1</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {grammarTopics.filter(t => t.progress === 100).length}
              </div>
              <p className="text-sm text-gray-600">Topics Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {grammarTopics.filter(t => t.progress > 0).length}
              </div>
              <p className="text-sm text-gray-600">Topics Started</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {grammarTopics.reduce((sum, t) => sum + t.lessons, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Lessons</p>
            </div>
          </div>
        </div>

        {/* Grammar Topics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Grammar Topics
          </h2>
          
          {grammarTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              onClick={() => navigate(`/grammar/${topic.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`${topic.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {topic.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {topic.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {topic.completed}/{topic.lessons} lessons
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            topic.progress === 100 ? 'text-green-600' : 
                            topic.progress > 0 ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {getProgressText(topic.progress)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {topic.progress}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(topic.progress)}`}
                          style={{ width: `${topic.progress}%` }}
                        />
                      </div>
                    </div>
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

        {/* Quick Practice */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white p-6 mt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-xl font-semibold mb-2">
              Quick Grammar Practice
            </h3>
            <p className="text-purple-100 text-sm mb-4">
              Test your knowledge with random grammar exercises
            </p>
            <button
              onClick={() => navigate('/tests/grammar')}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grammar;
