'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

function toItalianAuthError(error) {
  const raw = (error?.message || '').trim();
  const lower = raw.toLowerCase();

  // Problemi di rete / CORS / env / browser
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('fetch') ||
    lower.includes('cors')
  ) {
    return 'Errore di connessione. Riprova tra poco. Se continua, potrebbe esserci un problema di configurazione (URL/API key) o di rete.';
  }

  // Login errato
  if (lower.includes('invalid login credentials')) {
    return 'Credenziali non valide. Se non hai un account, registrati (ci metti pochissimo).';
  }

  // Email non confermata
  if (lower.includes('email not confirmed')) {
    return 'Email non ancora confermata. Controlla la posta e completa la conferma (anche in Spam).';
  }

  // Troppi tentativi
  if (lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Troppi tentativi in poco tempo. Aspetta qualche minuto e riprova.';
  }

  // Password troppo debole / vincoli
  if (lower.includes('password') && (lower.includes('weak') || lower.includes('short'))) {
    return 'Password troppo debole: usa almeno 6 caratteri (meglio 10+ con numeri e simboli).';
  }

  // Fallback: se supabase risponde in inglese, lo mostriamo comunque (meglio di nulla)
  return raw || 'Operazione non riuscita. Riprova.';
}

export default function AuthForm({ mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const normalizeEmail = (v) => v.trim().toLowerCase();
  const isLogin = mode === 'login';

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

    if (error) {
      const text = toItalianAuthError(error);
      const raw = (error?.message || '').toLowerCase();
      const already =
        raw.includes('already registered') ||
        raw.includes('has already been registered') ||
        raw.includes('già registrat');

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
        setMsg({ type: 'error', text: toItalianAuthError(error) });
      } else {
        setMsg({
          type: 'success',
          text: 'Nuova email di conferma inviata. Controlla anche la cartella Spam.',
        });
      }
    } catch (e) {
      setMsg({ type: 'error', text: e?.message || 'Impossibile rimandare la conferma.' });
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
      const text = toItalianAuthError(error);
      const lower = (error?.message || '').toLowerCase();

      // “Autocorrezione” intelligente: se non esiste/credenziali errate, suggeriamo registrazione
      if (lower.includes('invalid login credentials')) {
        setMsg({ type: 'error', text });
        return;
      }

      setMsg({ type: 'error', text });
      return;
    }

    window.location.href = '/';
  };

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
          <>
            Non sei ancora registrato?{' '}
            <a href="/signup" className="underline">
              Registrati ora
            </a>
          </>
        ) : (
          <>
            Hai già un account?{' '}
            <a href="/login" className="underline">
              Accedi
            </a>
          </>
        )}
      </p>
    </main>
  );
}
