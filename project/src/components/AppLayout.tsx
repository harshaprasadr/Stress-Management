import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { User } from '../types/User';

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/assessment': 'Stress Assessment',
  '/results': 'Assessment Results',
  '/chatbot': 'AI Counselor',
  '/reports': 'Weekly Reports',
  '/checklist': 'Daily Checklist',
  '/resources': 'Resources Library',
  '/feedback': 'User Feedback',
  '/laughter': 'Laughter Therapy',
  '/mood-tracker': 'Mood Tracker',
  '/relaxation': 'Relaxation Rooms',
  '/creative': 'Creative Studio',
  '/story': 'Story Therapy',
  '/support-circle': 'Support Circle',
  '/cognitive-explorer': 'Cognitive Explorer',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/notifications': 'Notifications'
};

const AppLayout: React.FC<AppLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const isRelaxation = location.pathname === '/relaxation';

  // For Relaxation Rooms, provide an immersive fullscreen experience without sidebar or navbar
  if (isRelaxation) {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-white select-none z-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
      {/* 100% Fixed Sidebar that persists across every single page */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content Pane next to Fixed Sidebar */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Navbar that persists across every single page */}
        <TopNavbar user={user} onLogout={onLogout} title={title} />

        {/* Dynamic Route Page Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
