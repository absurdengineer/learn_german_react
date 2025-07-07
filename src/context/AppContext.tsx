import type { ReactNode } from 'react';
import React, { createContext, useEffect, useReducer } from 'react';
import type { Achievement, AppSettings, Progress, User } from '../types';
import { STORAGE_KEYS } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

// Initial states
const initialUser: User = {
  id: '',
  name: '',
  startDate: new Date(),
  currentDay: 1,
  totalStudyTime: 0,
};

const initialProgress: Progress = {
  userId: '',
  currentDay: 1,
  completedDays: [],
  vocabularyLearned: 0,
  vocabularyMastered: 0,
  grammarTopicsCompleted: [],
  testScores: [],
  streakDays: 0,
  lastStudyDate: new Date(),
  weeklyProgress: [],
};

const initialSettings: AppSettings = {
  language: 'en',
  theme: 'light',
  notifications: true,
  dailyReminder: true,
  reminderTime: '09:00',
  soundEnabled: true,
  autoPlayAudio: true,
  studyGoalMinutes: 120, // 2 hours daily
  spacedRepetitionEnabled: true,
};

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_PROGRESS'; payload: Progress }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<Progress> }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'COMPLETE_DAY'; payload: number }
  | { type: 'ADD_STUDY_TIME'; payload: number }
  | { type: 'UPDATE_VOCABULARY_PROGRESS'; payload: { learned: number; mastered: number } }
  | { type: 'RESET_APP' };

// App state interface
interface AppState {
  user: User;
  progress: Progress;
  settings: AppSettings;
  achievements: Achievement[];
  isLoading: boolean;
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  completeDay: (day: number) => void;
  addStudyTime: (minutes: number) => void;
  updateVocabularyProgress: (learned: number, mastered: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  unlockAchievement: (achievementId: string) => void;
  resetProgress: () => void;
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload,
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload },
      };

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload,
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload
            ? { ...achievement, unlocked: true, unlockedDate: new Date() }
            : achievement
        ),
      };

    case 'COMPLETE_DAY': {
      const completedDays = [...state.progress.completedDays];
      if (!completedDays.includes(action.payload)) {
        completedDays.push(action.payload);
      }
      
      // Update streak
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = state.progress.streakDays;
      if (state.progress.lastStudyDate.toDateString() === yesterday.toDateString()) {
        newStreak += 1;
      } else if (state.progress.lastStudyDate.toDateString() !== today.toDateString()) {
        newStreak = 1;
      }

      return {
        ...state,
        progress: {
          ...state.progress,
          currentDay: Math.max(state.progress.currentDay, action.payload + 1),
          completedDays,
          lastStudyDate: today,
          streakDays: newStreak,
        },
      };
    }

    case 'ADD_STUDY_TIME':
      return {
        ...state,
        user: {
          ...state.user,
          totalStudyTime: state.user.totalStudyTime + action.payload,
        },
      };

    case 'UPDATE_VOCABULARY_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          vocabularyLearned: action.payload.learned,
          vocabularyMastered: action.payload.mastered,
        },
      };

    case 'RESET_APP':
      return {
        user: { ...initialUser, id: state.user.id, name: state.user.name },
        progress: { ...initialProgress, userId: state.user.id },
        settings: initialSettings,
        achievements: state.achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
        isLoading: false,
      };

    default:
      return state;
  }
}

// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    user: initialUser,
    progress: initialProgress,
    settings: initialSettings,
    achievements: [],
    isLoading: true,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const savedUser = loadFromStorage<User>(STORAGE_KEYS.USER);
        const savedProgress = loadFromStorage<Progress>(STORAGE_KEYS.PROGRESS);
        const savedSettings = loadFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS);
        const savedAchievements = loadFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);

        if (savedUser) {
          dispatch({ type: 'SET_USER', payload: savedUser });
        }

        if (savedProgress) {
          dispatch({ type: 'SET_PROGRESS', payload: savedProgress });
        }

        if (savedSettings) {
          dispatch({ type: 'SET_SETTINGS', payload: savedSettings });
        }

        if (savedAchievements) {
          dispatch({ type: 'SET_ACHIEVEMENTS', payload: savedAchievements });
        }
      } catch (error) {
        console.error('Error loading app data:', error);
      }
    };

    loadAppData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.user.id) {
      saveToStorage(STORAGE_KEYS.USER, state.user);
    }
  }, [state.user]);

  useEffect(() => {
    if (state.progress.userId) {
      saveToStorage(STORAGE_KEYS.PROGRESS, state.progress);
    }
  }, [state.progress]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
  }, [state.settings]);

  useEffect(() => {
    if (state.achievements.length > 0) {
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, state.achievements);
    }
  }, [state.achievements]);

  // Helper functions
  const completeDay = (day: number) => {
    dispatch({ type: 'COMPLETE_DAY', payload: day });
  };

  const addStudyTime = (minutes: number) => {
    dispatch({ type: 'ADD_STUDY_TIME', payload: minutes });
  };

  const updateVocabularyProgress = (learned: number, mastered: number) => {
    dispatch({ type: 'UPDATE_VOCABULARY_PROGRESS', payload: { learned, mastered } });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const unlockAchievement = (achievementId: string) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId });
  };

  const resetProgress = () => {
    dispatch({ type: 'RESET_APP' });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    completeDay,
    addStudyTime,
    updateVocabularyProgress,
    updateSettings,
    unlockAchievement,
    resetProgress,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
