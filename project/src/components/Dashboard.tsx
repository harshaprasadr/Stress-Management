import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  MessageCircle, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Music,
  LogOut,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Target,
  Calendar,
  Zap,
  Award,
  Users,
  AlertTriangle,
  HeartPulse,
  ArrowRight,
  Wind,
  Flame,
  Sparkles
} from 'lucide-react';
import { User } from '../types/User';
import { useI18n } from '../i18n';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onRefreshUser?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onRefreshUser }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [localUser, setLocalUser] = useState<User>(user);

  // Update local user when prop changes
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  // Check if profile is complete
  useEffect(() => {
    if (!localUser.firstName || !localUser.lastName || !localUser.age || !localUser.gender || !localUser.occupation) {
      // Use navigate instead of window.location for better UX
      navigate('/personal-info');
    }
  }, [localUser, navigate]);

  // Calculate dynamic stats from user data
  const quickStats = useMemo(() => {
    // Current Stress Level (from most recent assessment)
    const latestAssessment = localUser.stressHistory?.[localUser.stressHistory.length - 1];
    const currentStressLevel = latestAssessment?.overallStressLevel || 'Unknown';
    
    // Weekly Average (from last 7 days of assessments)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentAssessments = localUser.stressHistory?.filter(assessment => 
      new Date(assessment.date) >= oneWeekAgo
    ) || [];
    
    const weeklyAverage = recentAssessments.length > 0 
      ? (recentAssessments.reduce((sum, assessment) => sum + (assessment.stressLevel || 0), 0) / recentAssessments.length)
      : 0;
    
    // Previous week average for trend calculation
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const previousWeekAssessments = localUser.stressHistory?.filter(assessment => {
      const assessmentDate = new Date(assessment.date);
      return assessmentDate >= twoWeeksAgo && assessmentDate < oneWeekAgo;
    }) || [];
    
    const previousWeekAverage = previousWeekAssessments.length > 0 
      ? (previousWeekAssessments.reduce((sum, assessment) => sum + (assessment.stressLevel || 0), 0) / previousWeekAssessments.length)
      : 0;
    
    const weeklyTrend = weeklyAverage - previousWeekAverage;
    
    // Checklist Completion (from today's checklists)
    const today = new Date().toISOString().split('T')[0];
    const todayChecklists = localUser.checklists?.filter(checklist => checklist.date === today) || [];
    const completedToday = todayChecklists.filter(checklist => checklist.completed).length;
    const checklistCompletion = todayChecklists.length > 0 
      ? Math.round((completedToday / todayChecklists.length) * 100)
      : 0;
    
    // Sessions This Week (count of assessments in last 7 days)
    const sessionsThisWeek = recentAssessments.length;
    
    // Calculate streak (consecutive days with assessments)
    let currentStreak = 0;
    if (localUser.stressHistory && localUser.stressHistory.length > 0) {
      const sortedAssessments = [...localUser.stressHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const uniqueDates = [...new Set(sortedAssessments.map(a => a.date.split('T')[0]))];
      
      let checkDate = new Date();
      for (const dateStr of uniqueDates) {
        const assessmentDate = new Date(dateStr);
        const diffTime = checkDate.getTime() - assessmentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 1) {
          currentStreak++;
          checkDate = new Date(assessmentDate);
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    return {
      currentStressLevel: latestAssessment?.stressLevel ? `${latestAssessment.stressLevel}/10` : 'No data',
      currentStressLevelText: currentStressLevel.charAt(0).toUpperCase() + currentStressLevel.slice(1),
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      weeklyTrend,
      checklistCompletion,
      checklistCompleted: completedToday,
      checklistTotal: todayChecklists.length,
      sessionsThisWeek,
      currentStreak,
      lastAssessmentDate: latestAssessment?.date
    };
  }, [localUser.stressHistory, localUser.checklists]);

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  }, []);

  const menuItems = [
    { 
      icon: Brain, 
      title: 'Stress Assessment', 
      description: 'Analyze your current mental state with multimodal AI sensors',
      color: 'from-blue-500 to-indigo-600',
      category: 'Biometric AI',
      badge: 'Live Sync',
      actionText: 'Take Test',
      route: '/assessment'
    },
    {
      icon: Music,
      title: 'Relaxation Rooms',
      description: 'Ambient 4K nature scenes, lighting modes, and calming audio',
      color: 'from-cyan-500 to-teal-600',
      category: 'Sensory Audio',
      badge: 'Ambient',
      actionText: 'Enter Room',
      route: '/relaxation'
    },
    {
      icon: Activity,
      title: 'Mood Tracker',
      description: 'Daily emotional state logger with milestone streaks & rewards',
      color: 'from-emerald-500 to-teal-600',
      category: 'Daily Log',
      badge: 'Streak',
      actionText: 'Log Mood',
      route: '/mood-tracker'
    },
    {
      icon: Heart,
      title: 'Laughter Therapy',
      description: 'Quick dopamine & joke generator to lift tension and bring smiles',
      color: 'from-pink-500 to-rose-600',
      category: 'Mood Booster',
      badge: 'Fun',
      actionText: 'Get Laughs',
      route: '/laughter'
    },
    {
      icon: BookOpen,
      title: 'Creative Studio',
      description: 'Expressive drawing easel, emotional journaling & digital art',
      color: 'from-indigo-500 to-purple-600',
      category: 'Art & Journal',
      badge: 'Expressive',
      actionText: 'Create Art',
      route: '/creative'
    },
    {
      icon: MessageCircle,
      title: 'Story Therapy',
      description: 'Interactive therapeutic storytelling with choice-driven healing',
      color: 'from-sky-500 to-blue-600',
      category: 'Narrative Care',
      badge: 'Interactive',
      actionText: 'Read & Choose',
      route: '/story'
    },
    {
      icon: Users,
      title: 'Support Circle',
      description: 'Invite trusted contacts for private, double-consented reflections',
      color: 'from-lime-500 to-emerald-600',
      category: 'Care Network',
      badge: 'Private',
      actionText: 'Connect',
      route: '/support-circle'
    },
    {
      icon: AlertTriangle,
      title: 'Cognitive Explorer',
      description: 'Spot cognitive distortions and reframe intrusive thoughts into peace',
      color: 'from-amber-500 to-orange-600',
      category: 'CBT Lab',
      badge: 'Reframing',
      actionText: 'Explore CBT',
      route: '/cognitive-explorer'
    },
    { 
      icon: MessageCircle, 
      title: 'AI Counselor', 
      description: '24/7 empathetic mental health guidance with Dr. MindBot',
      color: 'from-teal-500 to-emerald-600',
      category: 'Therapy Bot',
      badge: '24/7 AI',
      actionText: 'Chat Now',
      route: '/chatbot'
    },
    { 
      icon: FileText, 
      title: 'Weekly Reports', 
      description: 'Track multimodal stress trajectories and weekly vitals analytics',
      color: 'from-purple-500 to-violet-600',
      category: 'Analytics',
      badge: 'Deep Trends',
      actionText: 'View Reports',
      route: '/reports'
    },
    { 
      icon: CheckSquare, 
      title: 'Daily Checklist', 
      description: 'Track mindfulness habits, physical activities, and streak milestones',
      color: 'from-orange-500 to-amber-600',
      category: 'Habits',
      badge: 'Goals',
      actionText: 'Check Tasks',
      route: '/checklist'
    },
    { 
      icon: BookOpen, 
      title: 'Resources', 
      description: 'Curated books, sound meditation tracks, and expert video guides',
      color: 'from-teal-600 to-cyan-600',
      category: 'Library',
      badge: 'Curated',
      actionText: 'Browse Content',
      route: '/resources'
    },
    { 
      icon: Heart, 
      title: 'Feedback', 
      description: 'Share your reflections and experience to help shape the platform',
      color: 'from-pink-600 to-rose-600',
      category: 'Community',
      badge: 'Your Voice',
      actionText: 'Share Thoughts',
      route: '/feedback'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple, Clean & Elegant Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 sm:p-8 text-white mb-8 border border-emerald-500/25 dark:border-white/10 shadow-[0_16px_40px_-16px_rgba(13,148,136,0.3)] select-none">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15 mb-3.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Daily Wellness Sanctuary</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2.5">
                {timeGreeting.text},{' '}
                <span className="capitalize text-emerald-300">
                  {localUser.firstName || localUser.name || 'Friend'}
                </span>
                ! <span className="text-xl sm:text-2xl">{timeGreeting.emoji}</span>
              </h2>

              <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                How are you feeling today? Take a mindful check-in to analyze your stress levels, heart patterns, and mental clarity.
              </p>

              {/* Action Buttons (Clean & Static) */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/assessment')}
                  className="bg-white hover:bg-emerald-50 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  <HeartPulse className="w-4 h-4 text-emerald-600" />
                  <span>Start Today's Check-in</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigate('/relaxation')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-semibold transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-emerald-300" />
                  <span>Relaxation Rooms</span>
                </button>
              </div>
            </div>

            {/* Right Side: Clean Daily Vitals Card */}
            <div className="w-full lg:w-80 bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-lg flex-shrink-0 flex flex-col justify-between">
              
              {/* Top Row: Title + Live Status Pill */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-300" />
                  <span>Daily Vitals</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{quickStats.currentStressLevelText === 'Unknown' ? 'Low Stress' : `${quickStats.currentStressLevelText} Stress`}</span>
                </span>
              </div>

              {/* Telemetry Strip - Clean, balanced, modern */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Flame className="w-4 h-4 fill-amber-400/25" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                      {quickStats.currentStreak} Days
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-200/70 uppercase tracking-wider mt-0.5">
                      Streak
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/15 border border-teal-400/20 flex items-center justify-center text-teal-300 flex-shrink-0">
                    <Zap className="w-4 h-4 fill-teal-400/25" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                      {quickStats.sessionsThisWeek} This Wk
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-200/70 uppercase tracking-wider mt-0.5">
                      Sessions
                    </div>
                  </div>
                </div>
              </div>

              {/* Calming Mindful Quote */}
              <div className="pt-2.5 border-t border-white/10 text-center">
                <p className="text-xs text-emerald-100/90 italic font-medium leading-relaxed">
                  &ldquo;Pause, breathe gently, and observe without judgment.&rdquo;
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Enhanced Quick Stats Cards - Static, Rock-Solid, Zero Movement on Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* 1. Current Stress Card */}
          <div 
            onClick={() => navigate('/assessment')}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/50 dark:hover:border-teal-500/40 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(20,184,166,0.08)] transition-[border-color,box-shadow] duration-200 cursor-pointer select-none"
          >
            {/* Ambient Background Aura (Static, no motion) */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-2xl" />
            
            {/* Integrated Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400" />
            
            {/* Header: Icon + Category + Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs ring-2 ring-teal-100/70 dark:ring-teal-950/50 flex-shrink-0">
                  <Activity className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                    {t('current_stress')}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    {quickStats.currentStressLevel === 'No data' ? (
                      <span className="text-xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                        No data
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                          {quickStats.currentStressLevel.replace('/10', '')}
                        </span>
                        <span className="text-xs font-bold text-slate-400">/ 10</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 border ${
                quickStats.currentStressLevelText === 'Low' ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' :
                quickStats.currentStressLevelText === 'Medium' ? 'bg-amber-50/90 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
                quickStats.currentStressLevelText === 'High' ? 'bg-rose-50/90 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60' :
                'bg-slate-100/90 text-slate-600 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  quickStats.currentStressLevelText === 'Low' ? 'bg-emerald-500' :
                  quickStats.currentStressLevelText === 'Medium' ? 'bg-amber-500' :
                  quickStats.currentStressLevelText === 'High' ? 'bg-rose-500 animate-pulse' :
                  'bg-slate-400'
                }`} />
                <span>{quickStats.currentStressLevelText === 'Unknown' ? 'Ready' : quickStats.currentStressLevelText}</span>
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                  quickStats.currentStressLevelText === 'Low' ? 'from-teal-500 to-emerald-500' :
                  quickStats.currentStressLevelText === 'Medium' ? 'from-amber-400 to-amber-500' :
                  quickStats.currentStressLevelText === 'High' ? 'from-rose-500 to-red-600' :
                  'from-slate-300 to-slate-400'
                }`}
                style={{ 
                  width: quickStats.currentStressLevel !== 'No data' 
                    ? `${(parseFloat(quickStats.currentStressLevel) / 10) * 100}%` 
                    : '0%' 
                }}
              />
            </div>

            {/* Footer Metadata & Action (Static, no translation on hover) */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="truncate">
                {quickStats.lastAssessmentDate 
                  ? `Last check: ${new Date(quickStats.lastAssessmentDate).toLocaleDateString()}`
                  : 'No assessments yet'
                }
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors flex items-center gap-0.5 flex-shrink-0">
                Check &rarr;
              </span>
            </div>
          </div>

          {/* 2. Weekly Average Card */}
          <div 
            onClick={() => navigate('/reports')}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/40 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.08)] transition-[border-color,box-shadow] duration-200 cursor-pointer select-none"
          >
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-2xl" />
            
            {/* Integrated Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400" />
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs ring-2 ring-blue-100/70 dark:ring-blue-950/50 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                    {t('weekly_average')}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                      {quickStats.weeklyAverage}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Trend Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 border ${
                quickStats.weeklyTrend > 0
                  ? 'bg-rose-50/90 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                  : quickStats.weeklyTrend < 0
                  ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                  : 'bg-slate-100/90 text-slate-600 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60'
              }`}>
                {quickStats.weeklyTrend > 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-rose-600" />
                    <span>+{Math.abs(quickStats.weeklyTrend).toFixed(1)}</span>
                  </>
                ) : quickStats.weeklyTrend < 0 ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-emerald-600" />
                    <span>-{Math.abs(quickStats.weeklyTrend).toFixed(1)}</span>
                  </>
                ) : (
                  <span>No change</span>
                )}
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${Math.min(100, (quickStats.weeklyAverage / 10) * 100)}%` }}
              />
            </div>

            {/* Footer Metadata & Action */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="truncate">{quickStats.sessionsThisWeek} checks this week</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors flex items-center gap-0.5 flex-shrink-0">
                Reports &rarr;
              </span>
            </div>
          </div>

          {/* 3. Checklist Card */}
          <div 
            onClick={() => navigate('/checklist')}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/50 dark:hover:border-purple-500/40 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(168,85,247,0.08)] transition-[border-color,box-shadow] duration-200 cursor-pointer select-none"
          >
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-2xl" />
            
            {/* Integrated Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white shadow-xs ring-2 ring-purple-100/70 dark:ring-purple-950/50 flex-shrink-0">
                  <CheckSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                    {t('checklist')}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                      {quickStats.checklistCompletion}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasks Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50/90 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Tasks</span>
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500"
                style={{ width: `${quickStats.checklistCompletion}%` }}
              />
            </div>

            {/* Footer Metadata & Action */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="truncate">{quickStats.checklistCompleted}/{quickStats.checklistTotal} tasks done</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors flex items-center gap-0.5 flex-shrink-0">
                Checklist &rarr;
              </span>
            </div>
          </div>

          {/* 4. Sessions & Streak Card */}
          <div 
            onClick={() => navigate('/assessment')}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/50 dark:hover:border-amber-500/40 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.08)] transition-[border-color,box-shadow] duration-200 cursor-pointer select-none"
          >
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-2xl" />
            
            {/* Integrated Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs ring-2 ring-amber-100/70 dark:ring-amber-950/50 flex-shrink-0">
                  <Brain className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                    {t('sessions')}
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                      {quickStats.sessionsThisWeek}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Total</span>
                  </div>
                </div>
              </div>

              {/* Streak Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex-shrink-0">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500/30" />
                <span>{quickStats.currentStreak}d Streak</span>
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, quickStats.sessionsThisWeek * 20))}%` }}
              />
            </div>

            {/* Footer Metadata & Action */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="truncate">This week's progress</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors flex items-center gap-0.5 flex-shrink-0">
                Session &rarr;
              </span>
            </div>
          </div>

        </div>

        {/* Menu Grid - Wellness Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(item.route)}
                className="group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Glowing top line accent on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-tr ${item.color} rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <IconComponent className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  <span>{item.actionText}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/60 flex items-center justify-center transition-all duration-200 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Tip - Calming Wisdom Banner */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border border-amber-200/60 dark:border-amber-900/40 p-6 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {t('stress_tip_title')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "{t('stress_tip_text')}"
            </p>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;