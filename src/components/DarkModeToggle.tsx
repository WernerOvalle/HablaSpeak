'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={`
        relative w-11 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 ease-in-out shrink-0
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${isDark
          ? 'bg-indigo-600 focus:ring-offset-slate-900'
          : 'bg-slate-200 focus:ring-offset-white'}
      `}
    >
      {/* Track */}
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out shadow-sm
          ${isDark ? 'translate-x-5 sm:translate-x-7 bg-white text-indigo-600' : 'translate-x-0 bg-white text-amber-500'}
        `}
      >
        {isDark ? <Moon size={12} strokeWidth={2.5} /> : <Sun size={12} strokeWidth={2.5} />}
      </span>
    </button>
  );
}
