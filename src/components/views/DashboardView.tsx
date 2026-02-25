'use client';

import { AlertCircle, Mic, TrendingUp } from 'lucide-react';
import Navbar from '../Navbar';

type View = 'login' | 'dashboard' | 'scenarios' | 'interview' | 'pricing';

interface DashboardViewProps {
  userPlan: 'free' | 'plus';
  questionsLeft: number;
  onNavigate: (view: View) => void;
}

// Sub-componente: Card de errores detectados
function ErrorsCard() {
  const errors = [
    { label: "Third person 's'", count: '5x', color: 'red' },
    { label: "Pronunciation 'th'", count: '2x', color: 'indigo' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6 text-sm">
        <AlertCircle size={16} className="text-indigo-500" /> Errores detectados
      </h3>
      <div className="space-y-3">
        {errors.map((e) => (
          <div
            key={e.label}
            className={`p-3 rounded-2xl flex justify-between items-center text-[11px] font-bold
              ${e.color === 'red'
                ? 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400'
                : 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400'
              }`}
          >
            <span>{e.label}</span>
            <span>{e.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sub-componente: Botón principal animado
function SpeakButton({ onClick }: { onClick: () => void }) {
  return (
    <button id="start-practice-btn" onClick={onClick} className="relative group">
      <div className="absolute inset-0 bg-indigo-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center border-4 border-white dark:border-slate-700">
        <style>{`
          @keyframes wave-flow { from { transform: translate(-50%, -65%) rotate(0deg); } to { transform: translate(-50%, -65%) rotate(360deg); } }
          .liquid { position: absolute; width: 200%; height: 200%; top: 0; left: 50%; background: linear-gradient(45deg, #4f46e5, #818cf8); border-radius: 40%; animation: wave-flow 7s infinite linear; opacity: 0.5; }
        `}</style>
        <div className="liquid" />
        <div className="liquid" style={{ animationDuration: '5s', opacity: 0.3, borderRadius: '35%' }} />
        <div className="relative z-10 flex flex-col items-center text-white text-center px-4">
          <Mic size={54} strokeWidth={2.5} className="mb-2 drop-shadow-md" />
          <span className="font-black tracking-[0.2em] text-lg uppercase">Speak</span>
        </div>
      </div>
    </button>
  );
}

// Sub-componente: Card de racha de estudio
function StreakCard() {
  const streak = 4;
  return (
    <div className="bg-white dark:bg-slate-800/80 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700/50 shadow-sm text-center transition-colors duration-300">
      <TrendingUp size={24} className="text-indigo-500 mx-auto mb-4" />
      <div className="text-4xl font-black text-slate-900 dark:text-white">{streak} Días</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Racha de estudio</p>
      <div className="flex justify-center gap-1.5 mt-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div
            key={i}
            className={`w-1.5 h-6 rounded-full transition-colors ${i <= streak ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardView({ userPlan, questionsLeft, onNavigate }: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />
      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Panel izquierdo */}
        <div className="lg:col-span-3 space-y-6">
          <ErrorsCard />
        </div>

        {/* Centro — Botón principal */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center py-10 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              ¿Listo para practicar?
            </h2>
            <p className="text-slate-400 font-medium">Toca el botón y empieza a hablar</p>
          </div>

          <SpeakButton onClick={() => onNavigate('scenarios')} />

          <div className="bg-indigo-50/50 dark:bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-100/50 dark:border-indigo-500/20">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 italic">
              {userPlan === 'plus' ? '✨ Acceso Ilimitado' : `${questionsLeft} preguntas gratis hoy`}
            </span>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="lg:col-span-3">
          <StreakCard />
        </div>
      </main>
    </div>
  );
}
