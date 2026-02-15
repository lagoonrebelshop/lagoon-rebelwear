'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Imposta nuova password</h1>
      {done ? (
        <p className="text-sm text-gray-700">
          Password aggiornata con successo. Puoi ora{' '}
          <a href="/login" className="underline">
            accedere
          </a>{' '}
          con la nuova password.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm">Nuova password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Aggiorna password
          </button>
        </form>
      )}
    </div>
  );
}
