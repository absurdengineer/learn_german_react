import { useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { AppContext } from "./appContext";
import type { AppState, AppAction } from "./appContext";
import { STORAGE_KEYS } from "../types";

interface AppProviderProps {
  children: ReactNode;
}

// Load data from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Save data to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_USER":
      saveToStorage(STORAGE_KEYS.USER, action.payload);
      return { ...state, user: action.payload };

    case "SET_PROGRESS":
      saveToStorage(STORAGE_KEYS.PROGRESS, action.payload);
      return { ...state, progress: action.payload };

    case "SET_SETTINGS":
      saveToStorage(STORAGE_KEYS.SETTINGS, action.payload);
      return { ...state, settings: action.payload };

    case "SET_ACHIEVEMENTS":
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, action.payload);
      return { ...state, achievements: action.payload };

    case "UPDATE_PROGRESS":
      const updatedProgress = { ...state.progress, ...action.payload };
      saveToStorage(STORAGE_KEYS.PROGRESS, updatedProgress);
      return {
        ...state,
        progress: updatedProgress,
      };

    case "UNLOCK_ACHIEVEMENT":
      const updatedAchievements = state.achievements.map((achievement) =>
        achievement.id === action.payload.id
          ? { ...achievement, unlocked: true, unlockedDate: new Date() }
          : achievement
      );
      saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, updatedAchievements);
      return {
        ...state,
        achievements: updatedAchievements,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    progress: null,
    settings: loadFromStorage(STORAGE_KEYS.SETTINGS, {
      language: "en",
      theme: "light",
      notifications: true,
      dailyReminder: true,
      reminderTime: "09:00",
      soundEnabled: true,
      autoPlayAudio: false,
      studyGoalMinutes: 30,
      spacedRepetitionEnabled: true,
    }),
    achievements: loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, [
      {
        id: "first_day",
        title: "First Steps",
        description: "Complete your first day of study",
        unlocked: false,
        unlockedDate: null,
      },
      {
        id: "week_streak",
        title: "Week Warrior",
        description: "Study for 7 days in a row",
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        goal: 7,
      },
      {
        id: "vocabulary_master",
        title: "Vocabulary Master",
        description: "Learn 100 vocabulary words",
        unlocked: false,
        unlockedDate: null,
        progress: 0,
        goal: 100,
      },
    ]),
    isLoading: true,
  });

  // Load user and progress data on mount
  useEffect(() => {
    const user = loadFromStorage(STORAGE_KEYS.USER, null);
    const progress = loadFromStorage(STORAGE_KEYS.PROGRESS, null);

    if (user) {
      dispatch({ type: "SET_USER", payload: user });
    }

    if (progress) {
      dispatch({ type: "SET_PROGRESS", payload: progress });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
