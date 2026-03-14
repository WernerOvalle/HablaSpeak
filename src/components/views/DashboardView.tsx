'use client';

import { AlertCircle, ArrowRight, BookOpen, Loader2, Lock, PhoneCall, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import type { UserPlan, View } from '@/types/app';

interface DashboardViewProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
}

interface DashboardError {
  id: string;
  label: string;
  count: number;
  latestFeedback: string;
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

function ErrorsCard({
  errors,
  loading,
  page,
  totalPages,
  onPageChange,
}: {
  errors: DashboardError[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getSeverityColor = (count: number) => (count > 3 ? 'red' : 'indigo');

  return (
    <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-slate-900/20 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-indigo-500" /> Errores recurrentes
        </h3>
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
          Pagina {page} de {Math.max(totalPages, 1)}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-5">
        Solo se guardan correcciones reales de tu ingles. El feedback positivo ya no se mezcla con tus errores.
      </p>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
      ) : errors.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">Aun no hay errores registrados. Cuando la IA detecte una correccion real, aparecera aqui.</p>
      ) : (
        <div className="space-y-3">
          {errors.map((e) => (
            <div
              key={e.id}
              className={`p-4 rounded-2xl border ${
                getSeverityColor(e.count) === 'red'
                  ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                  : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20'
              }`}
            >
              <div className="flex justify-between items-center gap-4">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{e.label}</span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">{e.count} veces</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{e.latestFeedback}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700/50 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-200 disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700/50 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-200 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
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

export default function DashboardView({ userPlan, onNavigate }: DashboardViewProps) {
  const [data, setData] = useState({
    streak: 0,
    errors: [] as DashboardError[],
    pagination: { page: 1, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?page=${page}&pageSize=5`)
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setData({
            streak: d.streak || 0,
            errors: d.errors || [],
            pagination: d.pagination || { page: 1, totalPages: 1 },
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:p-8 space-y-6 sm:space-y-8">
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-5 sm:p-8 rounded-[28px] sm:rounded-[36px]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-200 mb-4">HablaSpeak dashboard</p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
              Tu ingles, tu aliado para conseguir el trabajo sonado en Call Center
            </h2>
            <p className="text-indigo-100/80 max-w-2xl">
              {userPlan === 'premium'
                ? 'Entrena con rutas de gramatica, simulaciones reales y apoyo de IA para destacar en entrevistas y operaciones de CC.'
                : 'Empieza gratis con la base gramatical y desbloquea premium para practicar escenarios reales de call center con IA.'}
            </p>
          </div>

          <StreakCard streak={data.streak} loading={loading} />
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
                <li>Dashboard de errores recurrentes con enfoque de mejora</li>
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

        <ErrorsCard
          errors={data.errors}
          loading={loading}
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={nextPage => setPage(nextPage)}
        />
      </main>
    </div>
  );
}
