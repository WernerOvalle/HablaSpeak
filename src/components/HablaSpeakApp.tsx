'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ClassesView from './views/ClassesView';
import ScenariosView from './views/ScenariosView';
import InterviewView from './views/InterviewView';
import PricingView from './views/PricingView';
import AdminView from './views/AdminView';
import type { InterviewScenario, InterviewScenarioId, UserPlan, View } from '@/types/app';

export default function HablaSpeakApp() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<View>('dashboard');
  const [scenarioId, setScenarioId] = useState<InterviewScenarioId>('job-interview');

  const scenarios = useMemo<Record<InterviewScenarioId, InterviewScenario>>(
    () => ({
      'job-interview': {
        id: 'job-interview',
        title: 'Entrevista de trabajo',
        description: 'Simulacion general para entrevistas laborales en ingles.',
        initialMessage:
          'Hello! I am Alex, your interviewer today. Let us start — tell me about yourself and your professional experience.',
      },
      'call-center-opening': {
        id: 'call-center-opening',
        title: 'Call Center: apertura de llamada',
        description: 'Practica saludos, validacion y apertura profesional de una llamada.',
        initialMessage:
          'Hello? Hi, I need some help with my account please. I have been having trouble logging in for the past two days.',
      },
      'call-center-objections': {
        id: 'call-center-objections',
        title: 'Call Center: manejo de objeciones',
        description: 'Practica respuestas empaticas para clientes frustrados o con dudas.',
        initialMessage:
          'This is ridiculous! I have been waiting for three days and nobody has solved my problem. I want to cancel my service right now.',
      },
      'call-center-escalations': {
        id: 'call-center-escalations',
        title: 'Call Center: escalaciones',
        description: 'Practica transferencia y escalacion de casos complejos.',
        initialMessage:
          'I already spoke to two agents and nobody could fix this. My billing is completely wrong and I need this resolved today or I am going to file a complaint.',
      },
      'call-center-billing-dispute': {
        id: 'call-center-billing-dispute',
        title: 'Call Center: disputa de cobro',
        description: 'Un cliente disputa un cargo que no reconoce en su factura.',
        initialMessage:
          'Hi, I just checked my bill and there is a charge of $49.99 that I do not recognize. I never authorized that. I want to know what this charge is for and I want it removed.',
      },
      'call-center-refund-request': {
        id: 'call-center-refund-request',
        title: 'Call Center: solicitud de reembolso',
        description: 'Practica procesar o denegar una solicitud de reembolso.',
        initialMessage:
          'Hello, I bought a product three days ago and it stopped working. I want a full refund. I have the receipt and I have not damaged it in any way.',
      },
      'call-center-technical-support': {
        id: 'call-center-technical-support',
        title: 'Call Center: soporte tecnico',
        description: 'Guia a un cliente con un problema tecnico paso a paso.',
        initialMessage:
          'My internet has not been working since this morning. I have tried restarting the router three times already and nothing works. I need this fixed urgently because I work from home.',
      },
      'call-center-cancellation': {
        id: 'call-center-cancellation',
        title: 'Call Center: cancelacion de servicio',
        description: 'Maneja una solicitud de cancelacion e intenta retener al cliente.',
        initialMessage:
          'I want to cancel my subscription. I have been a customer for two years but the price went up again and I found a better deal somewhere else.',
      },
      'call-center-account-locked': {
        id: 'call-center-account-locked',
        title: 'Call Center: cuenta bloqueada',
        description: 'Verifica identidad y ayuda a un cliente a recuperar acceso a su cuenta.',
        initialMessage:
          'I cannot log into my account. It says my account has been locked. I did not do anything wrong. I just need to access my account right now.',
      },
      'call-center-service-outage': {
        id: 'call-center-service-outage',
        title: 'Call Center: interrupcion de servicio',
        description: 'Informa a un cliente sobre una interrupcion activa y maneja su frustracion.',
        initialMessage:
          'Is there a problem with the service right now? Nothing is working and I have a very important meeting in one hour. How long is this going to take to be fixed?',
      },
      'call-center-upsell': {
        id: 'call-center-upsell',
        title: 'Call Center: oferta de upgrade',
        description: 'Presenta una oferta de upgrade a un cliente que llama por otro motivo.',
        initialMessage:
          'Hi, I am calling because I want to check my current plan. I feel like I am not getting enough for what I pay every month.',
      },
      'call-center-duplicate-charge': {
        id: 'call-center-duplicate-charge',
        title: 'Call Center: cobro duplicado',
        description: 'Resuelve un caso de doble cobro explicando el proceso de devolucion.',
        initialMessage:
          'You charged me twice this month. I see two identical transactions on my bank statement from your company. I want both of them refunded immediately.',
      },
      'call-center-delivery-tracking': {
        id: 'call-center-delivery-tracking',
        title: 'Call Center: seguimiento de entrega',
        description: 'Ayuda a un cliente a localizar un pedido retrasado o perdido.',
        initialMessage:
          'I ordered something ten days ago and the tracking still says it is in transit. The estimated delivery was five days ago. Where is my package?',
      },
      'call-center-complaint-agent': {
        id: 'call-center-complaint-agent',
        title: 'Call Center: queja sobre un agente',
        description: 'Maneja una queja sobre la atencion recibida por un agente anterior.',
        initialMessage:
          'I called yesterday and the person I spoke to was very rude and did not solve anything. I want to file a formal complaint and I want to speak to someone who can actually help me.',
      },
      'call-center-appointment': {
        id: 'call-center-appointment',
        title: 'Call Center: agendar cita o visita',
        description: 'Agenda o reprograma una visita tecnica con un cliente.',
        initialMessage:
          'I need to schedule a technician to come to my house. I have been waiting for this appointment for two weeks and nobody has contacted me.',
      },
      'call-center-plan-downgrade': {
        id: 'call-center-plan-downgrade',
        title: 'Call Center: cambio a plan menor',
        description: 'Gestiona la solicitud de un cliente que quiere bajar su plan.',
        initialMessage:
          'I want to change to a cheaper plan. I cannot afford my current plan anymore. What options do I have and will I lose everything I have right now?',
      },
      'call-center-callback-followup': {
        id: 'call-center-callback-followup',
        title: 'Call Center: seguimiento de caso',
        description: 'Haz seguimiento a un caso previo y explica el estado actual.',
        initialMessage:
          'I called three days ago about a problem and someone told me they would call me back within 24 hours. Nobody called. I am still waiting for a solution.',
      },
      'call-center-new-customer': {
        id: 'call-center-new-customer',
        title: 'Call Center: cliente nuevo',
        description: 'Orienta a un nuevo cliente que tiene dudas sobre como empezar.',
        initialMessage:
          'Hi, I just signed up for your service today but I am not sure how everything works. Nobody explained it to me very well when I signed up.',
      },
      'call-center-language-barrier': {
        id: 'call-center-language-barrier',
        title: 'Call Center: barrera de idioma',
        description: 'Practica con un cliente que tiene dificultad comunicandose en ingles.',
        initialMessage:
          'Hello... uh, my English not very good. I have problem with my... account? I pay but is not working. I not understand what happen.',
      },
      'free-practice': {
        id: 'free-practice',
        title: 'Practica libre',
        description: 'Sin guion fijo — habla de lo que quieras y Alex se adapta a ti.',
        initialMessage:
          "Hey! I'm Alex, your English conversation partner. There's no script today — this is your time. What would you like to talk about or practice? It could be anything: small talk, work situations, asking for directions, a job interview, or just a casual chat. You lead, I follow.",
      },
    }),
    []
  );

  const userPlan: UserPlan = session?.user?.isPremium ? 'premium' : 'free';
  const isAdmin = Boolean(session?.user?.isAdmin);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setView('login');
    }

    if (status === 'authenticated' && view === 'login') {
      setView('dashboard');
    }

    if (status === 'authenticated' && view === 'admin' && !isAdmin) {
      setView('dashboard');
    }
  }, [status, view, isAdmin]);

  const handleLogin = () => setView('dashboard');

  const handleStartInterview = (nextScenarioId: InterviewScenarioId) => {
    if (userPlan !== 'premium') {
      setView('dashboard'); // DISABLED: era 'pricing', deshabilitado hasta apertura publica
      return;
    }
    setScenarioId(nextScenarioId);
    setView('interview');
  };

  const handleSubscribe = () => {
    setView('login');
  };

  // DISABLED: pricing redirige a dashboard hasta apertura publica
  const navigate = (v: View) => setView(v === 'pricing' ? 'dashboard' : v);

  return (
    <ThemeProvider>
      {status === 'loading' ? (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <>
          {status !== 'authenticated' || view === 'login' ? (
            <LoginView onLogin={handleLogin} />
          ) : null}

          {status === 'authenticated' && view === 'dashboard' && (
            <DashboardView
              userPlan={userPlan}
              onNavigate={navigate}
              isAdmin={isAdmin}
            />
          )}

          {status === 'authenticated' && view === 'classes-general' && (
            <ClassesView
              moduleType="GENERAL"
              userPlan={userPlan}
              onNavigate={navigate}
              isAdmin={isAdmin}
            />
          )}

          {status === 'authenticated' && view === 'classes-callcenter' && (
            <ClassesView
              moduleType="CALL_CENTER"
              userPlan={userPlan}
              onNavigate={navigate}
              isAdmin={isAdmin}
            />
          )}

          {status === 'authenticated' && view === 'classes-cc-interview' && (
            <ClassesView
              moduleType="CC_INTERVIEW"
              userPlan={userPlan}
              onNavigate={navigate}
              isAdmin={isAdmin}
            />
          )}

          {status === 'authenticated' && view === 'scenarios' && (
            <ScenariosView
              userPlan={userPlan}
              onNavigate={navigate}
              onStartInterview={handleStartInterview}
              isAdmin={isAdmin}
            />
          )}

          {status === 'authenticated' && view === 'admin' && isAdmin && (
            <AdminView
              userPlan={userPlan}
              onNavigate={navigate}
            />
          )}

          {status === 'authenticated' && view === 'interview' && (
            <InterviewView
              scenario={scenarios[scenarioId]}
              onExit={() => setView('scenarios')}
            />
          )}

          {/* DISABLED: vista de pricing deshabilitada hasta apertura publica
          {status === 'authenticated' && view === 'pricing' && (
            <PricingView
              userPlan={userPlan}
              onNavigate={navigate}
              onSubscribe={handleSubscribe}
            />
          )}
          */}
        </>
      )}
    </ThemeProvider>
  );
}
