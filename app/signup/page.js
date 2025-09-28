'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: 'http://localhost:3000/auth/confirm' },
    });
    setLoading(false);
    if (error) setMsg({ type: 'error', text: error.message });
    else setMsg({ type: 'success', text: 'Registrazione inviata! Controlla la tua email per confermare.' });
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Registrati</h1>
      <p className="text-white/70 mt-2">Crea un account. Ti invieremo una mail di conferma.</p>

      <form className="mt-6 space-y-3" onSubmit={onSignup}>
        <input
          className="w-full px-4 py-2 rounded-md bg-white text-black"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 rounded-md bg-white text-black"
          placeholder="Password (min 6 caratteri)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button
          disabled={loading}
          className="w-full px-5 py-2 rounded-md bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-60"
        >
          {loading ? 'Attendere…' : 'Crea account'}
        </button>
      </form>

      {msg && (
        <p className={`mt-4 text-sm ${msg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
          {msg.text}
        </p>
      )}

      <p className="mt-4 text-sm text-white/60">
        Hai già un account? <a href="/login" className="underline">Accedi</a>
      </p>
    </main>
  );
}
