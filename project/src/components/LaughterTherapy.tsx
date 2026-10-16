import React, { useEffect, useMemo, useState } from 'react';
import { 
  Laugh, 
  Sparkles, 
  RefreshCcw, 
  Award, 
  Flame, 
  Smile, 
  Heart,
  Quote,
  History,
  PartyPopper
} from 'lucide-react';

const jokes = [
  "Why did the developer go broke? Because he used up all his cache!",
  "I would tell you a UDP joke, but you might not get it.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "Debugging: Being the detective in a crime movie where you are also the murderer.",
  "To understand recursion, you must first understand recursion.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "There are only 10 kinds of people: those who understand binary and those who don't.",
  "There are 2 hard problems in computer science: cache invalidation, naming things, and off-by-one errors.",
  "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He comes back with 12 loaves of bread.",
  "Why do programmers prefer dark mode? Because light attracts bugs!"
];

const LaughterTherapy: React.FC = () => {
  const [current, setCurrent] = useState<string>('');
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('joke_history') || '[]'); } catch { return []; }
  });
  const [laughs, setLaughs] = useState<number>(() => {
    const v = localStorage.getItem('laugh_points');
    return v ? parseInt(v) : 0;
  });
  const [feedbackAnim, setFeedbackAnim] = useState<string | null>(null);

  const nextJoke = () => {
    const idx = Math.floor(Math.random() * jokes.length);
    const j = jokes[idx];
    setCurrent(j);
    const newHistory = [j, ...history.filter(h => h !== j)].slice(0, 8);
    setHistory(newHistory);
    localStorage.setItem('joke_history', JSON.stringify(newHistory));
  };

  const award = useMemo(() => {
    if (laughs >= 50) return { label: 'Gold Giggle Guru', level: 3, next: null, currentProgress: 100, color: 'from-amber-400 to-yellow-500' };
    if (laughs >= 25) return { label: 'Silver Smiler', level: 2, next: 50, currentProgress: Math.min(100, Math.round(((laughs - 25) / 25) * 100)), color: 'from-slate-400 to-slate-500' };
    if (laughs >= 10) return { label: 'Bronze Chuckler', level: 1, next: 25, currentProgress: Math.min(100, Math.round(((laughs - 10) / 15) * 100)), color: 'from-amber-600 to-orange-700' };
    return { label: 'Chuckler-in-Training', level: 0, next: 10, currentProgress: Math.min(100, Math.round((laughs / 10) * 100)), color: 'from-pink-500 to-rose-600' };
  }, [laughs]);

  useEffect(() => {
    if (!current) nextJoke();
  }, []);

  const addLaugh = (bonus = 1) => {
    const next = laughs + bonus;
    setLaughs(next);
    localStorage.setItem('laugh_points', String(next));
    setFeedbackAnim(bonus > 1 ? '+2 😂' : '+1 😊');
    setTimeout(() => setFeedbackAnim(null), 1500);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Joy Lounge Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-700 via-pink-800 to-purple-950 p-6 sm:p-8 text-white border border-rose-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(244,63,94,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-pink-200 mb-3">
                <Laugh className="w-3.5 h-3.5 text-pink-300" />
                <span>Dopamine & Endorphin Booster</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Laughter & Joy Therapy
              </h1>
              <p className="text-sm text-pink-100/80 mt-1 max-w-xl">
                Laughter stimulates your organs, relaxes tense muscle groups, and triggers immediate endorphin release to counter physical stress.
              </p>
            </div>

            {/* Laugh Points & Tier Badge */}
            <div className="flex items-center gap-3">
              <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Laugh Points</span>
                  <div className="text-xl font-black text-white leading-none mt-0.5">
                    {laughs} <span className="text-xs font-semibold text-pink-300">pts</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${award.color} flex items-center justify-center text-white shadow-lg`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Humor Rank</span>
                  <div className="text-xs font-bold text-white leading-tight mt-0.5">
                    {award.label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar to next rank */}
          {award.next && (
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>Next tier: {award.next} points</span>
              <div className="w-48 bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-rose-300 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${award.currentProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* The Comedy Stage Card */}
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 text-center">
          
          {feedbackAnim && (
            <div className="absolute top-4 right-6 text-2xl font-black text-pink-600 animate-bounce">
              {feedbackAnim}
            </div>
          )}

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-pink-500/20">
            <Quote className="w-7 h-7" />
          </div>

          {/* Main Joke Content */}
          <div className="max-w-2xl mx-auto py-4">
            <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-relaxed tracking-tight">
              "{current}"
            </p>
          </div>

          {/* Interaction Reactions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => addLaugh(1)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Smile className="w-4 h-4" /> That made me smile! (+1)
            </button>

            <button
              onClick={() => addLaugh(2)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              😂 Cracked up laughing! (+2)
            </button>

            <button
              onClick={nextJoke}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCcw className="w-4 h-4" /> Next Joke
            </button>
          </div>
        </div>

        {/* Joke Archive */}
        {history.length > 0 && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Jokes Reel
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {history.map((h, i) => (
                <div 
                  key={i} 
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-pink-500 font-black text-sm leading-none">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default LaughterTherapy;
