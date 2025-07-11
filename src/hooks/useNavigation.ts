import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  isActive?: boolean;
}

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const startSession = useCallback((type: string, config?: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    navigate(`/${type}${query ? `?${query}` : ''}`);
  }, [navigate]);

  const exitSession = useCallback((returnPath: string = '/') => {
    navigate(returnPath);
  }, [navigate]);

  const primaryNavigation: NavigationItem[] = [
    { id: 'home', label: 'Home', path: '/', icon: '🏠' },
    { id: 'study-plan', label: 'Study Plan', path: '/study-plan', icon: '📅' },
    { id: 'vocabulary', label: 'Vocabulary', path: '/vocabulary', icon: '📚' },
    { id: 'grammar', label: 'Grammar', path: '/grammar', icon: '📝' },
    { id: 'progress', label: 'Progress', path: '/progress', icon: '📊' }
  ];

  const secondaryNavigation: NavigationItem[] = [
    { id: 'articles', label: 'Articles', path: '/articles', icon: '🏷️' },
    { id: 'speaking', label: 'Speaking', path: '/speaking', icon: '🗣️' },
    { id: 'writing', label: 'Writing', path: '/writing', icon: '✍️' },
    { id: 'tests', label: 'Tests', path: '/tests', icon: '🎯' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return {
    navigateTo,
    goBack,
    goHome,
    startSession,
    exitSession,
    primaryNavigation,
    secondaryNavigation
  };
};
