'use client';

import { ArrowRight, BookOpen, ChevronDown, ChevronUp, Loader2, Lock, MessageSquare, PhoneCall, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import type { InterviewScenarioId, UserPlan, View } from '@/types/app';

interface DashboardViewProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
}

function AccessCard({
  title,
  subtitle,
  icon,
  locked,
  primaryLabel,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  locked?: boolean;
  primaryLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border transition-all ${
        locked
          ? 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-900/20 dark:border-slate-700'
          : 'bg-white dark:bg-slate-800/80 border-slate-900/20 dark:border-slate-700/50 hover:border-indigo-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className={`p-4 rounded-2xl ${locked ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
          {icon}
        </div>
        {locked ? (
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
            <Lock size={12} />
            Premium
          </span>
        ) : null}
      </div>

      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{subtitle}</p>

      <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${locked ? 'text-amber-600 dark:text-amber-300' : 'text-indigo-600 dark:text-indigo-400'}`}>
        {primaryLabel}
        <ArrowRight size={14} />
      </div>
    </button>
  );
}

function StreakCard({ streak, loading }: { streak: number; loading: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-900/20 dark:border-slate-700/50 shadow-sm text-center transition-colors duration-300">
      <TrendingUp size={24} className="text-indigo-500 mx-auto mb-4" />
      {loading ? (
        <div className="flex justify-center h-10 items-center"><Loader2 className="animate-spin text-indigo-500" /></div>
      ) : (
        <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{streak} Dias</div>
      )}
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

const SCENARIO_LABELS: Record<InterviewScenarioId, string> = {
  'job-interview': 'Entrevista de trabajo',
  'call-center-opening': 'Apertura de llamada',
  'call-center-objections': 'Manejo de objeciones',
  'call-center-escalations': 'Escalaciones',
  'call-center-billing-dispute': 'Disputa de cobro',
  'call-center-refund-request': 'Solicitud de reembolso',
  'call-center-technical-support': 'Soporte tecnico',
  'call-center-cancellation': 'Cancelacion de servicio',
  'call-center-account-locked': 'Cuenta bloqueada',
  'call-center-service-outage': 'Interrupcion de servicio',
  'call-center-upsell': 'Oferta de upgrade',
  'call-center-duplicate-charge': 'Cobro duplicado',
  'call-center-delivery-tracking': 'Seguimiento de entrega',
  'call-center-complaint-agent': 'Queja sobre agente',
  'call-center-appointment': 'Agendar visita tecnica',
  'call-center-plan-downgrade': 'Cambio a plan menor',
  'call-center-callback-followup': 'Seguimiento de caso previo',
  'call-center-new-customer': 'Cliente nuevo',
  'call-center-language-barrier': 'Barrera de idioma',
};

type FeedbackEntry = {
  id: string;
  scenarioId: string;
  finalFeedback: string;
  completedAt: string;
};

function FeedbackHistorySection({ entries, loading }: { entries: FeedbackEntry[]; loading: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="animate-spin text-indigo-500" size={20} />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 py-4">
        Aun no tienes rondas completadas. Practica un escenario para ver tu feedback aqui.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(entry => {
        const isOpen = expandedId === entry.id;
        const label = SCENARIO_LABELS[entry.scenarioId as InterviewScenarioId] ?? entry.scenarioId;
        const date = new Date(entry.completedAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-900/10 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(isOpen ? null : entry.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MessageSquare size={15} className="shrink-0 text-indigo-400" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{label}</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{date}</span>
              </div>
              {isOpen ? (
                <ChevronUp size={15} className="shrink-0 text-slate-400" />
              ) : (
                <ChevronDown size={15} className="shrink-0 text-slate-400" />
              )}
            </button>
            {isOpen ? (
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {entry.finalFeedback}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardView({ userPlan, onNavigate }: DashboardViewProps) {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setStreak(d.streak || 0);
          setFeedbackHistory(d.feedbackHistory || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:p-8 space-y-6 sm:space-y-8">
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-5 sm:p-8 rounded-[28px] sm:rounded-[36px]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-200 mb-4">HablaSpeak dashboard</p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
              Tu ingles, tu aliado para conseguir el trabajo soñado en Call Center
            </h2>
            <p className="text-indigo-100/80 max-w-2xl">
              {userPlan === 'premium'
                ? 'Entrena con rutas de gramatica, simulaciones reales y apoyo de IA para destacar en entrevistas y operaciones de CC.'
                : 'Empieza gratis con la base gramatical y desbloquea premium para practicar escenarios reales de call center con IA.'}
            </p>
          </div>

          <StreakCard streak={streak} loading={loading} />
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <AccessCard
            title={userPlan === 'premium' ? 'Ingles General' : 'Ingles General (Free Preview)'}
            subtitle={
              userPlan === 'premium'
                ? 'Accede al modulo completo de gramatica, verbos, pronombres y tiempos.'
                : 'Explora algunas clases base de pronombres, verbos y tiempos para empezar hoy.'
            }
            icon={<BookOpen size={24} />}
            primaryLabel={userPlan === 'premium' ? 'Abrir modulo' : 'Explorar clases'}
            onClick={() => onNavigate('classes-general')}
          />

          <AccessCard
            title="Ingles para Call Center"
            subtitle="Documentacion profesional por escenario: apertura, objeciones y escalaciones."
            icon={<BookOpen size={24} />}
            locked={userPlan !== 'premium'}
            primaryLabel={userPlan === 'premium' ? 'Entrar al modulo' : 'Premium'}
            onClick={() => onNavigate(userPlan === 'premium' ? 'classes-callcenter' : 'pricing')}
          />

          <AccessCard
            title="Escenarios de call center"
            subtitle="Practica apertura, objeciones y escalaciones en contextos de soporte."
            icon={<PhoneCall size={24} />}
            locked={userPlan !== 'premium'}
            primaryLabel={userPlan === 'premium' ? 'Abrir escenarios' : 'Desbloquear'}
            onClick={() => onNavigate(userPlan === 'premium' ? 'scenarios' : 'pricing')}
          />
        </section>

        {userPlan === 'premium' ? (
          <section className="rounded-[24px] sm:rounded-[32px] border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-indigo-500" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">Historial de feedback</h3>
              {feedbackHistory.length > 0 ? (
                <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {feedbackHistory.length} ronda{feedbackHistory.length !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
            <FeedbackHistorySection entries={feedbackHistory} loading={loading} />
          </section>
        ) : null}

        {userPlan !== 'premium' ? (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 border border-slate-900/20 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Plan Free
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Empieza hoy sin pagar</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-5">
                Perfecto para explorar la plataforma y abrir una parte del contenido base de ingles general.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>Acceso a clases seleccionadas de ingles general</li>
                <li>Lectura de temarios para conocer metodologia</li>
                <li>Vista previa de funciones premium bloqueadas</li>
              </ul>
            </div>

            <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 border border-indigo-400/40 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/20">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Plan Premium
              </div>
              <h3 className="text-2xl font-black mb-3">Habla con confianza profesional</h3>
              <p className="text-indigo-100 mb-5">
                Desbloquea todas las clases y las funciones de IA para estudiar y practicar con apoyo inteligente.
              </p>
              <ul className="space-y-2 text-sm text-indigo-50">
                <li>Catalogo completo de ingles general y call center</li>
                <li>Chatbot IA por tema dentro de cada clase</li>
                <li>Feedback personalizado de IA en cada practica</li>
              </ul>
              <button
                onClick={() => onNavigate('pricing')}
                className="mt-6 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-colors"
              >
                Quiero desbloquear premium
              </button>
            </div>
          </section>
        ) : null}

      </main>
    </div>
  );
}
