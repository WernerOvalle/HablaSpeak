'use client';

import { useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ScenariosView from './views/ScenariosView';
import InterviewView from './views/InterviewView';
import PricingView from './views/PricingView';

type View = 'login' | 'dashboard' | 'scenarios' | 'interview' | 'pricing';

export default function HablaSpeakApp() {
  const [view, setView] = useState<View>('login');
  const [userPlan, setUserPlan] = useState<'free' | 'plus'>('free');
  const [questionsLeft, setQuestionsLeft] = useState(10);

  const handleLogin = () => setView('dashboard');

  const handleStartInterview = () => {
    if (userPlan === 'free' && questionsLeft <= 0) {
      setView('pricing');
      return;
    }
    if (userPlan === 'free') setQuestionsLeft(q => q - 1);
    setView('interview');
  };

  const handleSubscribe = () => {
    setUserPlan('plus');
    setView('dashboard');
  };

  const navigate = (v: View) => setView(v);

  return (
    <ThemeProvider>
      {view === 'login' && (
        <LoginView onLogin={handleLogin} />
      )}

      {view === 'dashboard' && (
        <DashboardView
          userPlan={userPlan}
          questionsLeft={questionsLeft}
          onNavigate={navigate}
        />
      )}

      {view === 'scenarios' && (
        <ScenariosView
          userPlan={userPlan}
          onNavigate={navigate}
          onStartInterview={handleStartInterview}
        />
      )}

      {view === 'interview' && (
        <InterviewView onExit={() => setView('scenarios')} />
      )}

      {view === 'pricing' && (
        <PricingView
          userPlan={userPlan}
          onNavigate={navigate}
          onSubscribe={handleSubscribe}
        />
      )}
    </ThemeProvider>
  );
}
