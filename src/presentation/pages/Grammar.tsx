import React from 'react';
import { useGrammar } from '../../hooks/useGrammar';
import FlashcardSession from '../components/FlashcardSession';
import QuizSession from '../components/QuizSession';
import SessionResults from '../components/SessionResults';
import PageLayout from '../components/layout/PageLayout';
import { PracticeModeCard, StartLearningPathCard } from '../components/ui';
import SectionGrid from '../components/layout/SectionGrid';
import { grammarFlashcardRenderer, grammarToFlashcardAdapter } from '../components/FlashcardAdapters';
import { loadRandomGrammarPractice } from '../../data/grammarPractice';
import FlashcardSessionResults from '../components/FlashcardSessionResults';
import { SESSION_KEYS, SessionManager } from '../../utils/sessionManager';
import GrammarLessonPage from './GrammarLessonPage';
import LessonMap from '../components/LessonMap';

const Grammar: React.FC = () => {
  const {
    day,
    sessionResults,
    sessionType,
    currentLesson,
    grammarLessons,
    handleSessionComplete,
    handleQuizComplete,
    startSession,
    navigate,
    location,
  } = useGrammar();

  if (day) {
    const lesson = grammarLessons.find((l: any) => l.day === parseInt(day, 10));
    if (!lesson) {
      return <div>Lesson not found</div>;
    }
    const nextLesson = grammarLessons.find((l: any) => l.day === parseInt(day, 10) + 1);
    const prevLesson = grammarLessons.find((l: any) => l.day === parseInt(day, 10) - 1);
 
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
    const questions = loadRandomGrammarPractice(count);
    const flashcardItems = grammarToFlashcardAdapter(questions);
    
    return (
      <FlashcardSession
        items={flashcardItems}
        title="Grammar Flashcards"
        onComplete={handleSessionComplete}
        onExit={() => navigate('/grammar')}
        customRenderer={grammarFlashcardRenderer}
        showProgress={true}
      />
    );
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
    return <QuizSession questions={questions} title="Grammar Quiz" onComplete={handleQuizComplete} onExit={() => navigate('/grammar')} />;
  }

  if (location.pathname.endsWith('/results')) {
    if (!sessionResults) {
      navigate('/grammar');
      return null;
    }

    if (sessionType === 'flashcards') {
      return (
        <FlashcardSessionResults
          results={sessionResults}
          onRestart={() => {
            SessionManager.clearSession(SESSION_KEYS.GRAMMAR);
            navigate('/grammar/flashcards', { state: { count: sessionResults.totalQuestions } });
          }}
          onExit={() => {
            SessionManager.clearSession(SESSION_KEYS.GRAMMAR);
            navigate('/grammar');
          }}
        />
      );
    }
    
    return (
      <SessionResults
        results={{
          totalQuestions: sessionResults.totalQuestions,
          correctAnswers: sessionResults.correctAnswers,
          wrongAnswers: sessionResults.wrongAnswers,
          timeSpent: sessionResults.timeSpent,
          mistakes: sessionResults.mistakes.map(mistake => ({
            question: mistake.item.front,
            userAnswer: mistake.userAction || '',
            correctAnswer: mistake.item.back,
          }))
        }}
        sessionType={sessionType || 'quiz'}
        onRestart={() => {
          SessionManager.clearSession(SESSION_KEYS.GRAMMAR);
          navigate('/grammar/quiz', { state: { count: sessionResults.totalQuestions } });
        }}
        onReviewMistakes={() => {}}
        onExit={() => {
          SessionManager.clearSession(SESSION_KEYS.GRAMMAR);
          navigate('/grammar');
        }}
      />
    );
  }

  if (location.pathname.endsWith('/lessons')) {
    return (
      <PageLayout pageData={{
        title: 'Grammar Learning Path',
        subtitle: 'Your structured path to mastering German grammar.',
        description: '',
        icon: '🗺️',
        gradient: 'from-blue-500 to-purple-600',
      }}>
        <div className="mb-8">
          <button
            onClick={() => navigate('/grammar')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            &larr; Back to Grammar
          </button>
        </div>
        <LessonMap lessons={grammarLessons} currentLesson={currentLesson} />
      </PageLayout>
    );
  }

  const sessionOptions = [
    { name: 'Quick', count: 10, icon: '⚡' },
    { name: 'Normal', count: 20, icon: '💪' },
    { name: 'Intensive', count: 30, icon: '🚀' },
  ];

  return (
    <PageLayout pageData={{
      title: 'German Grammar',
      subtitle: 'Master German grammar with structured lessons',
      description: 'From basic concepts to advanced topics, learn step-by-step.',
      icon: '📝',
      gradient: 'from-blue-500 to-purple-600',
    }}>
      <div className="space-y-8">
        <StartLearningPathCard
          currentLesson={currentLesson}
          totalLessons={grammarLessons.length}
        />
        <SectionGrid
          title="Flashcards"
          description="Hone your skills with targeted exercises."
        >
          {sessionOptions.map((session) => (
            <PracticeModeCard
              key={session.name}
              title={`${session.name} Flashcards`}
              description={`${session.count} questions`}
              icon={session.icon}
              buttonText={`Start ${session.name}`}
              onStart={() => startSession('flashcards', session.count)}
            />
          ))}
        </SectionGrid>
        <SectionGrid
          title="Take a Quiz"
          description="Test your knowledge with a quiz."
        >
          {sessionOptions.map((session) => (
            <PracticeModeCard
              key={session.name}
              title={`${session.name} Quiz`}
              description={`${session.count} questions`}
              icon={session.icon}
              buttonText={`Start ${session.name}`}
              onStart={() => startSession('quiz', session.count)}
            />
          ))}
        </SectionGrid>
      </div>
    </PageLayout>
  );
};

export default Grammar;