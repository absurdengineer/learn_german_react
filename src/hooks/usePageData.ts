import { useMemo } from 'react';
import { useProgress, useUser } from './useApp';

export interface PageData {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  color: string;
  isCompleted?: boolean;
  progress?: number;
}

export const usePageData = () => {
  const user = useUser();
  const progress = useProgress();

  const pageData = useMemo<Record<string, PageData>>(() => ({
    home: {
      title: 'DeutschMeister',
      subtitle: `Welcome back, ${user?.name || 'Learner'}!`,
      description: 'Continue your German A1 learning journey with our comprehensive study plan',
      icon: '🇩🇪',
      gradient: 'from-blue-600 to-purple-600'
    },
    vocabulary: {
      title: 'Vocabulary',
      subtitle: 'Build your German word bank',
      description: 'Master essential German words with interactive flashcards and quizzes',
      icon: '📚',
      gradient: 'from-green-600 to-blue-600'
    },
    grammar: {
      title: 'Grammar',
      subtitle: 'Master German grammar rules',
      description: 'Learn essential grammar concepts with interactive lessons and exercises',
      icon: '📝',
      gradient: 'from-purple-600 to-pink-600'
    },
    articles: {
      title: 'Articles',
      subtitle: 'Master der, die, das',
      description: 'Learn German articles with visual mnemonics and practice exercises',
      icon: '🏷️',
      gradient: 'from-orange-600 to-red-600'
    },
    speaking: {
      title: 'Speaking',
      subtitle: 'Practice pronunciation',
      description: 'Improve your German pronunciation with guided speaking exercises',
      icon: '🗣️',
      gradient: 'from-orange-600 to-yellow-600'
    },
    writing: {
      title: 'Writing',
      subtitle: 'Practice German writing',
      description: 'Develop your writing skills with guided exercises and templates',
      icon: '✍️',
      gradient: 'from-teal-600 to-green-600'
    },
    tests: {
      title: 'Tests',
      subtitle: 'Test your knowledge',
      description: 'Prepare for the A1 exam with comprehensive practice tests',
      icon: '🎯',
      gradient: 'from-red-600 to-pink-600'
    },
    studyPlan: {
      title: 'Study Plan',
      subtitle: '30-day learning journey',
      description: 'Follow our structured plan to master German A1 in 30 days',
      icon: '📅',
      gradient: 'from-indigo-600 to-purple-600'
    },
    progress: {
      title: 'Progress',
      subtitle: 'Track your learning',
      description: 'Monitor your progress and celebrate your achievements',
      icon: '📊',
      gradient: 'from-emerald-600 to-teal-600'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize your experience',
      description: 'Personalize your learning experience and manage your account',
      icon: '⚙️',
      gradient: 'from-gray-600 to-blue-600'
    }
  }), [user?.name]);

  const quickActions = useMemo<QuickAction[]>(() => [
    {
      id: 'study-plan',
      title: 'Continue Study Plan',
      description: 'Pick up where you left off',
      path: '/study-plan',
      icon: '📅',
      color: 'bg-indigo-500',
      progress: (progress.completedDays.length / 30) * 100
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Practice',
      description: 'Learn new words',
      path: '/vocabulary',
      icon: '📚',
      color: 'bg-green-500',
      progress: progress.vocabularyLearned ? (progress.vocabularyLearned / 500) * 100 : 0
    },
    {
      id: 'grammar',
      title: 'Grammar Lessons',
      description: 'Master German grammar',
      path: '/grammar',
      icon: '📝',
      color: 'bg-purple-500',
      progress: progress.grammarTopicsCompleted ? (progress.grammarTopicsCompleted.length / 6) * 100 : 0
    },
    {
      id: 'articles',
      title: 'Articles Practice',
      description: 'Learn der, die, das',
      path: '/articles',
      icon: '🏷️',
      color: 'bg-orange-500',
      progress: 0 // TODO: Add articles progress tracking
    },
    {
      id: 'speaking',
      title: 'Speaking Practice',
      description: 'Practice pronunciation',
      path: '/speaking',
      icon: '🗣️',
      color: 'bg-yellow-500',
      progress: 0 // TODO: Add speaking progress tracking
    },
    {
      id: 'writing',
      title: 'Writing Practice',
      description: 'Improve your writing',
      path: '/writing',
      icon: '✍️',
      color: 'bg-teal-500',
      progress: 0 // TODO: Add writing progress tracking
    },
    {
      id: 'tests',
      title: 'Take a Test',
      description: 'Test your knowledge',
      path: '/tests',
      icon: '🎯',
      color: 'bg-red-500',
      progress: progress.testScores?.length ? (progress.testScores.length / 10) * 100 : 0
    },
    {
      id: 'progress',
      title: 'View Progress',
      description: 'Track your learning',
      path: '/progress',
      icon: '📊',
      color: 'bg-emerald-500'
    }
  ], [progress]);

  return {
    pageData,
    quickActions,
    getPageData: (page: string) => pageData[page] || pageData.home,
    getQuickAction: (id: string) => quickActions.find(action => action.id === id)
  };
};
