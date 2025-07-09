import type { ReactNode } from 'react';
import { useEffect, useReducer } from 'react';
import { type Achievement, type AppSettings, type Progress, type User, STORAGE_KEYS } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';
import { AppContext } from './appContext';
import { appReducer, initialProgress, initialSettings, initialUser } from './appReducer';
import type { AppContextType } from './appContextTypes';

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
