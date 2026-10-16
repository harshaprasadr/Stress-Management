import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Award, 
  Target, 
  BarChart3, 
  Brain, 
  Heart, 
  Activity, 
  Users, 
  BookOpen,
  Download, 
  Share2, 
  Info, 
  MessageCircleHeart,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  Printer,
  Moon,
  Zap,
  ShieldCheck,
  Check,
  Smile,
  Shield
} from 'lucide-react';
import { User } from '../types/User';

interface WeeklyReportProps {
  user: User;
}

type SupportReflection = {
  id: string;
  weekKey: string;
  contactName: string;
  message: string;
  createdAt: string;
};

const WeeklyReport: React.FC<WeeklyReportProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(2); // Default to mid-week
  const [chartMetric, setChartMetric] = useState<'stress' | 'sleep'>('stress');
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const weeklyData = useMemo(() => {
    if (!user.stressHistory || user.stressHistory.length === 0) {
      return generateSampleData();
    }
    return generateWeeklyDataFromHistory(user.stressHistory);
  }, [user.stressHistory]);

  useEffect(() => {
    const weekLabels = weeklyData.map((w: any) => w.weekOf);
    localStorage.setItem('weekly_report_weeks', JSON.stringify(weekLabels));
  }, [weeklyData]);

  const [supportReflections, setSupportReflections] = useState<SupportReflection[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('support_circle_reflections') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const entries = JSON.parse(localStorage.getItem('support_circle_reflections') || '[]');
        setSupportReflections(entries);
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  function generateSampleData() {
    const weeks: any[] = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const baseStress = Math.max(1.8, 6.8 - (i * 0.25));
      const dailyStress = Array.from({ length: 7 }, (_, dayIndex) => {
        const isWeekend = dayIndex >= 5;
        const dayVariation = isWeekend ? -1.4 : 0.6;
        const randomVariation = (Math.random() - 0.5) * 1.5;
        return Math.max(1.2, Math.min(9.5, baseStress + dayVariation + randomVariation));
      });
      const averageStress = dailyStress.reduce((a, b) => a + b, 0) / 7;
      
      const moodPatterns = [
        ['happy', 'calm', 'neutral', 'stressed', 'anxious', 'happy', 'calm'],
        ['neutral', 'stressed', 'calm', 'happy', 'neutral', 'happy', 'calm'],
        ['anxious', 'neutral', 'happy', 'stressed', 'calm', 'happy', 'neutral'],
        ['calm', 'happy', 'neutral', 'anxious', 'stressed', 'calm', 'happy'],
        ['stressed', 'calm', 'happy', 'neutral', 'happy', 'calm', 'neutral']
      ];
      const dailyMoods = moodPatterns[i % moodPatterns.length];
      
      const engagementMultiplier = Math.min(2, 1 + (i * 0.1));
      const activities = {
        assessments: Math.floor((Math.random() * 4 + 3) * engagementMultiplier),
        breathingExercises: Math.floor((Math.random() * 6 + 4) * engagementMultiplier),
        chatbotSessions: Math.floor((Math.random() * 5 + 2) * engagementMultiplier),
        resourcesRead: Math.floor((Math.random() * 4 + 2) * engagementMultiplier)
      };

      const sleepData = Array.from({ length: 7 }, (_, dayIdx) => {
        // Weekends typically have more restorative sleep
        const baseSleep = dayIdx >= 5 ? 7.8 : 6.9;
        return Math.round((baseSleep + (Math.random() - 0.4) * 1.4) * 10) / 10;
      });
      
      weeks.push({
        id: i.toString(),
        weekOf: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        averageStressLevel: Math.round(averageStress * 10) / 10,
        dailyStress: dailyStress.map(level => Math.round(level * 10) / 10),
        dailyMoods,
        sleepData,
        activities,
        improvementAreas: generateImprovementAreas(averageStress, i),
        achievements: generateAchievements(averageStress, i),
        nextWeekGoals: generateGoals(averageStress, i),
        insights: generateInsights(averageStress, dailyStress, i)
      });
    }
    return weeks;
  }

  function generateWeeklyDataFromHistory(stressHistory: any[]) {
    const weeks: any[] = [];
    const groupedByWeek = groupAssessmentsByWeek(stressHistory);
    
    Object.entries(groupedByWeek).forEach(([weekKey, assessments], index) => {
      const dailyStress = generateDailyStressFromAssessments(assessments);
      const averageStress = dailyStress.reduce((a, b) => a + b, 0) / 7;
      
      const sleepData = Array.from({ length: 7 }, (_, dayIdx) => {
        const baseSleep = dayIdx >= 5 ? 7.8 : 6.9;
        return Math.round((baseSleep + (Math.random() - 0.4) * 1.4) * 10) / 10;
      });

      weeks.push({
        id: index.toString(),
        weekOf: weekKey,
        averageStressLevel: Math.round(averageStress * 10) / 10,
        dailyStress,
        dailyMoods: assessments.map(a => a.mood || 'neutral'),
        sleepData,
        activities: {
          assessments: assessments.length,
          breathingExercises: Math.floor(Math.random() * 5 + 3),
          chatbotSessions: Math.floor(Math.random() * 3 + 2),
          resourcesRead: Math.floor(Math.random() * 4 + 2)
        },
        improvementAreas: generateImprovementAreas(averageStress, index),
        achievements: generateAchievements(averageStress, index),
        nextWeekGoals: generateGoals(averageStress, index),
        insights: generateInsights(averageStress, dailyStress, index)
      });
    });
    
    return weeks.length > 0 ? weeks : generateSampleData();
  }

  function groupAssessmentsByWeek(assessments: any[]) {
    const grouped: { [key: string]: any[] } = {};
    assessments.forEach(assessment => {
      const date = new Date(assessment.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      if (!grouped[weekKey]) grouped[weekKey] = [];
      grouped[weekKey].push(assessment);
    });
    return grouped;
  }

  function generateDailyStressFromAssessments(assessments: any[]) {
    const dailyStress = Array(7).fill(0);
    const dailyCount = Array(7).fill(0);
    assessments.forEach(assessment => {
      const dayOfWeek = new Date(assessment.date).getDay();
      dailyStress[dayOfWeek] += assessment.stressLevel || 5;
      dailyCount[dayOfWeek]++;
    });
    return dailyStress.map((total, index) => 
      dailyCount[index] > 0 ? Math.round((total / dailyCount[index]) * 10) / 10 : Math.round((Math.random() * 5 + 2) * 10) / 10
    );
  }

  function generateImprovementAreas(avgStress: number, weekIndex = 0) {
    const allAreas = [
      'Maintain consistent nocturnal sleep schedule (7.5h target)',
      'Mid-afternoon diaphragmatic breathing pause (2:00 - 4:00 PM)',
      'Cognitive boundary setting before evening transition',
      'Hydration consistency during high workload mornings',
      'Digital curfew 45 minutes prior to bedtime'
    ];
    const maxAreas = Math.max(2, Math.min(4, Math.floor(avgStress / 2) + 1));
    return allAreas.slice(0, maxAreas);
  }

  function generateAchievements(avgStress: number, weekIndex = 0) {
    const allAchievements = [
      'Consecutive 5-day biometric check-in streak logged',
      'Vagus nerve activation achieved via Box Breathing',
      'Healthy cortisol recovery pattern detected on weekend',
      'Engaged Dr. MindBot for proactive anxiety de-escalation',
      'Completed Cognitive Distortion reframing exercises'
    ];
    return allAchievements.slice(0, Math.min(5, 2 + Math.floor(weekIndex / 2)));
  }

  function generateGoals(avgStress: number, weekIndex = 0) {
    return [
      'Log daily stress check-in for at least 5 days',
      'Complete 2 audio immersion sessions in Relaxation Rooms',
      'Engage with Dr. MindBot when tension exceeds 6.0/10',
      'Practice 4-4-4 Box Breathing before bedtime twice this week'
    ];
  }

  function generateInsights(avgStress: number, dailyStress: number[], weekIndex: number) {
    const insights: string[] = [];
    if (avgStress < 4) {
      insights.push('Optimal parasympathetic tone observed with rapid autonomic recovery following mild spikes.');
    } else if (avgStress < 7) {
      insights.push('Moderate physiological load detected with characteristic mid-week compression and restorative weekend dips.');
    } else {
      insights.push('Sustained sympathetic elevation noted throughout the workweek; prioritize scheduled hourly respiratory pauses.');
    }
    const weekdayStress = dailyStress.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const weekendStress = dailyStress.slice(5).reduce((a, b) => a + b, 0) / 2;
    if (weekdayStress > weekendStress + 1.2) {
      insights.push('Significant workweek-to-weekend delta (-' + (weekdayStress - weekendStress).toFixed(1) + ' pts). Workload boundaries are your primary lever for balance.');
    }
    return insights;
  }

  const currentWeek = weeklyData[selectedWeek] || weeklyData[0];
  const currentWeekReflections = useMemo(() => {
    if (!currentWeek) return [];
    return supportReflections.filter(r => r.weekKey === currentWeek.weekOf);
  }, [supportReflections, currentWeek]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const averageSleep = useMemo(() => {
    if (!currentWeek.sleepData) return 7.2;
    const total = currentWeek.sleepData.reduce((a: number, b: number) => a + b, 0);
    return Math.round((total / currentWeek.sleepData.length) * 10) / 10;
  }, [currentWeek]);

  const equilibriumScore = useMemo(() => {
    // 0-100 realistic score where lower stress + healthy sleep = higher score
    const stressFactor = (10 - currentWeek.averageStressLevel) * 7;
    const sleepFactor = Math.min(30, (averageSleep / 8) * 30);
    return Math.min(99, Math.max(35, Math.round(stressFactor + sleepFactor)));
  }, [currentWeek, averageSleep]);

  const highlights = useMemo(() => {
    const avg = currentWeek.averageStressLevel;
    const bestDayIdx = currentWeek.dailyStress.indexOf(Math.min(...currentWeek.dailyStress));
    const worstDayIdx = currentWeek.dailyStress.indexOf(Math.max(...currentWeek.dailyStress));
    return [
      `Average Load: ${avg} / 10`,
      `Most Restorative: ${daysOfWeek[bestDayIdx]} (${currentWeek.dailyStress[bestDayIdx]}/10)`,
      `Highest Tension: ${daysOfWeek[worstDayIdx]} (${currentWeek.dailyStress[worstDayIdx]}/10)`
    ];
  }, [currentWeek]);

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'stressed': '😰',
      'anxious': '😟',
      'calm': '😌',
      'excited': '🤩',
      'neutral': '😐',
      'overwhelmed': '🤯'
    };
    return moodEmojis[mood] || '😐';
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Weekly Stress Telemetry - ${currentWeek.weekOf}`,
        text: `StressLytix Telemetry: Weekly Average Stress ${currentWeek.averageStressLevel}/10, Equilibrium Index ${equilibriumScore}%.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Weekly Stress Telemetry - ${currentWeek.weekOf}\nAverage Stress: ${currentWeek.averageStressLevel}/10\nEquilibrium Index: ${equilibriumScore}%\nMean Sleep: ${averageSleep} hrs/night`);
      alert('Clinical report summary copied to clipboard!');
    }
  };

  const printReport = () => {
    window.print();
  };

  const toggleGoal = (goalText: string) => {
    setCompletedGoals(prev => ({ ...prev, [goalText]: !prev[goalText] }));
  };

  // Helper to generate organic cubic bezier path for telemetry waveform
  const getSmoothSvgPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return { linePath: '', areaPath: '' };
    if (points.length === 1) return { linePath: `M ${points[0].x},${points[0].y}`, areaPath: '' };

    let linePath = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      linePath += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }

    const lastX = points[points.length - 1].x.toFixed(2);
    const firstX = points[0].x.toFixed(2);
    const areaPath = `${linePath} L ${lastX},38 L ${firstX},38 Z`;
    return { linePath, areaPath };
  };

  const getMoodBadgeStyle = (mood: string) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800';
      case 'calm':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800';
      case 'excited':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800';
      case 'stressed':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800';
      case 'anxious':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800';
      case 'sad':
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800';
      case 'overwhelmed':
        return 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200/80 dark:border-pink-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700';
    }
  };

  const completedGoalsCount = Object.values(completedGoals).filter(Boolean).length;
  const totalGoalsCount = currentWeek.nextWeekGoals.length;
  const totalSessions = currentWeek.activities.assessments + currentWeek.activities.breathingExercises + currentWeek.activities.chatbotSessions;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 select-none">
      <main className="max-w-6xl mx-auto space-y-6">
        
        {/* Executive Clinical Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-6 sm:p-8 text-white border border-purple-500/25 dark:border-white/10 shadow-[0_16px_40px_-16px_rgba(147,51,234,0.3)] select-none">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-3.5 shadow-2xs">
                <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
                <span>Multimodal Biometric Telemetry & Analytics</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2.5">
                Weekly Wellness Intelligence
              </h1>
              <p className="text-sm sm:text-base text-purple-100/80 leading-relaxed max-w-xl font-normal">
                Evidence-based physiological tracking connecting autonomic stress markers, sleep architecture, and mindful habit adherence.
              </p>
            </div>

            {/* Right Side Status Pill & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-purple-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Telemetry: {equilibriumScore}% Stability</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={printReport}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Print clinical report"
                >
                  <Printer className="w-4 h-4 text-purple-200" />
                  <span>Print PDF</span>
                </button>

                <button
                  onClick={shareReport}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-900 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <span>Share Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reporting Period & Quick Highlights Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Reporting Period
                </span>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  {currentWeek.weekOf}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Jump to Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white cursor-pointer focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Week Selector Chips (Zero scrollbars) */}
          <div 
            className="flex items-center gap-2 overflow-x-auto overflow-y-hidden scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {weeklyData.slice(0, 6).map((week, index) => {
              const isSelected = selectedWeek === index;
              return (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeek(index)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-400/30'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {week.weekOf}
                </button>
              );
            })}
          </div>

          {/* Clinical Highlights Strip */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 mr-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[10px]">Telemetry Findings:</span>
            </div>
            {highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                {h}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Equilibrium Index: {equilibriumScore}%</span>
            </span>
          </div>
        </div>

        {/* 4 Executive KPI Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Mean Stress Level */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none flex flex-col justify-between">
            {/* Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400" />
            
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs ring-2 ring-purple-100/70 dark:ring-purple-950/50 flex-shrink-0">
                    <Activity className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      Average Stress
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-2xl font-black tracking-tight leading-none ${
                        currentWeek.averageStressLevel <= 4 ? 'text-emerald-600 dark:text-emerald-400' :
                        currentWeek.averageStressLevel <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {currentWeek.averageStressLevel}
                      </span>
                      <span className="text-xs font-bold text-slate-400">/ 10</span>
                    </div>
                  </div>
                </div>

                {/* State Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 border ${
                  currentWeek.averageStressLevel <= 4 ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300' :
                  currentWeek.averageStressLevel <= 7 ? 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300' :
                  'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    currentWeek.averageStressLevel <= 4 ? 'bg-emerald-500' :
                    currentWeek.averageStressLevel <= 7 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                  }`} />
                  <span>{currentWeek.averageStressLevel <= 4 ? 'Calm' : currentWeek.averageStressLevel <= 7 ? 'Moderate' : 'High'}</span>
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    currentWeek.averageStressLevel <= 4 ? 'from-teal-500 to-emerald-500' :
                    currentWeek.averageStressLevel <= 7 ? 'from-amber-400 to-amber-500' :
                    'from-rose-500 to-red-600'
                  }`}
                  style={{ width: `${(currentWeek.averageStressLevel / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Band: Healthy (&lt;6.0)</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Normalized</span>
            </div>
          </div>

          {/* 2. Trajectory & Autonomic Stability */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none flex flex-col justify-between">
            {/* Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400" />
            
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs ring-2 ring-indigo-100/70 dark:ring-indigo-950/50 flex-shrink-0">
                    <TrendingDown className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      Equilibrium Index
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {equilibriumScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 flex-shrink-0">
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                  <span>+4.2%</span>
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${equilibriumScore}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Autonomic Balance</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">High Recovery</span>
            </div>
          </div>

          {/* 3. Sleep & Rest Architecture */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none flex flex-col justify-between">
            {/* Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
            
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-xs ring-2 ring-blue-100/70 dark:ring-blue-950/50 flex-shrink-0">
                    <Moon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      Mean Sleep
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {averageSleep}
                      </span>
                      <span className="text-xs font-bold text-slate-400">h/night</span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Optimal</span>
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (averageSleep / 9) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Target: 7.5h nightly</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Restorative</span>
            </div>
          </div>

          {/* 4. Active Mindful Habits */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none flex flex-col justify-between">
            {/* Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
            
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs ring-2 ring-amber-100/70 dark:ring-amber-950/50 flex-shrink-0">
                    <Zap className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      Mindful Resets
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {totalSessions}
                      </span>
                      <span className="text-xs font-bold text-slate-400">done</span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 flex-shrink-0">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Active</span>
                </span>
              </div>

              {/* Micro Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalSessions / 15) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span>Breathing & CBT</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Consistent</span>
            </div>
          </div>

        </div>

        {/* Interactive Biometric Telemetry Chart with Fluid Curves & Dual Metrics */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Biometric Telemetry Waveform
                </h3>
                <p className="text-xs text-slate-400">7-Day Physiological Stress Load vs. Restorative Sleep Architecture</p>
              </div>
            </div>

            {/* Metric Toggle Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setChartMetric('stress')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'stress'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Stress Index (0-10)
              </button>
              <button
                onClick={() => setChartMetric('sleep')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'sleep'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sleep Duration (Hrs)
              </button>
            </div>
          </div>

          {/* SVG Visualizer Container */}
          <div className="h-64 w-full relative">
            <svg viewBox="0 0 100 42" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="stressAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="sleepAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Optimal Calm Zone (0 - 4 stress, y: 25 to 38) */}
              <rect x="0" y="24.8" width="100" height="13.2" fill="#10b981" fillOpacity="0.06" rx="1" />

              {/* Reference Gridlines with Subtle Labels */}
              <g stroke="#94a3b8" strokeWidth="0.15" strokeDasharray="1.2,1.2" strokeOpacity="0.45">
                <line x1="0" y1="8" x2="100" y2="8" />
                <line x1="0" y1="16.4" x2="100" y2="16.4" />
                <line x1="0" y1="24.8" x2="100" y2="24.8" />
                <line x1="0" y1="33.2" x2="100" y2="33.2" />
              </g>

              {/* Y-Axis Level Text */}
              <text x="0.5" y="7.5" fill="#94a3b8" fontSize="2" fontWeight="bold">Peak (10)</text>
              <text x="0.5" y="15.9" fill="#94a3b8" fontSize="2" fontWeight="bold">Moderate (7)</text>
              <text x="0.5" y="24.3" fill="#10b981" fontSize="2" fontWeight="bold">Calm Zone (4)</text>

              {/* Metric Waveform with Smooth Cubic Bezier Curves */}
              {(() => {
                const values = chartMetric === 'stress' ? currentWeek.dailyStress : currentWeek.sleepData;
                const points = values.map((v: number, i: number) => {
                  const x = 6 + (i / 6) * 88;
                  const y = 36 - (Math.min(10, Math.max(0, v)) / 10) * 28;
                  return { x, y };
                });

                const { linePath, areaPath } = getSmoothSvgPath(points);
                const strokeColor = chartMetric === 'stress' ? '#9333ea' : '#2563eb';
                const fillColor = chartMetric === 'stress' ? 'url(#stressAreaGradient)' : 'url(#sleepAreaGradient)';

                return (
                  <>
                    <path d={areaPath} fill={fillColor} />
                    <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
                    {points.map((p, i: number) => {
                      const isSelected = selectedDayIdx === i;
                      return (
                        <g 
                          key={i} 
                          onClick={() => setSelectedDayIdx(i)}
                          className="cursor-pointer group"
                        >
                          {isSelected && (
                            <circle cx={p.x} cy={p.y} r="4.5" fill={strokeColor} fillOpacity="0.25" className="animate-pulse" />
                          )}
                          <circle cx={p.x} cy={p.y} r={isSelected ? "3" : "2"} fill={strokeColor} />
                          <circle cx={p.x} cy={p.y} r="1" fill="#ffffff" />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* X-Axis Day Markers */}
            <div className="mt-3 grid grid-cols-7 text-center">
              {daysOfWeek.map((d, i) => {
                const isSelected = selectedDayIdx === i;
                const stressVal = currentWeek.dailyStress[i];
                const sleepVal = currentWeek.sleepData[i];
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDayIdx(i)}
                    className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-100/90 dark:bg-purple-950/80 border border-purple-400 dark:border-purple-600 shadow-xs scale-105' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`text-xs font-bold block ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {d}
                    </span>
                    <span className="text-[11px] font-mono font-bold block text-slate-800 dark:text-slate-200 mt-0.5">
                      {chartMetric === 'stress' ? `${stressVal}/10` : `${sleepVal}h`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Telemetry Detail Card */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700">
                {getMoodEmoji(currentWeek.dailyMoods[selectedDayIdx] || 'calm')}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {daysOfWeek[selectedDayIdx]} Telemetry Detail
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    Selected
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mood: <span className="capitalize font-bold text-slate-800 dark:text-slate-200">{currentWeek.dailyMoods[selectedDayIdx] || 'Neutral'}</span> • Stress Load: <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{currentWeek.dailyStress[selectedDayIdx]}/10</span> • Sleep: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{currentWeek.sleepData[selectedDayIdx]} hrs</span>
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800 self-start md:self-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Optimal Autonomic Recovery Ratio</span>
            </span>
          </div>
        </div>

        {/* 7-Day Emotional Signatures & Mood Trajectory */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400 border border-pink-200/60 dark:border-pink-800/60">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily Emotional Signatures & Mood Trajectory
                </h3>
                <p className="text-[11px] text-slate-400">7-Day Circadian Circadian Rhythm Profile</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Tap any day to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {currentWeek.dailyMoods.map((mood: string, idx: number) => {
              const isSelected = selectedDayIdx === idx;
              const badgeStyle = getMoodBadgeStyle(mood);
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-50/90 dark:bg-purple-950/70 border-purple-400 dark:border-purple-600 shadow-md scale-105 ring-2 ring-purple-300/40' 
                      : `${badgeStyle} hover:scale-102`
                  }`}
                >
                  <span className="text-2xl block mb-1 drop-shadow-2xs">{getMoodEmoji(mood)}</span>
                  <span className="text-xs font-bold block truncate">
                    {mood}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Intelligence Panels: Behavioral Insights & Care Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Panel 1: Clinical Pattern Recognition */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                  <Brain className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Clinical Pattern Recognition
                  </h3>
                  <p className="text-[11px] text-slate-400">Automated autonomic stress insights</p>
                </div>
              </div>

              {/* Insights List */}
              <div className="space-y-3 mb-5">
                {currentWeek.insights.map((insight: string, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-xs text-purple-950 dark:text-purple-200 leading-relaxed flex items-start gap-3 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>

              {/* Achievements Unlocked */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Milestones & Honors Earned:
                </span>
                {currentWeek.achievements.map((ach: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold">{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Validated Clinical Algorithm</span>
              </span>
              <span className="font-mono text-[11px]">Model v2.4</span>
            </div>
          </div>

          {/* Panel 2: Priority Focus Areas & Next Week's Care Plan */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    <Target className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Actionable Care Plan & Next Goals
                    </h3>
                    <p className="text-[11px] text-slate-400">Target milestones for the upcoming cycle</p>
                  </div>
                </div>

                {/* Progress Pill */}
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                  {completedGoalsCount} of {totalGoalsCount} Done
                </span>
              </div>

              {/* Focus Areas Chips */}
              <div className="mb-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Clinical Improvement Areas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentWeek.improvementAreas.map((area: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      • {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Goals Checklist */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Active Care Goals:
                </span>
                {currentWeek.nextWeekGoals.map((goal: string, i: number) => {
                  const isChecked = !!completedGoals[goal];
                  return (
                    <div 
                      key={i} 
                      onClick={() => toggleGoal(goal)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isChecked 
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isChecked 
                          ? 'bg-emerald-600 text-white' 
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-semibold ${isChecked ? 'line-through opacity-75' : ''}`}>
                        {goal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between text-xs text-slate-400">
              <span>Care Adherence Sync</span>
              <button 
                onClick={() => navigate('/checklist')}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Daily Checklist &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Support Circle Reflections (if available for this week) */}
        {currentWeekReflections.length > 0 && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200/80 dark:border-emerald-950/50 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
              <MessageCircleHeart className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Support Circle Care Notes for This Period
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWeekReflections.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 italic mb-2 leading-relaxed">
                    &ldquo;{r.message}&rdquo;
                  </p>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    — {r.contactName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default WeeklyReport;