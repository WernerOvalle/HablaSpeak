'use client';

import { useState } from 'react';
import { LockKeyhole, Mic, User, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface LoginViewProps {
  onLogin: () => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
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
      setError('Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
      setLoading(false);
    } else {
      onLogin();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar el usuario');
      }

      setMode('login');
      const loginResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginResponse?.error) {
        setError('Usuario creado, pero no se pudo iniciar sesion automaticamente');
      } else {
        onLogin();
      }
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Error inesperado al registrarte');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-[40px] shadow-2xl dark:shadow-slate-900/50 p-10 text-center border border-slate-900/20 dark:border-slate-700/50">

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
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-900/20 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-900/20 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {mode === 'register' ? (
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={18} />
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-900/20 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          ) : null}

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            id="login-btn"
            onClick={mode === 'login' ? handleSignIn : handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

          {/* DISABLED: registro deshabilitado hasta apertura publica
          <button
            type="button"
            onClick={() => {
              setError('');
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="w-full text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
          >
            {mode === 'login' ? 'No tengo cuenta, quiero registrarme' : 'Ya tengo cuenta, quiero iniciar sesión'}
          </button>
          */}

          {/* DISABLED: credenciales de prueba ocultas en produccion
          <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p>Usuario premium de prueba: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">premium@hablaspeak.com</code></p>
            <p>Contraseña inicial: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">Premium123!</code></p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
