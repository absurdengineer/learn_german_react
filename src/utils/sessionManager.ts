/**
 * Utility functions for managing session data across the application
 * Used to track active practice/test sessions and prevent unauthorized access to results pages
 */

export interface SessionData {
  sessionId: string;
  startTime: number;
  type: 'vocabulary' | 'articles' | 'grammar' | 'speaking' | 'writing' | 'test';
  mode?: string;
  category?: string;
  config?: Record<string, unknown>;
}

export interface SessionResults {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  completedAt: number;
  mistakes?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    [key: string]: unknown;
  }>;
}

export const SessionManager = {
  // Set session data when starting a practice/test
  setSession: (sessionKey: string, data: SessionData) => {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  },

  // Get session data
  getSession: (sessionKey: string): SessionData | null => {
    try {
      const data = sessionStorage.getItem(sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve session data:', error);
      return null;
    }
  },

  // Set session results
  setResults: (sessionKey: string, results: SessionResults) => {
    try {
      sessionStorage.setItem(`${sessionKey}_results`, JSON.stringify(results));
    } catch (error) {
      console.warn('Failed to save session results:', error);
    }
  },

  // Get session results
  getResults: (sessionKey: string): SessionResults | null => {
    try {
      const data = sessionStorage.getItem(`${sessionKey}_results`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve session results:', error);
      return null;
    }
  },

  // Clear session data when session ends
  clearSession: (sessionKey: string) => {
    try {
      sessionStorage.removeItem(sessionKey);
      sessionStorage.removeItem(`${sessionKey}_results`);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  },

  // Check if session exists
  hasSession: (sessionKey: string): boolean => {
    try {
      return sessionStorage.getItem(sessionKey) !== null;
    } catch {
      return false;
    }
  },

  // Check if results exist
  hasResults: (sessionKey: string): boolean => {
    try {
      return sessionStorage.getItem(`${sessionKey}_results`) !== null;
    } catch {
      return false;
    }
  },

  // Generate a unique session ID
  generateSessionId: (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get all active sessions
  getActiveSessions: (): SessionData[] => {
    try {
      const sessions: SessionData[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('session_') && !key.includes('_results')) {
          const sessionData = SessionManager.getSession(key);
          if (sessionData) {
            sessions.push(sessionData);
          }
        }
      }
      return sessions;
    } catch {
      return [];
    }
  },

  // Clear all expired sessions (older than 24 hours)
  clearExpiredSessions: () => {
    try {
      const now = Date.now();
      const expireTime = 24 * 60 * 60 * 1000; // 24 hours

      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('session_')) {
          const sessionData = SessionManager.getSession(key);
          if (sessionData && (now - sessionData.startTime) > expireTime) {
            SessionManager.clearSession(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to clear expired sessions:', error);
    }
  }
};

// Common session keys
export const SESSION_KEYS = {
  VOCABULARY: 'vocabulary_session',
  ARTICLES: 'articles_session',
  GRAMMAR: 'grammar_session',
  SPEAKING: 'speaking_session',
  WRITING: 'writing_session',
  TEST: 'test_session',
  STUDY_PLAN: 'study_plan_session'
} as const;
