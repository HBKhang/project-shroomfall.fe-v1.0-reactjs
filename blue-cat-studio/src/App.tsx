import { useState, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppRouter } from './router';
import { AUTH_KEYS } from './constants/auth.constants';
import { parseTokenToSession } from './utils/auth.utils';
import { ErrorToastContainer } from './components/common/ErrorToastContainer/ErrorToastContainer';
import type { UserSession } from './models/UserSession';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export default function App() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for an existing token on mount
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    const session = parseTokenToSession(token);
    
    if (session) {
      setUser(session);
    } else if (token) {
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    }
    setLoading(false);

    // 2. Event Listeners for seamless React Router state sync
    const handleLoginEvent = () => {
      const activeToken = localStorage.getItem(AUTH_KEYS.TOKEN);
      setUser(parseTokenToSession(activeToken));
    };
    
    const handleForcedLogout = () => setUser(null);

    window.addEventListener('auth:login', handleLoginEvent);
    window.addEventListener('auth:logout', handleForcedLogout);
    
    return () => {
      window.removeEventListener('auth:login', handleLoginEvent);
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    setUser(null);
  };

  const router = useMemo(() => 
    createAppRouter({ user, onLogout: handleLogout }), 
    [user]
  );

  if (loading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* 1. This triggers your routes */}
      <RouterProvider router={router} />
      
      {/* 2. This overlays toasts safely over the active view */}
      <ErrorToastContainer /> 
    </QueryClientProvider>
  );
}