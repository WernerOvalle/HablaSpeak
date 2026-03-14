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
          'Hello! I am Alex, your AI recruiter. Let us start with a common interview question: tell me about yourself and your experience.',
      },
      'call-center-opening': {
        id: 'call-center-opening',
        title: 'Call Center: apertura de llamada',
        description: 'Practica saludos, validacion y apertura profesional de una llamada.',
        initialMessage:
          'Hi, this is Alex from customer support. Please greet the customer professionally and verify their basic details to begin the call.',
      },
      'call-center-objections': {
        id: 'call-center-objections',
        title: 'Call Center: manejo de objeciones',
        description: 'Practica respuestas empaticas para clientes frustrados o con dudas.',
        initialMessage:
          'A customer is upset because their issue has not been solved. Respond with empathy, explain the next step, and keep the tone professional.',
      },
      'call-center-escalations': {
        id: 'call-center-escalations',
        title: 'Call Center: escalaciones',
        description: 'Practica transferencia y escalacion de casos complejos.',
        initialMessage:
          'You need to escalate a complex support case. Explain the escalation clearly, set expectations, and reassure the customer in English.',
      },
    }),
    []
  );

  const userPlan: UserPlan = session?.user?.isPremium ? 'premium' : 'free';

  useEffect(() => {
    if (status === 'unauthenticated') {
      setView('login');
    }

    if (status === 'authenticated' && view === 'login') {
      setView('dashboard');
    }
  }, [status, view]);

  const handleLogin = () => setView('dashboard');

  const handleStartInterview = (nextScenarioId: InterviewScenarioId) => {
    if (userPlan !== 'premium') {
      setView('pricing');
      return;
    }
    setScenarioId(nextScenarioId);
    setView('interview');
  };

  const handleSubscribe = () => {
    setView('login');
  };

  const navigate = (v: View) => setView(v);

  if (status === 'loading') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {status !== 'authenticated' || view === 'login' ? (
        <LoginView onLogin={handleLogin} />
      ) : null}

      {status === 'authenticated' && view === 'dashboard' && (
        <DashboardView
          userPlan={userPlan}
          onNavigate={navigate}
        />
      )}

      {status === 'authenticated' && view === 'classes-general' && (
        <ClassesView
          moduleType="GENERAL"
          userPlan={userPlan}
          onNavigate={navigate}
        />
      )}

      {status === 'authenticated' && view === 'classes-callcenter' && (
        <ClassesView
          moduleType="CALL_CENTER"
          userPlan={userPlan}
          onNavigate={navigate}
        />
      )}

      {status === 'authenticated' && view === 'scenarios' && (
        <ScenariosView
          userPlan={userPlan}
          onNavigate={navigate}
          onStartInterview={handleStartInterview}
        />
      )}

      {status === 'authenticated' && view === 'interview' && (
        <InterviewView
          scenario={scenarios[scenarioId]}
          onExit={() => setView('scenarios')}
        />
      )}

      {status === 'authenticated' && view === 'pricing' && (
        <PricingView
          userPlan={userPlan}
          onNavigate={navigate}
          onSubscribe={handleSubscribe}
        />
      )}
    </ThemeProvider>
  );
}
