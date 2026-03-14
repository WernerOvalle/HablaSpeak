'use client';

import { CheckCircle2, Sparkles, X } from 'lucide-react';
import Navbar from '../Navbar';
import type { UserPlan, View } from '@/types/app';

interface PricingViewProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
  onSubscribe: () => void;
}

const FREE_FEATURES = [
  { text: 'Explorar plataforma y abrir clases seleccionadas', included: true },
  { text: 'Visualizacion de contenido premium bloqueado', included: true },
  { text: 'Catalogo completo de clases', included: false },
  { text: 'Chatbot por clase con IA', included: false },
];

const PLUS_FEATURES = [
  'Catalogo completo de ingles general y call center',
  'Chatbot IA contextual por cada clase',
  'Dashboard paginado de errores recurrentes',
  'Acceso a temarios premium (verbos, pronombres y estructuras)',
];

export default function PricingView({ userPlan, onNavigate, onSubscribe }: PricingViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto p-12 text-center flex flex-col items-center">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Elige tu plan
        </h2>
        <p className="text-slate-400 font-medium mb-16">
          Invierte en tu futuro hablando inglés con fluidez
        </p>

        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Plan Gratis */}
          <div className="bg-white dark:bg-slate-800/80 p-10 rounded-[40px] border border-slate-900/20 dark:border-slate-700/50 text-left flex flex-col shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Gratis</h3>
            <div className="text-4xl font-black mb-10 text-slate-900 dark:text-white">
              $0<span className="text-sm font-medium text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm text-slate-600 dark:text-slate-300">
              {FREE_FEATURES.map(f => (
                <li key={f.text} className={`flex gap-3 ${!f.included ? 'opacity-40 line-through' : ''}`}>
                  {f.included
                    ? <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    : <X size={18} className="shrink-0 text-slate-400" />
                  }
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest cursor-default"
              disabled
            >
              Plan Actual
            </button>
          </div>

          {/* Plan Plus */}
          <div className="bg-white dark:bg-slate-800/80 p-10 rounded-[40px] border-2 border-indigo-500 shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 text-left scale-105 relative flex flex-col">
            <div className="absolute -top-4 right-10 bg-indigo-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
              Recomendado
            </div>
            <h3 className="text-xl font-bold mb-4 flex gap-2 text-slate-800 dark:text-white">
              Plus <Sparkles size={18} className="text-indigo-500" />
            </h3>
            <div className="text-4xl font-black mb-10 text-slate-900 dark:text-white">
              $3<span className="text-sm font-medium text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow text-sm font-bold">
              {PLUS_FEATURES.map(f => (
                <li key={f} className="flex gap-3 text-slate-800 dark:text-slate-200">
                  <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              id="subscribe-btn"
              onClick={onSubscribe}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase text-xs tracking-widest"
            >
              {userPlan === 'premium' ? 'Ya eres Premium' : 'Probar con usuario premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
