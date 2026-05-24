'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';

function toItalianResetRequestError(error) {
  const raw = (error?.message || '').trim();
  const lower = raw.toLowerCase();

  if (lower.includes('rate limit') || lower.includes('email rate limit')) {
    return 'Hai richiesto troppe email in poco tempo. Attendi almeno un’ora prima di riprovare.';
  }

  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('fetch') ||
    lower.includes('cors')
  ) {
    return 'Errore di connessione. Riprova tra poco.';
  }

  return raw || 'Non è stato possibile inviare il link di reset. Riprova.';
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/update-password`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError(toItalianResetRequestError(resetError));
      return;
    }

    setSent(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Reimposta password
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Inserisci l’email associata al tuo account Lagoon Rebel Wear. Riceverai un link
          temporaneo per impostare una nuova password.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Recupero account
          </p>

          <h2 className="mt-2 text-xl font-medium text-white">
            {sent ? 'Controlla la tua email' : 'Richiedi il link di reset'}
          </h2>

          {sent ? (
            <div className="mt-5">
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-200">
                Se l’email esiste nel sistema, ti abbiamo inviato un link per reimpostare
                la password. Controlla la posta in arrivo e anche la cartella Spam.
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
                >
                  Torna al login
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError('');
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
                >
                  Reinvia
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-7 grid gap-4">
              <label className="grid min-w-0 gap-2 text-sm">
                <span className="text-white/70">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
                  placeholder="email@esempio.it"
                />
              </label>

              {error && (
                <div className="rounded-xl border border-red-400/25 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-black/70 disabled:shadow-none"
              >
                {loading ? 'Invio in corso…' : 'Invia link di reset'}
              </button>

              <p className="text-xs leading-5 text-white/45">
                Per sicurezza, il link ricevuto via email sarà temporaneo. Se scade,
                potrai richiederne uno nuovo.
              </p>
            </form>
          )}

          {!sent && (
            <p className="mt-5 text-sm text-white/60">
              Ti è tornata in mente la password?{' '}
              <Link
                href="/login"
                className="text-[#c4b5fd] underline-offset-4 transition hover:text-white hover:underline"
              >
                Accedi
              </Link>
            </p>
          )}
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Sicurezza
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Link temporaneo via email
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Il link di reimpostazione viene inviato solo all’indirizzo email associato
            all’account. Aprilo dallo stesso dispositivo o browser in cui vuoi completare
            l’aggiornamento.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Invio email</p>
              <p className="mt-1 text-white/70">
                Può essere soggetto a limiti temporanei
              </p>
            </div>

            <div>
              <p className="text-white/45">Spam</p>
              <p className="mt-1 text-white/70">
                Controlla anche posta indesiderata o promozioni
              </p>
            </div>

            <div>
              <p className="text-white/45">Nuova password</p>
              <p className="mt-1 text-white/70">
                Verrà impostata nella pagina successiva
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs leading-5 text-white/50">
              Durante i test può comparire un limite di invio email. In quel caso attendi
              prima di richiedere un nuovo link.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}