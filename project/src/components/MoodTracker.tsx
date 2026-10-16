import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Calendar, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles, 
  Heart,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

type MoodValue = 'great' | 'good' | 'okay' | 'low' | 'bad';

type MoodEntry = {
  date: string; // yyyy-mm-dd
  mood: MoodValue;
};

const MOOD_KEY = 'mood_tracker_entries';

const MoodTracker: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MoodValue | ''>('');
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(MOOD_KEY) || '[]'); } catch { return []; }
  });
  const [isSaved, setIsSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);

  const emojis: Record<MoodValue, string> = {
    great: '🤩',
    good: '😊',
    okay: '😐',
    low: '😔',
    bad: '😣'
  };

  const moods: { 
    value: MoodValue; 
    label: string; 
    sublabel: string;
    gradient: string; 
    borderActive: string;
    badgeBg: string;
    textCol: string;
  }[] = [
    { 
      value: 'great', 
      label: 'Great', 
      sublabel: 'Energized & Joyful', 
      gradient: 'from-emerald-500 to-teal-600', 
      borderActive: 'border-emerald-500 shadow-emerald-500/25', 
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      textCol: 'text-emerald-600 dark:text-emerald-400' 
    },
    { 
      value: 'good', 
      label: 'Good', 
      sublabel: 'Calm & Balanced', 
      gradient: 'from-teal-500 to-cyan-600', 
      borderActive: 'border-teal-500 shadow-teal-500/25', 
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      textCol: 'text-teal-600 dark:text-teal-400' 
    },
    { 
      value: 'okay', 
      label: 'Okay', 
      sublabel: 'Steady & Grounded', 
      gradient: 'from-amber-400 to-amber-600', 
      borderActive: 'border-amber-500 shadow-amber-500/25', 
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      textCol: 'text-amber-600 dark:text-amber-400' 
    },
    { 
      value: 'low', 
      label: 'Low', 
      sublabel: 'Drained or Quiet', 
      gradient: 'from-orange-500 to-rose-600', 
      borderActive: 'border-orange-500 shadow-orange-500/25', 
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      textCol: 'text-orange-600 dark:text-orange-400' 
    },
    { 
      value: 'bad', 
      label: 'Tough', 
      sublabel: 'Stressed or Heavy', 
      gradient: 'from-rose-500 to-red-600', 
      borderActive: 'border-rose-500 shadow-rose-500/25', 
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      textCol: 'text-rose-600 dark:text-rose-400' 
    }
  ];

  const submit = () => {
    if (!selected) return;
    const filtered = entries.filter(e => e.date !== today);
    const next = [{ date: today, mood: selected as MoodValue }, ...filtered].slice(0, 60);
    setEntries(next);
    localStorage.setItem(MOOD_KEY, JSON.stringify(next));
    setSelected('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      if (entries.some(e => e.date === iso)) s++; else break;
    }
    return s;
  }, [entries]);

  const improvement = useMemo(() => {
    if (entries.length < 2) return 0;
    const last7 = entries.slice(0, 7);
    const prev7 = entries.slice(7, 14);
    const score = (m: MoodValue) => ({ great: 5, good: 4, okay: 3, low: 2, bad: 1 }[m]);
    const avg = (arr: MoodEntry[]) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + score(b.mood), 0) / arr.length;
    return Math.round((avg(last7) - avg(prev7)) * 10) / 10;
  }, [entries]);

  const badge = useMemo(() => {
    if (streak >= 21) return { name: 'Mind Master', color: 'bg-gradient-to-r from-purple-500 to-indigo-600', icon: Sparkles };
    if (streak >= 14) return { name: 'Consistency Champ', color: 'bg-gradient-to-r from-blue-500 to-teal-500', icon: Award };
    if (streak >= 7) return { name: 'Steady Streak', color: 'bg-gradient-to-r from-emerald-500 to-teal-500', icon: Flame };
    return null;
  }, [streak]);

  useEffect(() => {
    const byDate: Record<string, MoodEntry> = {};
    for (const e of entries) byDate[e.date] = e;
    const normal = Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
    if (normal.length !== entries.length) {
      setEntries(normal);
      localStorage.setItem(MOOD_KEY, JSON.stringify(normal));
    }
  }, []);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Radiant Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-950 p-6 sm:p-8 text-white border border-emerald-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-200 mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Daily Emotional Check-In
              </h1>
              <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
                Logging your state creates mindful self-awareness, unlocks consistency awards, and reveals your natural recovery rhythms.
              </p>
            </div>

            {/* Streak & Achievement Badge HUD */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Current Streak</span>
                  <div className="text-xl font-black text-white leading-none mt-0.5">
                    {streak} <span className="text-xs font-semibold text-amber-300">Days</span>
                  </div>
                </div>
              </div>

              {badge && (
                <div className="hidden sm:flex items-center gap-2.5 bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl">
                  <div className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center text-white shadow-lg`}>
                    <badge.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Honor Badge</span>
                    <div className="text-xs font-bold text-white leading-tight mt-0.5">
                      {badge.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mood Selection Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                How is your spirit today?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your emotional resonance to record your daily timestamp.
              </p>
            </div>
            {todayEntry && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Logged for today ({emojis[todayEntry.mood]})
              </span>
            )}
          </div>

          {/* 3D Tactile Mood Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {moods.map((m) => {
              const isSelected = selected === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setSelected(m.value)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer ${
                    isSelected
                      ? `${m.borderActive} bg-slate-50 dark:bg-slate-800/80 scale-105 shadow-xl`
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  {/* Floating Emotion Emoji */}
                  <span className="text-4xl sm:text-5xl my-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                    {emojis[m.value]}
                  </span>

                  {/* Label & Description */}
                  <div className="mt-2 w-full">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">
                      {m.label}
                    </span>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                      {m.sublabel}
                    </span>
                  </div>

                  {/* Indicator Dot */}
                  <div className={`w-2 h-2 rounded-full mt-3 transition-all ${
                    isSelected ? 'bg-teal-500 scale-125' : 'bg-transparent'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {isSaved ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Successfully logged to your profile!
                </span>
              ) : selected ? (
                <span>Ready to log your state for today. Click save below.</span>
              ) : (
                <span>Tap a card above to select your current mood.</span>
              )}
            </div>

            <button
              onClick={submit}
              disabled={!selected}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                selected
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-teal-600/25 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{todayEntry ? 'Update Today’s Mood' : 'Log Today’s Mood'}</span>
            </button>
          </div>
        </div>

        {/* Analytics & 14-Day Timeline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Trends Summary Card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trend Trajectory</h3>
                  <p className="text-[11px] text-slate-400">Weekly comparative delta</p>
                </div>
              </div>

              <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weekly Shift</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {improvement > 0 ? `+${improvement}` : improvement}
                  </span>
                  <span className="text-xs font-bold text-slate-400">pts</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  {improvement > 0 
                    ? "Great momentum! Your emotional balance has improved over the past 7 days."
                    : improvement < 0
                    ? "Tougher stretch recently. Remember to be gentle and give yourself restorative pauses."
                    : "Stable equilibrium maintained across recent check-ins."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Total Logs</span>
              <span className="font-bold text-slate-900 dark:text-white">{entries.length} entries</span>
            </div>
          </div>

          {/* 14-Day Timeline History Grid */}
          <div className="lg:col-span-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-800">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Emotional Rhythm</h3>
                  <p className="text-[11px] text-slate-400">Past 14 check-ins</p>
                </div>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No check-ins yet. Log your first mood above to start tracking your journey!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {entries.slice(0, 12).map((e) => {
                  const mData = moods.find(m => m.value === e.mood);
                  const isCurrent = e.date === today;
                  return (
                    <div 
                      key={e.date} 
                      className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                        isCurrent
                          ? 'border-teal-400/80 dark:border-teal-500/80 bg-teal-50/50 dark:bg-teal-950/30 shadow-xs'
                          : 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          {isCurrent ? 'Today' : new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {mData?.label || e.mood}
                        </span>
                      </div>
                      <span className="text-2xl drop-shadow-xs">{emojis[e.mood]}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};

export default MoodTracker;
