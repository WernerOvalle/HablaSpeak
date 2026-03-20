'use client';

import { Crown, LogOut, MessageSquare, Shield } from 'lucide-react';
import { signOut } from 'next-auth/react';
import DarkModeToggle from './DarkModeToggle';
import type { UserPlan, View } from '@/types/app';

interface NavbarProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
  isAdmin?: boolean;
}

export default function Navbar({ userPlan: _userPlan, onNavigate, isAdmin }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-3 py-3 sm:p-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-900/25 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group min-w-0"
        onClick={() => onNavigate('dashboard')}
      >
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900 group-hover:scale-110 transition-transform">
          <MessageSquare size={18} />
        </div>
        <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight truncate">
          Habla<span className="text-indigo-600">Speak</span>
        </h1>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {isAdmin ? (
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 transition-all"
          >
            <Shield size={13} />
            Admin
          </button>
        ) : null}
        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* DISABLED: boton upgrade/pricing deshabilitado hasta apertura publica
        <button
          id="upgrade-btn"
          onClick={() => onNavigate('pricing')}
          className={`
            flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider
            transition-all hover:shadow-lg active:scale-95
            ${userPlan === 'premium'
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
              : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'}
          `}
        >
          <Crown size={13} />
          <span className="hidden sm:inline">{userPlan === 'premium' ? 'Premium Active' : 'Upgrade'}</span>
        </button>
        */}

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={() => {
            signOut({ redirect: false });
            onNavigate('login');
          }}
          className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
