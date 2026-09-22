import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ isAllowed, redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};