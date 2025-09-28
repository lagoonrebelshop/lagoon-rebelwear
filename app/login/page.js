'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMsg({ type: 'error', text: error.message });
    else window.location.href = '/account';
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Accedi</h1>
      <p className="text-white/70 mt-2">Entra con email e password.</p>

      <form className="mt-6 space-y-3" onSubmit={onLogin}>
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
          {loading ? 'Attendere…' : 'Entra'}
        </button>
      </form>

      {msg && (
        <p className={`mt-4 text-sm ${msg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
          {msg.text}
        </p>
      )}

      {/* LINK + BOTTONE BEN VISIBILE PER ISCRIVERSI */}
      <p className="mt-6 text-sm text-white/80 text-center">
        Non sei ancora registrato?{' '}
        <a href="/signup" className="underline font-medium">Registrati ora</a>
      </p>
      <div className="mt-3">
        <a
          href="/signup"
          className="block w-full text-center px-5 py-2 rounded-md border border-white/30 hover:border-white/60"
        >
          Crea un nuovo account
        </a>
      </div>
    </main>
  );
}
