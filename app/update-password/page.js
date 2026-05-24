'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

function toItalianResetError(error) {
  const raw = (error?.message || '').trim();
  const lower = raw.toLowerCase();

  if (lower.includes('auth session missing')) {
    return 'Sessione di reset non trovata o scaduta. Richiedi un nuovo link per reimpostare la password.';
  }

  if (lower.includes('password') && (lower.includes('weak') || lower.includes('short'))) {
    return 'Password troppo debole: usa almeno 6 caratteri. Meglio ancora una password più lunga con numeri e simboli.';
  }

  if (lower.includes('expired') || lower.includes('invalid')) {
    return 'Il link di reset non è valido oppure è scaduto. Richiedi un nuovo link.';
  }

  return raw || 'Non è stato possibile aggiornare la password. Riprova.';
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setHasSession(Boolean(data?.session));
      setChecking(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasSession(Boolean(session));
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le due password non coincidono.');
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setSubmitting(false);

    if (updateError) {
      setError(toItalianResetError(updateError));
      return;
    }

    setDone(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Nuova password
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Imposta una nuova password per il tuo account Lagoon Rebel Wear.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Reset password
          </p>

          <h2 className="mt-2 text-xl font-medium text-white">
            {checking
              ? 'Verifica link in corso'
              : done
                ? 'Password aggiornata'
                : hasSession
                  ? 'Imposta la nuova password'
                  : 'Link non valido o scaduto'}
          </h2>

          {checking ? (
            <p className="mt-3 text-sm leading-6 text-white/60">
              Stiamo verificando il link di reimpostazione password.
            </p>
          ) : done ? (
            <div className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-200">
              Password aggiornata con successo. Ora puoi accedere con la nuova password.
            </div>
          ) : !hasSession ? (
            <div className="mt-5">
              <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                Il link di reset non è valido, è scaduto oppure non è stato aperto correttamente.
              </div>

              <Link
                href="/reset-password"
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
              >
                Richiedi nuovo link
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-7 grid gap-4">
              <label className="grid min-w-0 gap-2 text-sm">
                <span className="text-white/70">Nuova password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
                  placeholder="Nuova password"
                />
              </label>

              <label className="grid min-w-0 gap-2 text-sm">
                <span className="text-white/70">Conferma password</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
                  placeholder="Ripeti la nuova password"
                />
              </label>

              <p className="text-xs leading-5 text-white/45">
                Usa almeno 6 caratteri. Meglio ancora una password più lunga con numeri e simboli.
              </p>

              {error && (
                <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-black/70 disabled:shadow-none"
              >
                {submitting ? 'Aggiornamento…' : 'Aggiorna password'}
              </button>
            </form>
          )}

          {done && (
            <Link
              href="/login"
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
            >
              Vai al login
            </Link>
          )}
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Sicurezza account
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Link temporaneo
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Il link ricevuto via email è temporaneo. Se è scaduto o non viene riconosciuto,
            richiedi un nuovo link dalla pagina di reimpostazione password.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Password</p>
              <p className="mt-1 text-white/70">
                Minimo 6 caratteri
              </p>
            </div>

            <div>
              <p className="text-white/45">Account</p>
              <p className="mt-1 text-white/70">
                Gestito tramite Supabase Auth
              </p>
            </div>

            <div>
              <p className="text-white/45">Suggerimento</p>
              <p className="mt-1 text-white/70">
                Apri il link nello stesso browser in cui vuoi aggiornare la password.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}