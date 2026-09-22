import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../constants/routes.constants';
import type { UserSession } from '../models/UserSession';

interface RouterConfigProps {
  user: UserSession | null;
  onLogout: () => void;
}

export const createAppRouter = ({ user, onLogout }: RouterConfigProps) => {
  return createBrowserRouter([
    {
      path: ROUTES.HOME,
      element: user ? <Navigate to={ROUTES.WORKSPACE} replace /> : <Navigate to={ROUTES.LOGIN} replace />,
    },
    {
      path: ROUTES.LOGIN,
      element: !user ? (
        <AuthPage />
      ) : (
        <Navigate to={ROUTES.WORKSPACE} replace />
      ),
    },
    {
      element: <ProtectedRoute isAllowed={!!user} />,
      children: [
        {
          path: ROUTES.WORKSPACE,
          element: <WorkspacePage user={user!} onLogout={onLogout} />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.HOME} replace />,
    },
  ]);
};