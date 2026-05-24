'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmClient() {
  const sp = useSearchParams();
  const status = sp.get('status') || 'ok';
  const message = sp.get('message') || null;

  const isError = status === 'error';
  const isSuccess = status === 'success';

  const title = isError
    ? 'Conferma non riuscita'
    : isSuccess
      ? 'Email confermata'
      : 'Verifica completata';

  const defaultMessage = isError
    ? 'Il link di conferma potrebbe essere scaduto, già utilizzato oppure non valido. Puoi provare ad accedere o richiedere una nuova conferma.'
    : isSuccess
      ? 'Il tuo indirizzo email è stato confermato correttamente. Ora puoi accedere al tuo account Lagoon Rebel Wear.'
      : 'La verifica è stata completata. Se non riesci ad accedere, controlla la posta indesiderata oppure prova a richiedere una nuova email di conferma.';

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Conferma email
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Verifica dell’indirizzo email associato al tuo account Lagoon Rebel Wear.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Stato verifica
          </p>

          <h2 className="mt-2 text-xl font-medium text-white">
            {title}
          </h2>

          <div
            className={[
              'mt-5 rounded-xl border p-4 text-sm leading-6',
              isError
                ? 'border-red-400/25 bg-red-500/10 text-red-200'
                : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200',
            ].join(' ')}
          >
            {message || defaultMessage}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
            >
              Accedi
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
            >
              Torna alla home
            </Link>
          </div>
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Account
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Conferma necessaria
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Per usare correttamente l’account, l’indirizzo email deve essere confermato
            attraverso il link ricevuto via email.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Email</p>
              <p className="mt-1 text-white/70">
                Controlla anche Spam o Promozioni
              </p>
            </div>

            <div>
              <p className="text-white/45">Link</p>
              <p className="mt-1 text-white/70">
                Può essere temporaneo o utilizzabile una sola volta
              </p>
            </div>

            <div>
              <p className="text-white/45">Accesso</p>
              <p className="mt-1 text-white/70">
                Dopo la conferma puoi effettuare il login
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs leading-5 text-white/50">
              Se la conferma non va a buon fine, prova ad accedere o a richiedere
              nuovamente l’email di conferma dalla registrazione.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ConfirmFallback() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <section className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-black/40 p-8 shadow-[0_0_45px_rgba(139,92,246,0.06)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

        <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-2 text-xl font-medium text-white">
          Verifica in corso…
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/55">
          Attendi qualche istante mentre completiamo la verifica dell’indirizzo email.
        </p>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ConfirmFallback />}>
      <ConfirmClient />
    </Suspense>
  );
}