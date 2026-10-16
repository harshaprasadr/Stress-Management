import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  ChevronDown, 
  CheckCheck, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import { useI18n } from '../i18n';

interface TopNavbarProps {
  user: User;
  onLogout?: () => void;
  title?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ user, onLogout, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const notifications = [
    {
      id: 1,
      title: 'Daily Mindfulness Check-in',
      desc: 'Take 2 minutes to record your stress levels today.',
      time: '10m ago',
      unread: true,
      tag: 'Reminder'
    },
    {
      id: 2,
      title: 'Weekly Stress Trend Ready',
      desc: 'Your multimodal weekly report has been compiled.',
      time: '2h ago',
      unread: true,
      tag: 'Analytics'
    },
    {
      id: 3,
      title: 'Recommended: Breathing Exercise',
      desc: 'Try the 4-7-8 breathing room for quick relaxation.',
      time: 'Yesterday',
      unread: true,
      tag: 'Wellness'
    }
  ];

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-200 select-none shadow-2xs">
      
      {/* Left section: Stylish Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          {/* Subtle Accent Squircle */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500/15 via-emerald-500/15 to-teal-500/25 dark:from-teal-500/25 dark:to-emerald-500/15 border border-teal-500/25 dark:border-teal-400/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Theme Toggle, Notification Toggle & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Dark / Light Mode Toggle - Icon only */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-xs transition-all duration-150 flex items-center justify-center group"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-500 transition-transform duration-200 group-hover:-rotate-12" />
          )}
        </button>

        {/* 1. Notification Toggle */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={`relative p-2 rounded-xl border transition-all duration-150 flex items-center justify-center ${
              notificationOpen
                ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-300 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
            title="Toggle Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-fadeIn">
              <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50/60 dark:from-slate-800 dark:to-slate-850 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-teal-600 text-white rounded-full text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div 
                className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate('/notifications');
                    }}
                    className="p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.desc}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {n.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-850 border-t border-slate-200/60 dark:border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/notifications');
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className={`group flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
              profileOpen
                ? 'bg-slate-100/90 dark:bg-slate-800 border-teal-500/50 shadow-sm ring-2 ring-teal-500/15'
                : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/90 dark:border-slate-700/80 hover:border-teal-500/50 hover:bg-slate-50/80 dark:hover:bg-slate-850 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_-3px_rgba(13,148,136,0.2)] hover:-translate-y-0.5'
            }`}
            title="Account Menu"
          >
            {/* 3D Gradient Avatar Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-300 p-[1.5px] shadow-sm shadow-teal-500/25 group-hover:shadow-md group-hover:shadow-teal-500/35 transition-all duration-200 group-hover:scale-105">
                <div className="w-full h-full rounded-[10px] bg-gradient-to-tr from-teal-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xs tracking-wider shadow-inner">
                  {initials}
                </div>
              </div>
              {/* Online Pulse Indicator directly on avatar */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-2xs"></span>
              </span>
            </div>

            {/* User Name & Status */}
            <div className="hidden sm:block text-left min-w-0 pr-0.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize truncate max-w-[120px] leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {displayName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide flex items-center gap-1">
                  Active
                </span>
              </div>
            </div>

            {/* Chevron Badge */}
            <div className="w-5 h-5 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 flex items-center justify-center transition-colors">
              <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-transform duration-200 ${profileOpen ? 'rotate-180 text-teal-600' : ''}`} />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-fadeIn">
              {/* User summary header */}
              <div className="p-3.5 bg-gradient-to-br from-teal-50/70 to-slate-50 dark:from-slate-800 dark:to-slate-850 border-b border-slate-200/60 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user.email}
                </p>
              </div>

              {/* Menu Actions */}
              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-teal-600" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-teal-600" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Notifications</span>
                </button>
              </div>

              {/* Logout Option */}
              {onLogout && (
                <div className="p-1.5 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default TopNavbar;
