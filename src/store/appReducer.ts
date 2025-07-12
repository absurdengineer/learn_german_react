import type { AppSettings, Progress, User } from '../types';
import type { AppAction, AppState } from './appContextTypes';

// Initial states
export const initialUser: User = {
  id: '',
  name: '',
  startDate: new Date(),
  currentDay: 1,
  totalStudyTime: 0,
};

export const initialProgress: Progress = {
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

export const initialSettings: AppSettings = {
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

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
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
