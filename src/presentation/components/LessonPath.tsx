import React from 'react';
import { GrammarLesson } from '../../domain/entities/Grammar';
import { useNavigate } from 'react-router-dom';

interface LessonPathProps {
  lessons: GrammarLesson[];
  currentLesson: number;
}

const LessonPath: React.FC<LessonPathProps> = ({ lessons, currentLesson }) => {
  const navigate = useNavigate();

  const lessonsByWeek = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.week]) {
      acc[lesson.week] = [];
    }
    acc[lesson.week].push(lesson);
    return acc;
  }, {} as Record<number, GrammarLesson[]>);

  return (
    <div className="space-y-8">
      {Object.entries(lessonsByWeek).map(([week, lessonsInWeek]) => (
        <div key={week}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Week {week}</h2>
          <div className="space-y-4">
            {lessonsInWeek.map((lesson) => {
              const isCompleted = lesson.day < currentLesson;
              const isCurrent = lesson.day === currentLesson;
              const isLocked = lesson.day > currentLesson;

              return (
                <div
                  key={lesson.day}
                  onClick={() => !isLocked && navigate(`/grammar/lessons/${lesson.day}`)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    isLocked
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-white shadow-sm hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          isCompleted
                            ? 'bg-green-500'
                            : isCurrent
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {isCompleted ? '✓' : lesson.day}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                        <p className="text-gray-600">{lesson.mission}</p>
                      </div>
                    </div>
                    {isLocked && (
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonPath;
