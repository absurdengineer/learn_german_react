import React from 'react';
import { GrammarLesson } from '../types/Grammar';
import MarkdownRenderer from './MarkdownRenderer';

interface GrammarLessonCardProps {
  lesson: GrammarLesson;
  onStart: () => void;
}

export const GrammarLessonCard: React.FC<GrammarLessonCardProps> = ({ lesson, onStart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
              {lesson.day}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {lesson.title}
              </h3>
              <div className="prose prose-sm text-gray-600 mt-2">
                <MarkdownRenderer content={lesson.mission.replace(/\\n/g, '\n')} />
              </div>
            </div>
          </div>
          <div className="flex items-center pl-4">
            <button
              onClick={onStart}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
