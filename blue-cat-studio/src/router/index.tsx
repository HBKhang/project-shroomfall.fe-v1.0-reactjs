import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../constants/routes.constants';
import type { UserSession } from '../models/UserSession';
import { Anonymous } from '../pages/Anonymous';

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
      path: ROUTES.PAYMENT_SUCCESS,
      element: <Anonymous transactionOutcome="success" />,
    },
    {
      path: ROUTES.PAYMENT_FAILED,
      element: <Anonymous transactionOutcome="failed" />,
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
