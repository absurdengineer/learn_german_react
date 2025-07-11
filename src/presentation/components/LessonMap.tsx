import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrammarLesson } from '../../domain/entities/Grammar';

interface LessonMapProps {
  lessons: GrammarLesson[];
  currentLesson: number;
}

const LessonNode: React.FC<{
  lesson: GrammarLesson;
  status: 'completed' | 'current' | 'locked';
  isLast: boolean;
  align: 'left' | 'right';
}> = ({ lesson, status, isLast, align }) => {
  const navigate = useNavigate();
  const isClickable = status !== 'locked';

  const NodeIcon = () => {
    if (status === 'completed') {
      return <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>;
    }
    if (status === 'current') {
      return <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ring-4 ring-blue-200">{lesson.day}</div>;
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`flex items-center w-full ${align === 'left' ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`relative w-1/2 ${align === 'left' ? 'pr-8' : 'pl-8'}`}
        onClick={() => isClickable && navigate(`/grammar/lessons/${lesson.day}`)}
      >
        <div
          className={`p-4 rounded-lg transition-all duration-200 ${
            isClickable ? 'bg-white shadow-sm hover:shadow-md cursor-pointer' : 'bg-gray-100'
          }`}
        >
          <h3 className={`font-semibold ${status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>
            Day {lesson.day}: {lesson.title}
          </h3>
          <p className={`text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
            {lesson.mission}
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <NodeIcon />
      </div>
      {!isLast && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 h-full top-0 w-0.5 ${
            status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
          }`}
        ></div>
      )}
    </div>
  );
};

const LessonMap: React.FC<LessonMapProps> = ({ lessons, currentLesson }) => {
  const lessonsByWeek = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.week]) {
      acc[lesson.week] = [];
    }
    acc[lesson.week].push(lesson);
    return acc;
  }, {} as Record<number, GrammarLesson[]>);

  return (
    <div className="space-y-12">
      {Object.entries(lessonsByWeek).map(([week, lessonsInWeek]) => (
        <div key={week} className="relative">
          <div className="sticky top-0 py-2 bg-gray-50 z-20">
            <h2 className="text-xl font-bold text-gray-800 bg-gray-200 px-4 py-2 rounded-lg inline-block">
              Week {week}
            </h2>
          </div>
          <div className="relative mt-4 space-y-8">
            {lessonsInWeek.map((lesson, index) => {
              const status =
                lesson.day < currentLesson
                  ? 'completed'
                  : lesson.day === currentLesson
                  ? 'current'
                  : 'locked';
              return (
                <LessonNode
                  key={lesson.day}
                  lesson={lesson}
                  status={status}
                  isLast={index === lessonsInWeek.length - 1}
                  align={index % 2 === 0 ? 'left' : 'right'}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonMap;