import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Speaking: React.FC = () => {
  const navigate = useNavigate();
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopped'>('idle');

  const speakingExercises = [
    {
      id: 1,
      title: 'Basic Greetings',
      description: 'Practice common German greetings',
      level: 'A1',
      icon: '👋',
      color: 'bg-blue-500',
      phrases: [
        { german: 'Hallo', english: 'Hello' },
        { german: 'Guten Tag', english: 'Good day' },
        { german: 'Wie geht es dir?', english: 'How are you?' },
        { german: 'Mir geht es gut', english: 'I am doing well' },
      ],
      completed: true,
    },
    {
      id: 2,
      title: 'Numbers 1-20',
      description: 'Learn to pronounce German numbers',
      level: 'A1',
      icon: '🔢',
      color: 'bg-green-500',
      phrases: [
        { german: 'eins', english: 'one' },
        { german: 'zwei', english: 'two' },
        { german: 'drei', english: 'three' },
        { german: 'vier', english: 'four' },
      ],
      completed: true,
    },
    {
      id: 3,
      title: 'Days of the Week',
      description: 'Practice weekday pronunciation',
      level: 'A1',
      icon: '📅',
      color: 'bg-purple-500',
      phrases: [
        { german: 'Montag', english: 'Monday' },
        { german: 'Dienstag', english: 'Tuesday' },
        { german: 'Mittwoch', english: 'Wednesday' },
        { german: 'Donnerstag', english: 'Thursday' },
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Colors',
      description: 'Learn color pronunciation',
      level: 'A1',
      icon: '🎨',
      color: 'bg-orange-500',
      phrases: [
        { german: 'rot', english: 'red' },
        { german: 'blau', english: 'blue' },
        { german: 'grün', english: 'green' },
        { german: 'gelb', english: 'yellow' },
      ],
      completed: false,
    },
    {
      id: 5,
      title: 'Family Members',
      description: 'Practice family vocabulary',
      level: 'A1',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-red-500',
      phrases: [
        { german: 'die Mutter', english: 'the mother' },
        { german: 'der Vater', english: 'the father' },
        { german: 'die Schwester', english: 'the sister' },
        { german: 'der Bruder', english: 'the brother' },
      ],
      completed: false,
    },
    {
      id: 6,
      title: 'Common Phrases',
      description: 'Essential everyday phrases',
      level: 'A1',
      icon: '💬',
      color: 'bg-indigo-500',
      phrases: [
        { german: 'Entschuldigung', english: 'Excuse me' },
        { german: 'Danke schön', english: 'Thank you' },
        { german: 'Bitte schön', english: 'You\'re welcome' },
        { german: 'Auf Wiedersehen', english: 'Goodbye' },
      ],
      completed: false,
    },
  ];

  const handleRecord = () => {
    if (recordingStatus === 'idle') {
      setRecordingStatus('recording');
      // In a real app, you would start recording here
      setTimeout(() => {
        setRecordingStatus('stopped');
      }, 3000);
    } else if (recordingStatus === 'recording') {
      setRecordingStatus('stopped');
    } else {
      setRecordingStatus('idle');
    }
  };

  const getRecordingButtonText = () => {
    switch (recordingStatus) {
      case 'idle':
        return 'Start Recording';
      case 'recording':
        return 'Stop Recording';
      case 'stopped':
        return 'Record Again';
      default:
        return 'Start Recording';
    }
  };

  const getRecordingButtonColor = () => {
    switch (recordingStatus) {
      case 'idle':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'recording':
        return 'bg-red-600 hover:bg-red-700 animate-pulse';
      case 'stopped':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Speaking Practice 🗣️
          </h1>
          <p className="text-lg text-gray-600">
            Practice your German pronunciation and speaking skills
          </p>
        </div>

        {/* Quick Record Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quick Practice
            </h2>
            <p className="text-gray-600 mb-6">
              Record yourself saying: <span className="font-semibold text-blue-600">"Hallo, mein Name ist..."</span>
            </p>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  recordingStatus === 'recording' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {recordingStatus === 'recording' ? (
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  ) : (
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                  )}
                </div>
              </div>
              <button
                onClick={handleRecord}
                className={`px-8 py-3 text-white rounded-lg font-medium transition-all duration-200 ${getRecordingButtonColor()}`}
              >
                {getRecordingButtonText()}
              </button>
              {recordingStatus === 'stopped' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Recording completed! Play it back to listen.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Speaking Exercises */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Speaking Exercises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {speakingExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                onClick={() => navigate(`/speaking/${exercise.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`${exercise.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                        {exercise.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exercise.title}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {exercise.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {exercise.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {exercise.phrases.length} phrases
                            </span>
                          </div>
                          {exercise.completed && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Preview phrases */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sample phrases:</h4>
                    <div className="space-y-1">
                      {exercise.phrases.slice(0, 2).map((phrase, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{phrase.german}</span>
                          <span className="text-xs text-gray-500">{phrase.english}</span>
                        </div>
                      ))}
                      {exercise.phrases.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{exercise.phrases.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6 mt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-xl font-semibold mb-2">
              Speaking Tips
            </h3>
            <div className="text-blue-100 text-sm space-y-1">
              <p>• Listen carefully to native pronunciation</p>
              <p>• Practice speaking slowly and clearly</p>
              <p>• Record yourself to track improvement</p>
              <p>• Don't worry about making mistakes - practice makes perfect!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaking;
