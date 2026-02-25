'use client';

import { Crown, LogOut, MessageSquare } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

type View = 'login' | 'dashboard' | 'scenarios' | 'interview' | 'pricing';

interface NavbarProps {
  userPlan: 'free' | 'plus';
  onNavigate: (view: View) => void;
}

export default function Navbar({ userPlan, onNavigate }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center p-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('dashboard')}
      >
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900 group-hover:scale-110 transition-transform">
          <MessageSquare size={18} />
        </div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
          habla<span className="text-indigo-600">speak</span>
        </h1>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Upgrade / Plus Badge */}
        <button
          id="upgrade-btn"
          onClick={() => onNavigate('pricing')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider
            transition-all hover:shadow-lg active:scale-95
            ${userPlan === 'plus'
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'}
          `}
        >
          <Crown size={14} />
          <span>{userPlan === 'plus' ? '✨ Plus Active' : 'Upgrade'}</span>
        </button>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={() => onNavigate('login')}
          className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
