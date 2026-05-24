'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
        <section className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-black/40 p-8 shadow-[0_0_45px_rgba(139,92,246,0.06)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Area account
          </p>

          <h1 className="mt-2 text-xl font-medium text-white">
            Caricamento…
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/55">
            Stiamo verificando la sessione del tuo account.
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
        <div>
          <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
            Lagoon Rebel Wear
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
            Account
          </h1>

          <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
            Accedi al tuo account Lagoon Rebel Wear per visualizzare la tua area personale.
          </p>
        </div>

        <section className="relative mt-10 overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/40 p-6 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Accesso richiesto
          </p>

          <h2 className="mt-2 text-xl font-medium text-white">
            Non sei loggato
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Per vedere la tua area account devi prima effettuare l’accesso con email e password.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
            >
              Accedi
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
            >
              Crea account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Il tuo account
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Area personale Lagoon Rebel Wear. Il sito è ancora in fase pre-lancio commerciale.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Profilo
          </p>

          <h2 className="mt-2 text-xl font-medium text-white">
            Ciao
          </h2>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Email account
            </p>

            <p className="mt-2 break-all text-sm font-medium text-white">
              {user.email}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Stato account
            </p>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Account attivo. Le funzioni legate a ordini, pagamenti e storico acquisti
              verranno completate prima dell’apertura commerciale del sito.
            </p>
          </div>

          <button
            onClick={logout}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:border-red-300/35 hover:bg-red-500/10 hover:text-red-200"
          >
            Logout
          </button>
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Pre-lancio
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Area account in evoluzione
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Questa sezione è già predisposta per accompagnare le prossime funzioni del brand,
            ma non è ancora collegata a ordini reali o pagamenti.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Ordini</p>
              <p className="mt-1 text-white/70">
                Non ancora attivi
              </p>
            </div>

            <div>
              <p className="text-white/45">Checkout reale</p>
              <p className="mt-1 text-white/70">
                Da collegare in uno step futuro
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
              Prima del lancio commerciale verranno completate le sezioni relative a ordini,
              assistenza, pagamenti, resi e dati ufficiali del venditore.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}