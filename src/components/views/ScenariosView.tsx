'use client';

import { ChevronRight, Lock, Play } from 'lucide-react';
import Navbar from '../Navbar';

type View = 'login' | 'dashboard' | 'scenarios' | 'interview' | 'pricing';

interface ScenariosViewProps {
  userPlan: 'free' | 'plus';
  onNavigate: (view: View) => void;
  onStartInterview: () => void;
}

interface ScenarioCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  locked?: boolean;
  onClick?: () => void;
  id?: string;
}

function ScenarioCard({ id, icon, title, subtitle, locked = false, onClick }: ScenarioCardProps) {
  if (locked) {
    return (
      <div className="p-6 bg-slate-100/50 dark:bg-slate-800/30 rounded-[28px] flex justify-between items-center opacity-60 border-2 border-transparent grayscale cursor-not-allowed">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 dark:text-slate-400">{title}</h4>
            <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mt-1">Coming Soon</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className="p-6 bg-white dark:bg-slate-800/80 rounded-[28px] border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all cursor-pointer flex justify-between items-center group"
    >
      <div className="flex items-center gap-5">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
    </div>
  );
}

export default function ScenariosView({ userPlan, onNavigate, onStartInterview }: ScenariosViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <div className="max-w-2xl mx-auto w-full p-8 pt-12">
        <button
          id="back-to-dashboard"
          onClick={() => onNavigate('dashboard')}
          className="mb-8 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all"
        >
          ← Volver
        </button>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Elige tu escenario
        </h2>

        <div className="space-y-4">
          <ScenarioCard
            id="scenario-interview"
            icon={<Play size={20} fill="currentColor" />}
            title="Entrevista de Trabajo"
            subtitle="Practica con Alex el reclutador"
            onClick={onStartInterview}
          />
          <ScenarioCard
            title="Pedir en Restaurante"
            subtitle="Próximamente"
            locked
            icon={<Lock size={20} />}
          />
          <ScenarioCard
            title="Check-in Aeropuerto"
            subtitle="Próximamente"
            locked
            icon={<Lock size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
