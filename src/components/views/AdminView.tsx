'use client';

import { Loader2, Plus, Shield, UserMinus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import type { UserPlan, View } from '@/types/app';

interface AdminViewProps {
  userPlan: UserPlan;
  onNavigate: (view: View) => void;
  isAdmin?: boolean;
}

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  active: boolean;
  createdAt: string;
};

export default function AdminView({ userPlan, onNavigate, isAdmin: _isAdmin }: AdminViewProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createPlan, setCreatePlan] = useState<'FREE' | 'PREMIUM'>('FREE');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editPlan, setEditPlan] = useState<'FREE' | 'PREMIUM' | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar usuarios');
      setUsers(data.users || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim() || !createPassword.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: createEmail.trim(),
          password: createPassword,
          plan: createPlan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
      setCreateEmail('');
      setCreatePassword('');
      setCreatePlan('FREE');
      await fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (userId: string) => {
    const payload: { password?: string; plan?: string } = {};
    if (editPassword.trim()) payload.password = editPassword;
    if (editPlan !== null) payload.plan = editPlan;

    if (Object.keys(payload).length === 0) {
      setEditingId(null);
      return;
    }

    setError('');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      setEditingId(null);
      setEditPassword('');
      setEditPlan(null);
      setEditActive(null);
      await fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar');
    }
  };

  const startEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setEditPassword('');
    setEditPlan(u.plan as 'FREE' | 'PREMIUM');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPassword('');
    setEditPlan(null);
  };

  const toggleActive = async (u: AdminUser) => {
    if (u.role === 'ADMIN') return;
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !u.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      await fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar userPlan={userPlan} onNavigate={onNavigate} isAdmin={true} />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Panel de administración</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crear, actualizar contraseñas e inactivar usuarios</p>
          </div>
        </div>

        {error ? (
          <div className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        ) : null}

        <section className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-900/20 dark:border-slate-700">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Crear usuario</h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
              <input
                type="email"
                value={createEmail}
                onChange={e => setCreateEmail(e.target.value)}
                placeholder="nuevo@ejemplo.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-900/20 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-bold text-slate-500 mb-1">Contraseña</label>
              <input
                type="password"
                value={createPassword}
                onChange={e => setCreatePassword(e.target.value)}
                placeholder="Mín. 6 caracteres"
                minLength={6}
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-900/20 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-500 mb-1">Plan</label>
              <select
                value={createPlan}
                onChange={e => setCreatePlan(e.target.value as 'FREE' | 'PREMIUM')}
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-900 border border-slate-900/20 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="FREE">Free</option>
                <option value="PREMIUM">Premium</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Crear
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-900/20 dark:border-slate-700 overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 p-4 border-b border-slate-900/10 dark:border-slate-700">
            Usuarios
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900/10 dark:border-slate-700">
                    <th className="text-left p-4 font-bold text-slate-500">Email</th>
                    <th className="text-left p-4 font-bold text-slate-500">Plan</th>
                    <th className="text-left p-4 font-bold text-slate-500">Estado</th>
                    <th className="text-left p-4 font-bold text-slate-500">Rol</th>
                    <th className="text-right p-4 font-bold text-slate-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-slate-900/5 dark:border-slate-700/50">
                      <td className="p-4 text-slate-900 dark:text-white font-medium">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.plan === 'PREMIUM' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                          {u.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role === 'ADMIN' ? (
                          <span className="text-slate-400 text-xs">—</span>
                        ) : editingId === u.id ? (
                          <div className="flex flex-wrap gap-2 justify-end">
                            <input
                              type="password"
                              placeholder="Nueva contraseña"
                              value={editPassword}
                              onChange={e => setEditPassword(e.target.value)}
                              className="w-36 rounded-lg px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-900/20 dark:border-slate-700"
                            />
                            <select
                              value={editPlan ?? u.plan}
                              onChange={e => setEditPlan(e.target.value as 'FREE' | 'PREMIUM')}
                              className="w-24 rounded-lg px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-900/20 dark:border-slate-700"
                            >
                              <option value="FREE">Free</option>
                              <option value="PREMIUM">Premium</option>
                            </select>
                            <button
                              onClick={() => toggleActive(u)}
                              className="p-1.5 rounded-lg border border-slate-900/20 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              title={u.active ? 'Inactivar' : 'Activar'}
                            >
                              {u.active ? <UserMinus size={14} /> : <UserPlus size={14} />}
                            </button>
                            <button
                              onClick={() => handleUpdate(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 rounded-lg border border-slate-900/20 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => toggleActive(u)}
                              className="p-2 rounded-lg border border-slate-900/20 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              title={u.active ? 'Inactivar' : 'Activar'}
                            >
                              {u.active ? <UserMinus size={14} /> : <UserPlus size={14} />}
                            </button>
                            <button
                              onClick={() => startEdit(u)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
