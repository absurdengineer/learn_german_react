import type { Achievement, AppSettings, Progress, User } from '../types';

// Action types
export type AppAction =
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
export interface AppState {
  user: User;
  progress: Progress;
  settings: AppSettings;
  achievements: Achievement[];
  isLoading: boolean;
}

// Context interface
export interface AppContextType {
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
