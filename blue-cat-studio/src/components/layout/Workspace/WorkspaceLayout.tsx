import React, { useState } from 'react';
import { ROUTES } from '../../../constants/routes.constants';
import { EffectManagement } from '../../game-designer-components/meta-management/EffectManagement/EffectManagement';
import { ItemManagement } from '../../game-designer-components/meta-management/ItemManagement/ItemManagement';
import { RoomManagement } from '../../game-designer-components/room-management/RoomManagement';
import { EntityManagement } from '../../game-designer-components/entity-management/EntityManagement';
import { LocalizationManagement } from '../../game-designer-components/localization-management/LocalizationManagement';
import { AdminDashboard } from '../../admin-components/dashboard/AdminDashboard';
import { DesignDefinitionManagement } from '../../game-designer-components/versioning-management/DesignDefinitionManagement';
import { QuestManagement } from '../../game-master-components/quest-management/QuestManagement';
import type { UserSession } from '../../../models/UserSession';
import { Role } from '../../../contracts/enum/identity-domain/role';
import './WorkspaceLayout.css';
import Logo from './../../../assets/logo/logo-3.png';
import Avatar from './../../../assets/logo/avatar.gif';

interface WorkspaceLayoutProps {
  user: UserSession | null;
  onLogout: () => void;
  children?: React.ReactNode;
}

interface WorkspaceHeaderProps {
  username: string;
  role: string;
  onLogout: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles: Role[];
  page: React.FC;
}

interface WorkspaceSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  items: MenuItem[];
}

// Roles mirror the server's [Authorize(Roles = ...)] on each controller
const DESIGN_ROLES = [Role.Designer, Role.Admin];

const MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', path: 'dashboard', icon: 'dashboard', roles: [Role.Admin], page: AdminDashboard },
  { name: 'Effect Design', path: 'effect-designer', icon: 'bolt', roles: DESIGN_ROLES, page: EffectManagement },
  { name: 'Item Design', path: 'item-designer', icon: 'inventory_2', roles: DESIGN_ROLES, page: ItemManagement },
  { name: 'Entity Design', path: 'entity-designer', icon: 'smart_toy', roles: DESIGN_ROLES, page: EntityManagement },
  { name: 'Room Design', path: 'room-designer', icon: 'map', roles: DESIGN_ROLES, page: RoomManagement },
  { name: 'Localization Design', path: 'localization-designer', icon: 'translate', roles: DESIGN_ROLES, page: LocalizationManagement },
  { name: 'Definition Design', path: 'definition-designer', icon: 'architecture', roles: DESIGN_ROLES, page: DesignDefinitionManagement },
  { name: 'Quest Management', path: 'quest-manager', icon: 'assignment', roles: [Role.GameMaster], page: QuestManagement },
];

const getMenuItemsForRole = (role: Role) => MENU_ITEMS.filter((item) => item.roles.includes(role));

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ username, role, onLogout }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'Disconnected';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-sky-100 bg-white px-6 shadow-sm font-sans antialiased">
      <div className="flex items-center gap-2.5 text-xs font-medium text-sky-600">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
        </span>
        <span className="tracking-wide">Live Server Workspace:</span>
        <span className="rounded bg-sky-50 px-2 py-1 font-mono text-xs font-semibold text-sky-800 ring-1 ring-inset ring-sky-600/10">
          {apiBaseUrl}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r border-sky-100 pr-6 text-right">
          <div>
            <div className="text-sm font-semibold text-sky-950 tracking-tight">
              {username}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-500/90">
              {role}
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 text-sm font-bold text-white shadow-sm shadow-sky-200">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-100 cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    </header>
  );
};

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ currentPath, onNavigate, items }) => {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sky-100 bg-white font-sans antialiased h-full">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sky-100 px-6 font-bold tracking-tight text-sky-950">
        <img src={Logo} alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
        <span className="text-sm font-extrabold tracking-wider">BLUE CAT STUDIO</span>
      </div>

      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto scrollbar-hidden">
        {items.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-200'
                  : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg leading-none">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sky-100 bg-sky-50/50 p-4 space-y-3">
        <div className="w-full">
          <img src={Avatar} alt="Avatar" className="w-full aspect-square rounded-lg object-cover border border-sky-200 shadow-sm" />
        </div>
        <div className="text-[11px] font-medium text-sky-600/90 space-y-1">
          <div className="flex items-center justify-between">
            <span>Environment:</span>
            <span className="rounded bg-sky-100 px-1.5 py-0.5 font-bold text-sky-800">Production</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version:</span>
            <span className="font-mono font-semibold text-sky-500">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ user, onLogout, children }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  if (!user) {
    window.location.href = ROUTES.LOGIN;
    return null;
  }

  // Only pages the token's role may open; a stale or forbidden selection falls back to the first allowed page
  const allowedItems = getMenuItemsForRole(user.role);
  const activeItem = allowedItems.find((item) => item.path === selectedPath) ?? allowedItems[0];
  const ActivePage = activeItem?.page;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sky-50/50 font-sans antialiased text-sky-950">
      <WorkspaceSidebar
        currentPath={activeItem?.path ?? ''}
        onNavigate={setSelectedPath}
        items={allowedItems}
      />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <WorkspaceHeader username={user.name} role={user.role} onLogout={onLogout} />

        <main className="flex-1 bg-sky-50/30 p-8 overflow-y-auto scrollbar-hidden">
          {children ? (
            children
          ) : (
            <div className="h-full w-full">
              {ActivePage ? (
                <ActivePage />
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="material-symbols-outlined text-4xl text-sky-300">lock</span>
                  <p className="mt-3 text-sm font-semibold text-sky-900">No workspace access</p>
                  <p className="mt-1 text-xs text-sky-600/80">
                    Your role ({user.role}) has no pages in this studio. Ask an admin for access.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};