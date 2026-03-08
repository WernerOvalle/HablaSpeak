'use client';

import { useState } from 'react';
import { LockKeyhole, Mic, User, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('demo@hablaspeak.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Credenciales inválidas');
      setLoading(false);
    } else {
      onLogin();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-[40px] shadow-2xl dark:shadow-slate-900/50 p-10 text-center border border-slate-100 dark:border-slate-700/50">

        {/* Icono */}
        <div className="inline-flex p-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl mb-8 text-indigo-600 dark:text-indigo-400 ring-8 ring-indigo-50/50 dark:ring-indigo-500/10">
          <Mic size={48} />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          HablaSpeak
        </h1>
        <p className="text-slate-400 dark:text-slate-400 mb-10 font-medium">
          Domina el inglés con IA
        </p>

        {/* Formulario */}
        <div className="space-y-4 text-left">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={18} />
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={18} />
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            id="login-btn"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Entrar'}
          </button>

          {!API_KEY && (
            <p className="text-[10px] text-center text-amber-500 dark:text-amber-400 font-medium pt-2">
              ⚠️ Modo Demo — Agrega <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">NEXT_PUBLIC_OPENROUTER_API_KEY</code> para IA real
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
