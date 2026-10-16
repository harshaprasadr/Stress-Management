import React from 'react';
import { User } from '../types/User';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || (user as any).name || user.email;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-xs">
            {(user.firstName?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{fullName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Full Name</p>
            <p className="font-semibold text-slate-900 dark:text-white">{fullName}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Email Address</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.email}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Age</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.age || 'Not specified'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Gender</p>
            <p className="font-semibold text-slate-900 dark:text-white capitalize">{user.gender || 'Not specified'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Occupation</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.occupation || 'Not specified'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Emergency Contact</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.emergencyContact || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
