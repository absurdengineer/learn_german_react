import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrammarLesson } from '../../domain/entities/Grammar';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PageLayout from '../components/layout/PageLayout';

interface GrammarLessonPageProps {
  lesson: GrammarLesson;
  onExit: () => void;
  nextLesson?: GrammarLesson;
  prevLesson?: GrammarLesson;
}

const GrammarLessonPage: React.FC<GrammarLessonPageProps> = ({ lesson, onExit, nextLesson, prevLesson }) => {
  const navigate = useNavigate();

  return (
    <PageLayout
      pageData={{
        title: `Week ${lesson.week}, Day ${lesson.day}`,
        subtitle: lesson.title,
        description: '',
        icon: '📝',
        gradient: 'from-blue-500 to-purple-600',
      }}
      showBackButton
      onBack={onExit}
    >
      <div className="mb-8">
        <button
          onClick={onExit}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Back to Learning Path
        </button>
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission</h2>
          <div className="prose max-w-none">
            <MarkdownRenderer content={lesson.mission} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson</h2>
          <div className="prose max-w-none">
            <MarkdownRenderer content={lesson.content} />
          </div>
        </div>

        {lesson.helpfulHint && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-2">💡 Helpful Hint</h3>
            <div className="prose prose-blue max-w-none">
              <MarkdownRenderer content={lesson.helpfulHint} />
            </div>
          </div>
        )}

        {lesson.funFact && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">🎉 Fun Fact</h3>
            <div className="prose prose-yellow max-w-none">
              <MarkdownRenderer content={lesson.funFact} />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-8">
        {prevLesson ? (
          <button
            onClick={() => navigate(`/grammar/lessons/${prevLesson.day}`)}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous Lesson
          </button>
        ) : (
          <div />
        )}
        {nextLesson && (
          <button
            onClick={() => navigate(`/grammar/lessons/${nextLesson.day}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Lesson
          </button>
        )}
      </div>
    </PageLayout>
  );
};

export default GrammarLessonPage;

