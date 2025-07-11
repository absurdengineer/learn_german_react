import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadGrammarPracticeByDay } from '../../data/grammarPractice';
import { GrammarLesson } from '../../domain/entities/Grammar';
import GrammarFlashcards from '../components/GrammarFlashcards';
import QuizSession from '../components/QuizSession';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface GrammarLessonPageProps {
  lesson: GrammarLesson;
  onExit: () => void;
  nextLesson: GrammarLesson | null;
  prevLesson: GrammarLesson | null;
}

const GrammarLessonPage: React.FC<GrammarLessonPageProps> = ({
  lesson,
  onExit,
  nextLesson,
  prevLesson,
}) => {
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState<'lesson' | 'flashcards' | 'quiz'>('lesson');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lesson, sessionMode]);

  if (sessionMode === 'flashcards') {
    const questions = loadGrammarPracticeByDay(lesson.day);
    return <GrammarFlashcards questions={questions} onComplete={() => {}} onExit={() => setSessionMode('lesson')} />;
  }

  if (sessionMode === 'quiz') {
    const questions = loadGrammarPracticeByDay(lesson.day, 20).map(q => ({
      id: q.id.toString(),
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category,
      helperText: q.helperText,
    }));
    return <QuizSession questions={questions} title="Grammar Quiz" onComplete={() => {}} onExit={() => setSessionMode('lesson')} />;
  }

  // Process content to ensure newlines are handled correctly by the Markdown parser
  const processedContent = lesson.content.replace(/\\n/g, '\n');

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* --- Navigation --- */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-blue-600 hover:underline font-medium">
          &larr; All Lessons
        </button>
        <div className="flex space-x-2">
          {prevLesson && (
            <button onClick={() => navigate(`/grammar/lessons/${prevLesson.day}`)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors">
              &larr; Previous
            </button>
          )}
          {nextLesson && (
            <button onClick={() => navigate(`/grammar/lessons/${nextLesson.day}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
              Next Lesson &rarr;
            </button>
          )}
        </div>
      </div>

      {/* --- Lesson Body --- */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* --- Header --- */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <p className="text-base font-semibold text-blue-600">{`Week ${lesson.week} • Day ${lesson.day}`}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{lesson.title}</h1>
        </div>

        {/* --- Main Content --- */}
        <div className="prose max-w-none">
          <MarkdownRenderer content={processedContent} />
        </div>

        {/* --- Mission --- */}
        {lesson.mission && (
          <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-green-800 mb-2">🎯 Your Mission</h3>
            <div className="prose prose-green">
              <MarkdownRenderer content={lesson.mission.replace(/\\n/g, '\n')} />
            </div>
          </div>
        )}

        {/* --- Helpful Hint --- */}
        {lesson.helpfulHint && (
          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">💡 Helpful Hint</h3>
            <div className="prose prose-yellow">
              <MarkdownRenderer content={lesson.helpfulHint.replace(/\\n/g, '\n')} />
            </div>
          </div>
        )}
        
        {/* --- Fun Fact --- */}
        {lesson.funFact && (
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-2">🎉 Fun Fact</h3>
            <div className="prose prose-blue">
              <MarkdownRenderer content={lesson.funFact.replace(/\\n/g, '\n')} />
            </div>
          </div>
        )}
      </div>

      {/* --- Action Buttons --- */}
      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={() => setSessionMode('flashcards')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Practice with Flashcards
        </button>
        <button
          onClick={() => setSessionMode('quiz')}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          Take a Quiz
        </button>
      </div>
    </div>
  );
};

export default GrammarLessonPage;