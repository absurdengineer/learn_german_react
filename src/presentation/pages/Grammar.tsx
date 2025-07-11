
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loadGrammarLessons } from '../../data/grammarLessons';
import { loadRandomGrammarPractice } from '../../data/grammarPractice';
import { GrammarLesson } from '../../domain/entities/Grammar';
import GrammarFlashcards from '../components/GrammarFlashcards';
import QuizSession from '../components/QuizSession';
import SessionResults from '../components/SessionResults';
import FlashcardSessionResults from '../components/FlashcardSessionResults';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { PageHero, PracticeModeCard, QuickActionCard, SectionHeader } from '../components/ui';
import GrammarLessonPage from './GrammarLessonPage';

interface GrammarSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: any[];
}

const Grammar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { day } = useParams<{ day?: string }>();

  const [sessionResults, setSessionResults] = useState<GrammarSessionResult | null>(null);
  const [sessionType, setSessionType] = useState<'flashcards' | 'quiz' | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const grammarLessons = useMemo(() => {
    const lessons = loadGrammarLessons();
    return lessons.sort((a, b) => a.week - b.week || a.day - b.day);
  }, []);

  const { lessonsByWeek, availableWeeks } = useMemo(() => {
    const grouped = grammarLessons.reduce((acc, lesson) => {
      const week = lesson.week;
      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(lesson);
      return acc;
    }, {} as Record<number, GrammarLesson[]>);
    return {
      lessonsByWeek: grouped,
      availableWeeks: Object.keys(grouped).map(Number).sort((a, b) => a - b),
    };
  }, [grammarLessons]);

  const handleSessionComplete = (results: GrammarSessionResult) => {
    setSessionResults(results);
    navigate('/grammar/results');
  };

  const startSession = (type: 'flashcards' | 'quiz', count: number) => {
    setSessionType(type);
    navigate(`/grammar/${type}`, { state: { count } });
  };

  if (day) {
    const lesson = grammarLessons.find((l) => l.day === parseInt(day, 10));
    if (!lesson) {
      return <div>Lesson not found</div>;
    }
    const currentIndex = grammarLessons.findIndex((l) => l.day === lesson.day);
    const nextLesson = currentIndex < grammarLessons.length - 1 ? grammarLessons[currentIndex + 1] : null;
    const prevLesson = currentIndex > 0 ? grammarLessons[currentIndex - 1] : null;

    return (
      <GrammarLessonPage
        lesson={lesson}
        onExit={() => navigate('/grammar/lessons')}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
      />
    );
  }

  if (location.pathname.endsWith('/flashcards')) {
    const count = location.state?.count || 20;
    return <GrammarFlashcards questions={loadRandomGrammarPractice(count)} onComplete={handleSessionComplete} onExit={() => navigate('/grammar')} />;
  }

  if (location.pathname.endsWith('/quiz')) {
    const count = location.state?.count || 20;
    const questions = loadRandomGrammarPractice(count).map(q => ({
      id: q.id.toString(),
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      category: q.category,
      helperText: q.helperText,
    }));
    return <QuizSession questions={questions} title="Grammar Quiz" onComplete={handleSessionComplete} onExit={() => navigate('/grammar')} />;
  }

  if (location.pathname.endsWith('/results')) {
    if (sessionType === 'flashcards') {
      return (
        <FlashcardSessionResults
          results={sessionResults}
          onRestart={() => navigate('/grammar/flashcards', { state: { count: sessionResults?.totalQuestions } })}
          onExit={() => navigate('/grammar')}
        />
      );
    }
    return (
      <SessionResults
        results={sessionResults}
        sessionType={sessionType || ''}
        onRestart={() => navigate(sessionType === 'practice' ? '/grammar/practice' : '/grammar/quiz', { state: { count: sessionResults?.totalQuestions } })}
        onReviewMistakes={() => {}} // Placeholder for now
        onExit={() => navigate('/grammar')}
      />
    );
  }

  if (location.pathname.endsWith('/lessons')) {
    return (
      <div>
        <PageHero
          title="All Grammar Lessons"
          subtitle="Browse your structured path to mastering German grammar."
          icon="📚"
        />
        <div className="flex justify-end my-6">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableWeeks.map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          {(lessonsByWeek[selectedWeek] || []).map((lesson) => (
            <div key={lesson.day} className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                      onClick={() => navigate(`/grammar/lessons/${lesson.day}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sessionOptions = [
    { name: 'Quick', count: 10, icon: '⚡' },
    { name: 'Normal', count: 20, icon: '💪' },
    { name: 'Intensive', count: 30, icon: '🚀' },
  ];

  return (
    <div>
      <PageHero
        title="German Grammar"
        subtitle="Master German grammar with structured lessons"
        description="From basic concepts to advanced topics, learn step-by-step."
        icon="📝"
      />
      <div className="space-y-12 mt-8">
        <QuickActionCard
          title="All Lessons"
          description="Browse all grammar lessons by week."
          icon="📚"
          onClick={() => navigate('/grammar/lessons')}
          color="blue"
        />
        <div>
          <SectionHeader
            title="Flashcards"
            description="Hone your skills with targeted exercises."
            icon="💪"
            size="md"
            alignment="left"
            className="mb-6"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionOptions.map((session) => (
              <PracticeModeCard
                key={session.name}
                title={`${session.name} Flashcards`}
                description={`${session.count} questions`}
                icon={session.icon}
                buttonText={`Start ${session.name}`}
                onStart={() => startSession('flashcards', session.count)}
                color="purple"
              />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            title="Take a Quiz"
            description="Test your knowledge with a quiz."
            icon="🧪"
            size="md"
            alignment="left"
            className="mb-6"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionOptions.map((session) => (
              <PracticeModeCard
                key={session.name}
                title={`${session.name} Quiz`}
                description={`${session.count} questions`}
                icon={session.icon}
                buttonText={`Start ${session.name}`}
                onStart={() => startSession('quiz', session.count)}
                color="green"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grammar;
