import React, { useEffect, useMemo, useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Wind, 
  Activity, 
  Users, 
  Palette, 
  Brain, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { User, ChecklistItem } from '../types/User';

interface ChecklistProps {
  user: User;
}

const Checklist: React.FC<ChecklistProps> = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<ChecklistItem[]>([
    {
      id: '1',
      task: 'Practice 5-minute deep breathing exercise',
      completed: true,
      date: new Date().toISOString().split('T')[0],
      category: 'breathing'
    },
    {
      id: '2',
      task: 'Take a 15-minute nature walk without devices',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: 'exercise'
    },
    {
      id: '3',
      task: 'Reach out to a trusted friend or support contact',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: 'social'
    },
    {
      id: '4',
      task: 'Listen to calming soundscapes in Relaxation Rooms',
      completed: true,
      date: new Date().toISOString().split('T')[0],
      category: 'hobby'
    },
    {
      id: '5',
      task: 'Write 3 micro-gratitudes in Creative Studio',
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: 'meditation'
    }
  ]);

  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChecklistItem['category']>('breathing');

  const categories = {
    breathing: { icon: Wind, label: 'Breathing', badge: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
    exercise: { icon: Activity, label: 'Exercise', badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    social: { icon: Users, label: 'Social', badge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    hobby: { icon: Palette, label: 'Creative', badge: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    meditation: { icon: Brain, label: 'Mindfulness', badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' }
  };

  const storageKey = (date: string) => `checklist_${date}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey(selectedDate));
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch {}
    }
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem(storageKey(selectedDate), JSON.stringify(tasks));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const updatedUser = {
        ...userData,
        checklists: tasks
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [tasks, selectedDate]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: ChecklistItem = {
      id: Date.now().toString(),
      task: newTask.trim(),
      completed: false,
      date: selectedDate,
      category: selectedCategory
    };

    setTasks(prev => [...prev, task]);
    setNewTask('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const quickTemplates: Array<{label: string, items: Array<Omit<ChecklistItem, 'id'|'completed'|'date'>>}> = [
    {
      label: 'Calm Start',
      items: [
        { task: '3-minute mindful breathing', category: 'breathing' },
        { task: 'Write 1 intentional thought', category: 'meditation' }
      ]
    },
    {
      label: 'Active Reset',
      items: [
        { task: '15-minute nature walk', category: 'exercise' },
        { task: 'Hydrate with fresh water', category: 'hobby' }
      ]
    },
    {
      label: 'Connection Boost',
      items: [
        { task: 'Send kind text to a friend', category: 'social' },
        { task: 'Read an uplifting chapter', category: 'meditation' }
      ]
    }
  ];

  const applyTemplate = (items: Array<Omit<ChecklistItem, 'id'|'completed'|'date'>>) => {
    const newItems: ChecklistItem[] = items.map((it, idx) => ({
      id: (Date.now() + idx).toString(),
      task: it.task,
      completed: false,
      date: selectedDate,
      category: it.category
    }));
    setTasks(prev => [...prev, ...newItems]);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto space-y-6">
        
        {/* Daily Checklist Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950 p-6 sm:p-8 text-white border border-amber-500/30 dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.35)]">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-200 mb-3">
                <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
                <span>Habit & Recovery Milestones</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Daily Wellness Checklist
              </h1>
              <p className="text-sm text-amber-100/80 mt-1 max-w-xl">
                Small, consistent mindfulness and physical resets prevent cumulative cognitive fatigue and maintain emotional balance.
              </p>
            </div>

            {/* Completion Percentage Ring / HUD */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/15 px-5 py-4 rounded-3xl shadow-xl flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-white/10 flex items-center justify-center">
                  <span className="text-lg font-black text-amber-300">{percentage}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Today's Progress</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {completedCount} of {tasks.length} Completed
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Date Selector & Quick Habit Templates */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Viewing Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
            />
            {selectedDate !== new Date().toISOString().split('T')[0] && (
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Jump to Today
              </button>
            )}
          </div>

          {/* Templates */}
          <div 
            className="flex items-center gap-2 overflow-x-auto overflow-y-hidden scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Templates:
            </span>
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl.items)}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition-all border border-slate-200/60 dark:border-slate-700 cursor-pointer"
              >
                + {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Input Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Add New Habit or Intention
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="e.g., 10 minutes of gentle yoga stretching..."
              className="flex-1 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 w-full"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
              >
                {Object.entries(categories).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>

              <button
                onClick={addTask}
                disabled={!newTask.trim()}
                className={`px-5 py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md whitespace-nowrap ${
                  newTask.trim()
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Habit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled Habits ({tasks.length})
            </h3>

            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear Finished
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No habits scheduled for this date. Use the template chips or add one above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const catMeta = categories[task.category] || categories.meditation;
                const CatIcon = catMeta.icon;
                return (
                  <div
                    key={task.id}
                    className={`group p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'border-emerald-300/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3.5 flex-1 cursor-pointer"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                      }`}>
                        <CheckSquare className="w-4 h-4" />
                      </div>

                      <div>
                        <p className={`text-xs sm:text-sm font-semibold transition-all ${
                          task.completed 
                            ? 'line-through text-slate-400 dark:text-slate-500' 
                            : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {task.task}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${catMeta.badge}`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{catMeta.label}</span>
                      </span>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-xl text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Checklist;