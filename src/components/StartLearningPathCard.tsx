import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StartLearningPathCardProps {
  currentLesson: number;
  totalLessons: number;
}

const StartLearningPathCard: React.FC<StartLearningPathCardProps> = ({
  currentLesson,
  totalLessons,
}) => {
  const navigate = useNavigate();
  const progress = Math.round((currentLesson / totalLessons) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Path</h2>
      <p className="text-gray-600 mb-4">
        Continue your journey to mastering German grammar.
      </p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-500">
          You are on lesson {currentLesson} of {totalLessons}.
        </div>
      </div>
      <button
        onClick={() => navigate('/grammar/lessons')}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Continue Learning
      </button>
    </div>
  );
};

export default StartLearningPathCard;
