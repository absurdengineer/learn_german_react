import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useUser() {
  const { state } = useApp();
  return state.user;
}

export function useProgress() {
  const { state } = useApp();
  return state.progress;
}

export function useSettings() {
  const { state } = useApp();
  return state.settings;
}

export function useAchievements() {
  const { state } = useApp();
  return state.achievements;
}
