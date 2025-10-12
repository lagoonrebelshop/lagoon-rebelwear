'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export default function AuthForm({ mode = 'login' }) {
  // mode: 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const normalizeEmail = (v) => v.trim().toLowerCase();

  const onSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setCanResend(false);

    const emailNorm = normalizeEmail(email);

    const { data, error } = await supabase.auth.signUp({
      email: emailNorm,
      password,
      options: { emailRedirectTo: `${SITE_URL}/auth/confirm` },
    });

    setLoading(false);

    // 1) Errore esplicito
    if (error) {
      const text = error.message || 'Registrazione non riuscita.';
      const already =
        /already\s+registered/i.test(text) ||
        /email address has already been registered/i.test(text) ||
        /già\s+registrat/i.test(text);

      if (already) {
        setMsg({
          type: 'info',
          text:
            'Questa email risulta già registrata. Prova ad accedere oppure rimanda la mail di conferma se non l’hai ancora ricevuta.',
        });
        setCanResend(true);
        return;
      }

      setMsg({ type: 'error', text });
      return;
    }

    // 2) Duplicato implicito
    const identities = data?.user?.identities;
    const implicitDuplicate =
      !data?.user || (Array.isArray(identities) && identities.length === 0);

    if (implicitDuplicate) {
      setMsg({
        type: 'info',
        text:
          'Questa email risulta già registrata. Se non hai ancora confermato, puoi farti rinviare la mail di conferma.',
      });
      setCanResend(true);
      return;
    }

    // 3) Registrazione nuova OK
    setMsg({
      type: 'success',
      text: 'Registrazione inviata! Controlla la tua email e clicca “Conferma”.',
    });
  };

  const onResend = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const emailNorm = normalizeEmail(email);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailNorm,
        options: { emailRedirectTo: `${SITE_URL}/auth/confirm` },
      });
      if (error) {
        setMsg({ type: 'error', text: error.message });
      } else {
        setMsg({
          type: 'success',
          text: 'Nuova email di conferma inviata. Controlla anche la cartella spam.',
        });
      }
    } catch (e) {
      setMsg({ type: 'error', text: e.message || 'Impossibile rimandare la conferma.' });
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    setLoading(false);
    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      window.location.href = '/';
    }
  };

  const isLogin = mode === 'login';

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">{isLogin ? 'Accedi' : 'Registrati'}</h1>
      <p className="text-white/70 mt-2">
        {isLogin
          ? 'Entra con email e password.'
          : 'Crea un account. Ti invieremo una mail di conferma.'}
      </p>

      <form className="mt-6 space-y-3" onSubmit={isLogin ? onLogin : onSignup}>
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
          {loading ? 'Attendere…' : isLogin ? 'Entra' : 'Crea account'}
        </button>
      </form>

      {/* LINK RESET PASSWORD SOLO IN LOGIN */}
      {isLogin && (
        <p className="mt-3 text-sm text-white/80">
          Hai dimenticato la password?{' '}
          <a href="/reset-password" className="underline">
            Reimpostala
          </a>
        </p>
      )}

      {!isLogin && canResend && (
        <div className="mt-3">
          <button
            onClick={onResend}
            disabled={loading}
            className="w-full px-5 py-2 rounded-md border border-white/30 hover:bg-white/10 disabled:opacity-60"
          >
            Rimanda email di conferma
          </button>
        </div>
      )}

      {msg && (
        <p
          className={`mt-4 text-sm ${
            msg.type === 'error'
              ? 'text-red-400'
              : msg.type === 'success'
              ? 'text-emerald-400'
              : 'text-white/80'
          }`}
        >
          {msg.text}
        </p>
      )}

      <p className="mt-4 text-sm text-white/60">
        {isLogin ? (
          <>Non sei ancora registrato? <a href="/signup" className="underline">Registrati ora</a></>
        ) : (
          <>Hai già un account? <a href="/login" className="underline">Accedi</a></>
        )}
      </p>
    </main>
  );
}
