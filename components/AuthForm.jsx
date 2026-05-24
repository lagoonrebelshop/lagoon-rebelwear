'use client';

import Link from 'next/link';
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

function getMessageClass(type) {
  if (type === 'error') {
    return 'border-red-400/25 bg-red-500/10 text-red-200';
  }

  if (type === 'success') {
    return 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200';
  }

  return 'border-[#8b5cf6]/25 bg-[#8b5cf6]/10 text-white/80';
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
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          {isLogin ? 'Accedi' : 'Registrati'}
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          {isLogin
            ? 'Accedi al tuo account Lagoon Rebel Wear per gestire il profilo e prepararti ai prossimi step del brand.'
            : 'Crea il tuo account Lagoon Rebel Wear. Riceverai una mail di conferma prima di poter accedere.'}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
              {isLogin ? 'Area account' : 'Nuovo account'}
            </p>

            <h2 className="mt-2 text-xl font-medium text-white">
              {isLogin ? 'Entra con email e password' : 'Crea le tue credenziali'}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              {isLogin
                ? 'Usa le credenziali con cui hai creato il tuo account.'
                : 'Dopo la registrazione dovrai confermare l’indirizzo email prima dell’accesso.'}
            </p>
          </div>

          <form className="mt-7 grid gap-4" onSubmit={isLogin ? onLogin : onSignup}>
            <label className="grid min-w-0 gap-2 text-sm">
              <span className="text-white/70">Email</span>
              <input
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
                placeholder="email@esempio.it"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="grid min-w-0 gap-2 text-sm">
              <span className="text-white/70">Password</span>
              <input
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
            </label>

            {!isLogin && (
              <p className="text-xs leading-5 text-white/45">
                Usa almeno 6 caratteri. Meglio ancora una password più lunga con numeri e simboli.
              </p>
            )}

            <button
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-black/70 disabled:shadow-none"
            >
              {loading ? 'Attendere…' : isLogin ? 'Entra' : 'Crea account'}
            </button>
          </form>

          {isLogin && (
            <p className="mt-4 text-sm text-white/65">
              Hai dimenticato la password?{' '}
              <Link
                href="/reset-password"
                className="text-[#c4b5fd] underline-offset-4 transition hover:text-white hover:underline"
              >
                Reimpostala
              </Link>
            </p>
          )}

          {!isLogin && canResend && (
            <div className="mt-4">
              <button
                onClick={onResend}
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-md border border-[#8b5cf6]/35 bg-[#8b5cf6]/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:border-[#a78bfa]/60 hover:bg-[#8b5cf6]/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Rimanda email di conferma
              </button>
            </div>
          )}

          {msg && (
            <div
              className={[
                'mt-5 rounded-xl border p-4 text-sm leading-6',
                getMessageClass(msg.type),
              ].join(' ')}
            >
              {msg.text}
            </div>
          )}

          <p className="mt-5 text-sm text-white/60">
            {isLogin ? (
              <>
                Non sei ancora registrato?{' '}
                <Link
                  href="/signup"
                  className="text-[#c4b5fd] underline-offset-4 transition hover:text-white hover:underline"
                >
                  Registrati ora
                </Link>
              </>
            ) : (
              <>
                Hai già un account?{' '}
                <Link
                  href="/login"
                  className="text-[#c4b5fd] underline-offset-4 transition hover:text-white hover:underline"
                >
                  Accedi
                </Link>
              </>
            )}
          </p>
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Brand account
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Account in fase pre-lancio
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Il sistema account è già predisposto, ma Lagoon Rebel Wear non è ancora
            un e-commerce attivo per la vendita reale.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Accesso</p>
              <p className="mt-1 text-white/70">
                Email e password tramite Supabase Auth
              </p>
            </div>

            <div>
              <p className="text-white/45">Conferma email</p>
              <p className="mt-1 text-white/70">
                Richiesta dopo la registrazione
              </p>
            </div>

            <div>
              <p className="text-white/45">Vendita online</p>
              <p className="mt-1 text-white/70">
                Non ancora attiva
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs leading-5 text-white/50">
              Prima del lancio commerciale verranno completati checkout, ordini,
              pagamenti, email transazionali e dati ufficiali del venditore.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}