import React from 'react';
import { WorkspaceLayout } from '../components/layout/Workspace/WorkspaceLayout';
import type { UserSession } from '../models/UserSession';

interface WorkspacePageProps {
  user: UserSession;
  onLogout: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ user, onLogout }) => {
  return (
    <WorkspaceLayout user={user} onLogout={onLogout}>
      {/* This is where your layout renders its sub-views. 
        Because your updated WorkspaceLayout already has fallback switch-rendering inside,
        leaving this empty allows the internal state inside WorkspaceLayout to toggle the panels!
      */}
    </WorkspaceLayout>
  );
};