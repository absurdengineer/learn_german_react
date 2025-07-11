import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { loadGrammarLessons } from '../data/grammarLessons';
import type { GrammarLesson } from '../domain/entities/Grammar';
import { SESSION_KEYS, SessionManager } from '../utils/sessionManager';
import type { FlashcardSessionResult } from '../presentation/components/FlashcardSession';
import type { QuizResults } from '../presentation/components/QuizSession';

export const useGrammar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { day } = useParams<{ day?: string }>();

  const [sessionResults, setSessionResults] = useState<FlashcardSessionResult | null>(null);
  const [sessionType, setSessionType] = useState<'flashcards' | 'quiz' | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  useEffect(() => {
    if (location.pathname.endsWith('/results')) {
      if (location.state?.results) {
        setSessionResults(location.state.results);
        setSessionType(location.state.sessionType || 'quiz');
      } else {
        const storedResults = SessionManager.getResults(SESSION_KEYS.GRAMMAR);
        if (storedResults) {
          const flashcardResults: FlashcardSessionResult = {
            totalQuestions: storedResults.totalQuestions,
            correctAnswers: storedResults.correctAnswers,
            wrongAnswers: storedResults.wrongAnswers,
            timeSpent: storedResults.timeSpent,
            mistakes: storedResults.mistakes?.map(mistake => ({
              item: {
                id: mistake.question || 'unknown',
                front: mistake.question || '',
                back: mistake.correctAnswer || '',
                category: 'grammar',
              },
              userAction: mistake.userAnswer || '',
            })) || [],
            completedItems: [],
          };
          setSessionResults(flashcardResults);
          
          const storedSession = SessionManager.getSession(SESSION_KEYS.GRAMMAR);
          setSessionType(storedSession?.mode as 'flashcards' | 'quiz' || 'quiz');
        }
      }
    }
  }, [location.pathname, location.state]);

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

  const handleSessionComplete = (results: FlashcardSessionResult) => {
    setSessionResults(results);
    
    SessionManager.setResults(SESSION_KEYS.GRAMMAR, {
      sessionId: SessionManager.generateSessionId(),
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      completedAt: Date.now(),
      mistakes: results.mistakes.map(mistake => ({
        question: mistake.item.front,
        userAnswer: mistake.userAction || '',
        correctAnswer: mistake.item.back,
      }))
    });
    
    navigate('/grammar/flashcards/results', { 
      state: { results, sessionType: 'flashcards' }, 
      replace: true 
    });
  };

  const handleQuizComplete = (results: QuizResults) => {
    const flashcardResult: FlashcardSessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      mistakes: results.mistakes.map(mistake => ({
        item: {
          id: mistake.id,
          front: mistake.prompt,
          back: mistake.correctAnswer,
          category: mistake.category || 'grammar',
        },
        userAction: mistake.userAnswer,
      })),
      completedItems: [],
    };
    
    setSessionResults(flashcardResult);
    
    SessionManager.setResults(SESSION_KEYS.GRAMMAR, {
      sessionId: SessionManager.generateSessionId(),
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      completedAt: Date.now(),
      mistakes: results.mistakes.map(mistake => ({
        question: mistake.prompt,
        userAnswer: mistake.userAnswer || '',
        correctAnswer: mistake.correctAnswer,
      }))
    });
    
    navigate('/grammar/quiz/results', { 
      state: { results: flashcardResult, sessionType: 'quiz' }, 
      replace: true 
    });
  };

  const startSession = (type: 'flashcards' | 'quiz', count: number) => {
    setSessionType(type);
    
    SessionManager.setSession(SESSION_KEYS.GRAMMAR, {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: 'grammar',
      mode: type,
      config: { count }
    });
    
    navigate(`/grammar/${type}`, { state: { count } });
  };

  return {
    day,
    sessionResults,
    sessionType,
    selectedWeek,
    setSelectedWeek,
    grammarLessons,
    lessonsByWeek,
    availableWeeks,
    handleSessionComplete,
    handleQuizComplete,
    startSession,
    navigate,
    location,
  };
};
