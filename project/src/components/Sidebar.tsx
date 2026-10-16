import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Activity, 
  Sparkles, 
  Users, 
  Settings, 
  ChevronDown, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { User } from '../types/User';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  badge?: string;
  badgeVariant?: 'orange' | 'green' | 'teal' | 'amber' | 'blue';
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const badgeVariants = {
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  // Navigation sections dividing all wellness features into logical groups (Image 1 & Image 2)
  const sections: NavSection[] = [
    {
      id: 'assessments',
      title: 'Assessments',
      icon: <Activity className="w-4 h-4 stroke-[1.8]" />,
      items: [
        { id: 'assessment', label: 'Stress Assessment', path: '/assessment', badge: 'Live', badgeVariant: 'green' },
        { id: 'reports', label: 'Weekly Reports', path: '/reports', badge: '7d', badgeVariant: 'blue' },
        { id: 'mood', label: 'Mood Tracker', path: '/mood-tracker', badge: 'Daily', badgeVariant: 'amber' },
        { id: 'results', label: 'Stress Results', path: '/results' }
      ]
    },
    {
      id: 'therapy',
      title: 'Therapy Studio',
      icon: <Sparkles className="w-4 h-4 stroke-[1.8]" />,
      items: [
        { id: 'chatbot', label: 'AI Counselor', path: '/chatbot', badge: 'AI', badgeVariant: 'teal' },
        { id: 'relaxation', label: 'Relaxation Rooms', path: '/relaxation', badge: 'Audio', badgeVariant: 'blue' },
        { id: 'cognitive', label: 'Cognitive Explorer', path: '/cognitive-explorer' },
        { id: 'laughter', label: 'Laughter Therapy', path: '/laughter', badge: '3', badgeVariant: 'orange' },
        { id: 'story', label: 'Story Therapy', path: '/story' },
        { id: 'creative', label: 'Creative Studio', path: '/creative' }
      ]
    },
    {
      id: 'community',
      title: 'Community & Daily',
      icon: <Users className="w-4 h-4 stroke-[1.8]" />,
      items: [
        { id: 'checklist', label: 'Daily Checklist', path: '/checklist', badge: '8', badgeVariant: 'green' },
        { id: 'support', label: 'Support Circle', path: '/support-circle', badge: 'Group', badgeVariant: 'teal' },
        { id: 'resources', label: 'Resources Library', path: '/resources' },
        { id: 'feedback', label: 'Feedback', path: '/feedback' }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      icon: <Settings className="w-4 h-4 stroke-[1.8]" />,
      items: [
        { id: 'profile', label: 'My Profile', path: '/profile' },
        { id: 'settings', label: 'Settings', path: '/settings' },
        { id: 'notifications', label: 'Notifications', path: '/notifications', badge: '3', badgeVariant: 'orange' }
      ]
    }
  ];

  // Section open/closed accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    assessments: true,
    therapy: true,
    community: false,
    account: false
  });

  // Automatically keep the current route's parent section expanded
  useEffect(() => {
    sections.forEach(sec => {
      if (sec.items.some(item => item.path === location.pathname)) {
        setOpenSections(prev => ({ ...prev, [sec.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const displayName: string = (() => {
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    if (full) return full;
    const anyUser = user as any;
    if (anyUser?.name) return String(anyUser.name);
    return user.email || 'User';
  })();

  const initials: string = (() => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.trim().split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : user.name.slice(0, 2).toUpperCase();
    }
    return user.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  })();

  const isDashboardActive = location.pathname === '/';

  return (
    <div className="w-64 flex-shrink-0 relative">
      {/* 100% Fixed Sidebar that never moves and perfectly fits viewport */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 h-screen max-h-screen bg-[#F8F9FA]/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 p-3 flex flex-col justify-between z-40 overflow-hidden select-none shadow-xs transition-colors duration-200">
        
        {/* Top Header: Centered Transparent Logo */}
        <div>
          <div 
            onClick={() => navigate('/')}
            className="flex items-center justify-center p-2 rounded-2xl bg-white/70 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer group transition-all duration-200 shadow-2xs"
            title="Stress Management Platform"
          >
            <img
              src="/logo.png"
              alt="Stress Management"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-200 drop-shadow-xs"
            />
          </div>
        </div>

        {/* Scrollable Navigation Hierarchy (Image 2 style with tree branches) - scrollbar completely hidden */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden my-3 space-y-1.5 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          
          {/* Dashboard Link (Single top-level item with 4-square grid icon) */}
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              isDashboardActive
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/70 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 stroke-[1.8] text-slate-500 dark:text-slate-400" />
            <span>Dashboard</span>
          </button>

          {/* Grouped Tree Navigation Sections */}
          {sections.map(section => {
            const isOpen = !!openSections[section.id];
            const hasActiveChild = section.items.some(item => item.path === location.pathname);

            return (
              <div key={section.id} className="pt-1">
                {/* Section Header with Chevron */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 group cursor-pointer ${
                    hasActiveChild && !isOpen
                      ? 'text-teal-700 dark:text-teal-300 bg-emerald-50/50 dark:bg-slate-800/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {section.icon}
                    </span>
                    <span className="tracking-tight">{section.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Tree Branch Sub-Items (Image 2 exact styling) */}
                {isOpen && (
                  <div className="relative ml-2 pl-0.5 pt-0.5 space-y-0.5">
                    {/* Continuous vertical guide line from first to last item */}
                    <div className="absolute left-[13px] top-0 bottom-3 w-[1.5px] bg-slate-200 dark:bg-slate-700 pointer-events-none" />

                    {section.items.map(item => {
                      const isActive = location.pathname === item.path;

                      return (
                        <div key={item.path} className="relative flex items-center pl-7 pr-1 py-0.5">
                          {/* Curved Branch Tree Connector pointing to item */}
                          <svg 
                            className="absolute left-[13px] top-1/2 -translate-y-1/2 w-3.5 h-4 pointer-events-none text-slate-300 dark:text-slate-600" 
                            viewBox="0 0 14 16" 
                            fill="none"
                          >
                            <path 
                              d="M 1 0 V 8 C 1 12 4 15 8 15 H 14" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                            />
                          </svg>

                          {/* Nav Item: Elevated White Card when Active (like 'Overview' in Image 2) */}
                          <button
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all duration-150 ${
                              isActive
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/80 dark:border-slate-700'
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${badgeVariants[item.badgeVariant || 'green']}`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Area: Compact User Badge & Sign Out */}
        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5 flex-shrink-0">
          <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                    {displayName}
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title={t('logout') || 'Sign Out'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 dark:text-slate-500 py-0.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            <span>HIPAA Secure Privacy</span>
          </div>
        </div>

      </aside>
    </div>
  );
};

export default Sidebar;
