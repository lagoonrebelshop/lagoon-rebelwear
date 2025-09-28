'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmClient() {
  const sp = useSearchParams();
  const status = sp.get('status') || 'ok';
  const message = sp.get('message') || null;

  const title =
    status === 'error'
      ? 'Conferma non riuscita'
      : status === 'success'
      ? 'Email confermata'
      : 'Verifica completata';

  return (
    <main className="mx-auto max-w-xl px-4 pt-24 pb-16">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      {message ? (
        <p className="mt-3 text-white/70">{message}</p>
      ) : (
        <p className="mt-3 text-white/70">
          Se non hai ancora ricevuto l’email, controlla la posta indesiderata oppure riprova.
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-md px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/5"
        >
          Accedi
        </Link>
        <Link
          href="/"
          className="rounded-md px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/10 hover:bg-white/5"
        >
          Torna alla Home
        </Link>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-4 pt-24 pb-16">
          <h1 className="text-2xl font-semibold text-white">Verifica in corso…</h1>
          <p className="mt-3 text-white/70">Attendi qualche istante.</p>
        </main>
      }
    >
      <ConfirmClient />
    </Suspense>
  );
}
