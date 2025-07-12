import React from 'react';
import { useProgress } from '../hooks/useApp';

const Progress: React.FC = () => {
  const progress = useProgress();

  const weeklyData = [
    { day: 'Mon', vocabulary: 12, grammar: 8, speaking: 5, reading: 10 },
    { day: 'Tue', vocabulary: 15, grammar: 6, speaking: 8, reading: 12 },
    { day: 'Wed', vocabulary: 18, grammar: 10, speaking: 7, reading: 14 },
    { day: 'Thu', vocabulary: 20, grammar: 12, speaking: 9, reading: 16 },
    { day: 'Fri', vocabulary: 16, grammar: 8, speaking: 6, reading: 11 },
    { day: 'Sat', vocabulary: 22, grammar: 14, speaking: 10, reading: 18 },
    { day: 'Sun', vocabulary: 19, grammar: 11, speaking: 8, reading: 15 },
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'First Steps', 
      description: 'Complete your first lesson',
      icon: '🎯',
      unlocked: true,
      date: '2024-01-10'
    },
    { 
      id: 2, 
      title: 'Word Master', 
      description: 'Learn 100 vocabulary words',
      icon: '📚',
      unlocked: true,
      date: '2024-01-12'
    },
    { 
      id: 3, 
      title: 'Grammar Guru', 
      description: 'Complete 3 grammar topics',
      icon: '📝',
      unlocked: true,
      date: '2024-01-14'
    },
    { 
      id: 4, 
      title: 'Streak Master', 
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false,
      date: null
    },
    { 
      id: 5, 
      title: 'Test Ace', 
      description: 'Score 90% on 5 tests',
      icon: '🏆',
      unlocked: false,
      date: null
    },
  ];

  const skillLevels = [
    { skill: 'Vocabulary', level: 'A1', progress: 78, color: 'bg-blue-500' },
    { skill: 'Grammar', level: 'A1', progress: 65, color: 'bg-green-500' },
    { skill: 'Reading', level: 'A1', progress: 82, color: 'bg-purple-500' },
    { skill: 'Listening', level: 'A1', progress: 58, color: 'bg-orange-500' },
    { skill: 'Speaking', level: 'A1', progress: 45, color: 'bg-red-500' },
    { skill: 'Writing', level: 'A1', progress: 38, color: 'bg-indigo-500' },
  ];

  const getMaxValue = (data: typeof weeklyData) => {
    return Math.max(...data.flatMap(d => [d.vocabulary, d.grammar, d.speaking, d.reading]));
  };

  const maxValue = getMaxValue(weeklyData);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Progress 📊
          </h1>
          <p className="text-lg text-gray-600">
            Track your German learning journey
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Study Days</h3>
              <div className="text-2xl">📅</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.currentDay}
            </div>
            <p className="text-sm text-gray-600">of 30 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Words Learned</h3>
              <div className="text-2xl">📚</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.vocabularyLearned}
            </div>
            <p className="text-sm text-gray-600">of 500 words</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
              <div className="text-2xl">🔥</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.streakDays}
            </div>
            <p className="text-sm text-gray-600">
              {progress.streakDays === 1 ? 'day' : 'days'} in a row
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
              <div className="text-2xl">🎯</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {progress.testScores.length > 0 
                ? Math.round(progress.testScores.reduce((a: number, b: { percentage: number }) => a + b.percentage, 0) / progress.testScores.length)
                : 0}%
            </div>
            <p className="text-sm text-gray-600">test average</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Weekly Activity
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {day.day}
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-6 flex overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.vocabulary / maxValue) * 100}%` }}
                      >
                        {day.vocabulary > 5 ? day.vocabulary : ''}
                      </div>
                      <div 
                        className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.grammar / maxValue) * 100}%` }}
                      >
                        {day.grammar > 5 ? day.grammar : ''}
                      </div>
                      <div 
                        className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.speaking / maxValue) * 100}%` }}
                      >
                        {day.speaking > 5 ? day.speaking : ''}
                      </div>
                      <div 
                        className="bg-orange-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(day.reading / maxValue) * 100}%` }}
                      >
                        {day.reading > 5 ? day.reading : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Vocabulary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Grammar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Speaking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Reading</span>
              </div>
            </div>
          </div>

          {/* Skill Levels */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Skill Levels
            </h3>
            <div className="space-y-4">
              {skillLevels.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {skill.skill}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {skill.progress}%
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {skill.level}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${skill.color}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-green-600 mt-1">
                        Unlocked on {achievement.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
