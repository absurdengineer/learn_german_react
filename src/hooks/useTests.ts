import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  StandardizedTestGenerator,
  getDataStatistics,
} from '../data/standardized';
import { SESSION_KEYS, SessionManager } from '../utils/sessionManager';
import {
  generateA1Test,
} from '../utils/testGenerator';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface TestData {
  id: string;
  title: string;
  type: string;
  questions: Question[];
}

type TestGenerator = (count: number) => TestData;

const generateVocabularyTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateVocabularyTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

const generateArticlesTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateArticlesTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

const generateGrammarTest = (count: number): TestData => {
  const standardizedTest = StandardizedTestGenerator.generateGrammarTest({ count });
  return {
    id: standardizedTest.id,
    title: standardizedTest.title,
    type: standardizedTest.type,
    questions: standardizedTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer
    }))
  };
};

export const useTests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testType } = useParams<{ testType?: string }>();

  const getCurrentMode = useCallback((): 'menu' | 'session' | 'results' => {
    const pathname = location.pathname;
    if (pathname.includes('/results')) return 'results';
    if (pathname.includes('/session')) return 'session';
    return 'menu';
  }, [location.pathname]);

  const [sessionMode, setSessionMode] = useState<'menu' | 'session' | 'results'>(getCurrentMode());

  useEffect(() => {
    const mode = getCurrentMode();
    setSessionMode(mode);
  }, [location.pathname, getCurrentMode]);

  const dataStats = getDataStatistics();

  const startTest = (generator: TestGenerator, count: number, type: string) => {
    const test = generator(count);
    
    const sessionData = {
      sessionId: SessionManager.generateSessionId(),
      startTime: Date.now(),
      type: 'test' as const,
      mode: type,
      config: { count, testType: type }
    };
    SessionManager.setSession(SESSION_KEYS.TEST, sessionData);
    
    if (testType) {
      navigate(`/tests/${testType}/session`, { state: { test } });
    } else {
      navigate('/tests/session', { state: { test } });
    }
  };

  return {
    sessionMode,
    dataStats,
    startTest,
    generateA1Test,
    generateVocabularyTest,
    generateArticlesTest,
    generateGrammarTest,
  };
};
