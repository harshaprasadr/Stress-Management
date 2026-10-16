import React from 'react';
import { Bell, Sparkles, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
  const items = [
    { 
      id: 1, 
      title: 'Daily Mindfulness Check-in', 
      desc: 'Take 2 minutes to record your stress levels today.',
      time: 'Today, 9:00 AM',
      tag: 'Reminder' 
    },
    { 
      id: 2, 
      title: 'Weekly Multimodal Report Ready', 
      desc: 'Your weekly physiological and voice stress report is compiled.',
      time: 'Yesterday, 5:30 PM',
      tag: 'Analytics' 
    },
    { 
      id: 3, 
      title: 'Recommended: 4-7-8 Breathing Room', 
      desc: 'Calm ambient scenes are ready in the Relaxation Rooms.',
      time: '2 days ago',
      tag: 'Wellness' 
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Notifications</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time health insights and reminders</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
            {items.length} Recent
          </span>
        </div>

        <div className="space-y-3">
          {items.map((n) => (
            <div 
              key={n.id} 
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 transition-all hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {n.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
