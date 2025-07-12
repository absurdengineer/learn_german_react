import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSession?: boolean;
  redirectTo?: string;
  sessionKey?: string;
}

/**
 * ProtectedRoute component to restrict access to certain routes
 * Prevents direct access to results/summary pages without completing a session
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresSession = true,
  redirectTo,
  sessionKey = 'activeSession'
}) => {
  const location = useLocation();
  
  // Check if this is a results/summary page that requires a session
  const isResultsPage = location.pathname.includes('/results') || 
                       location.pathname.includes('/summary') ||
                       location.pathname.includes('/complete');
  
  // Check for active session data in sessionStorage or location state
  const hasSessionData = () => {
    // Check location state first (when navigating from a session)
    if (location.state?.sessionData || location.state?.results || location.state?.test) {
      return true;
    }
    
    // Check sessionStorage for persistent session data
    try {
      const sessionData = sessionStorage.getItem(sessionKey);
      return sessionData !== null;
    } catch {
      return false;
    }
  };

  // If this is a results page and requires session, check for session data
  if (requiresSession && isResultsPage && !hasSessionData()) {
    // Determine appropriate redirect based on current path
    const getRedirectPath = () => {
      if (redirectTo) return redirectTo;
      
      const pathSegments = location.pathname.split('/');
      
      if (pathSegments.includes('vocabulary')) return '/vocabulary';
      if (pathSegments.includes('articles')) return '/articles';
      if (pathSegments.includes('grammar')) return '/grammar';
      if (pathSegments.includes('speaking')) return '/speaking';
      if (pathSegments.includes('writing')) return '/writing';
      if (pathSegments.includes('tests')) return '/tests';
      if (pathSegments.includes('study-plan')) return '/study-plan';
      
      return '/';
    };

    return <Navigate to={getRedirectPath()} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
