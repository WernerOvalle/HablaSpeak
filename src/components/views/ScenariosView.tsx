'use client';

import { ChevronRight, Crown, Headphones, Lock, PhoneCall, ShieldAlert, CreditCard, RotateCcw, Wifi, XCircle, KeyRound, AlertTriangle, TrendingUp, Receipt, Package, MessageSquareWarning, CalendarClock, ArrowDownCircle, Clock, UserPlus, Globe } from 'lucide-react';
import Navbar from '../Navbar';
import type { InterviewScenarioId, UserPlan, View } from '@/types/app';

interface ScenariosViewProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
  onStartInterview: (scenarioId: InterviewScenarioId) => void;
}

interface ScenarioCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  locked?: boolean;
  onClick: () => void;
  id?: string;
}

function ScenarioCard({ id, icon, title, subtitle, locked = false, onClick }: ScenarioCardProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`w-full text-left p-6 rounded-[28px] border-2 transition-all flex justify-between items-center group ${
        locked
          ? 'bg-slate-100/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-80'
          : 'bg-white dark:bg-slate-800/80 border-transparent hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-indigo-500/10'
      }`}
    >
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl transition-colors ${
          locked
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
        }`}>
          {locked ? <Lock size={20} /> : icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold ${locked ? 'text-slate-500 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>{title}</h4>
            {locked ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-black text-amber-600 dark:text-amber-300">
                <Crown size={12} />
                Premium
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className={`transition-colors ${locked ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-500'}`} />
    </button>
  );
}

export default function ScenariosView({ userPlan, onNavigate, onStartInterview }: ScenariosViewProps) {
  const isPremium = userPlan === 'premium';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto w-full p-8 pt-12">
        <button
          id="back-to-dashboard"
          onClick={() => onNavigate('dashboard')}
          className="mb-8 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all"
        >
          ← Volver
        </button>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Escenarios de practica para call center
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
          Todos los escenarios premium se muestran aunque tu cuenta sea free. Asi puedes ver lo que desbloqueas al subir de plan.
        </p>

        <div className="space-y-4">
          <ScenarioCard
            id="scenario-interview"
            icon={<Headphones size={20} />}
            title="Entrevista de Trabajo"
            subtitle="Simulacion general con Alex para responder en ingles profesional."
            locked={!isPremium}
            onClick={() => (isPremium ? onStartInterview('job-interview') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: apertura de llamada"
            subtitle="Practica saludo, verificacion y primeras preguntas al cliente."
            locked={!isPremium}
            icon={<PhoneCall size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-opening') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: manejo de objeciones"
            subtitle="Entrena respuestas para clientes molestos o con dudas complejas."
            locked={!isPremium}
            icon={<ShieldAlert size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-objections') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: escalaciones"
            subtitle="Aprende a escalar casos y mantener un tono claro y profesional."
            locked={!isPremium}
            icon={<Crown size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-escalations') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: disputa de cobro"
            subtitle="Un cliente no reconoce un cargo en su factura y exige explicacion."
            locked={!isPremium}
            icon={<CreditCard size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-billing-dispute') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: solicitud de reembolso"
            subtitle="Practica procesar o gestionar una solicitud de devolucion."
            locked={!isPremium}
            icon={<RotateCcw size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-refund-request') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: soporte tecnico"
            subtitle="Guia paso a paso a un cliente con un problema tecnico urgente."
            locked={!isPremium}
            icon={<Wifi size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-technical-support') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: cancelacion de servicio"
            subtitle="Maneja una baja e intenta retener al cliente con argumentos claros."
            locked={!isPremium}
            icon={<XCircle size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-cancellation') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: cuenta bloqueada"
            subtitle="Verifica identidad y ayuda a recuperar acceso a una cuenta bloqueada."
            locked={!isPremium}
            icon={<KeyRound size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-account-locked') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: interrupcion de servicio"
            subtitle="Comunica una falla activa y maneja la frustracion del cliente."
            locked={!isPremium}
            icon={<AlertTriangle size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-service-outage') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: oferta de upgrade"
            subtitle="Presenta un plan superior a un cliente insatisfecho con su plan actual."
            locked={!isPremium}
            icon={<TrendingUp size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-upsell') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: cobro duplicado"
            subtitle="Resuelve un caso de doble cargo y explica el proceso de devolucion."
            locked={!isPremium}
            icon={<Receipt size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-duplicate-charge') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: seguimiento de entrega"
            subtitle="Localiza un pedido retrasado o perdido y mantiene informado al cliente."
            locked={!isPremium}
            icon={<Package size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-delivery-tracking') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: queja sobre un agente"
            subtitle="Recibe y gestiona una queja formal sobre la atencion de un agente anterior."
            locked={!isPremium}
            icon={<MessageSquareWarning size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-complaint-agent') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: agendar visita tecnica"
            subtitle="Coordina o reprograma una cita con un tecnico de forma profesional."
            locked={!isPremium}
            icon={<CalendarClock size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-appointment') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: cambio a plan menor"
            subtitle="Gestiona la solicitud de downgrade y retiene valor para el cliente."
            locked={!isPremium}
            icon={<ArrowDownCircle size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-plan-downgrade') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: seguimiento de caso previo"
            subtitle="Retoma un caso sin resolver y comunica el estado actual con claridad."
            locked={!isPremium}
            icon={<Clock size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-callback-followup') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: cliente nuevo"
            subtitle="Orienta a un cliente recien registrado que no sabe como usar el servicio."
            locked={!isPremium}
            icon={<UserPlus size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-new-customer') : onNavigate('pricing'))}
          />
          <ScenarioCard
            title="Call Center: barrera de idioma"
            subtitle="Practica con un cliente que tiene dificultad comunicandose en ingles."
            locked={!isPremium}
            icon={<Globe size={20} />}
            onClick={() => (isPremium ? onStartInterview('call-center-language-barrier') : onNavigate('pricing'))}
          />
        </div>
      </div>
    </div>
  );
}
