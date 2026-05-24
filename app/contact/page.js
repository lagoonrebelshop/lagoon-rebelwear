export const metadata = {
  title: 'Contatti — Lagoon Rebel Wear',
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Contatti
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Per richieste, collaborazioni o informazioni sul progetto Lagoon Rebel Wear.
          Il brand è attualmente in fase di sviluppo e pre-lancio commerciale.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.05)] sm:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
              Scrivici
            </p>

            <h2 className="mt-2 text-xl font-medium text-white">
              Invia un messaggio
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Usa questo modulo per contattare il progetto. I canali ufficiali definitivi
              verranno completati prima dell’attivazione commerciale del sito.
            </p>
          </div>

          <form
            className="mt-7 grid gap-4"
            action="https://formspree.io/f/mzzjavly"
            method="POST"
          >
            <label className="grid min-w-0 gap-2 text-sm">
              <span className="text-white/70">Nome</span>
              <input
                name="name"
                placeholder="Il tuo nome"
                required
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-sm">
              <span className="text-white/70">Email</span>
              <input
                name="email"
                type="email"
                placeholder="email@esempio.it"
                required
                className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
              />
            </label>

            <label className="grid min-w-0 gap-2 text-sm">
              <span className="text-white/70">Messaggio</span>
              <textarea
                name="message"
                placeholder="Scrivi qui il tuo messaggio"
                rows={6}
                required
                className="w-full resize-none rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
              />
            </label>

            <button
              type="submit"
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
            >
              Invia messaggio
            </button>

            <p className="text-xs leading-5 text-white/45">
              Il modulo è attivo a fini di contatto preliminare. Prima della vendita reale
              verranno definiti indirizzi email ufficiali e canali di assistenza dedicati.
            </p>
          </form>
        </section>

        <aside className="relative h-max overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/50 p-5 shadow-[0_0_45px_rgba(139,92,246,0.08)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Stato contatti
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Canali ufficiali in preparazione
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Lagoon Rebel Wear è ancora in fase di sviluppo. Le email ufficiali per assistenza,
            privacy, ordini e collaborazioni verranno create e pubblicate prima del lancio
            commerciale.
          </p>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-white/45">Dominio</p>
              <p className="mt-1 text-white">lagoonrebelwear.com</p>
            </div>

            <div>
              <p className="text-white/45">Vendita online</p>
              <p className="mt-1 text-white/70">
                Non ancora attiva
              </p>
            </div>

            <div>
              <p className="text-white/45">Assistenza clienti</p>
              <p className="mt-1 text-white/70">
                Da completare prima del lancio
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs leading-5 text-white/50">
              Per ora questa pagina serve a raccogliere richieste preliminari e contatti legati
              allo sviluppo del brand. Non è ancora un canale di assistenza per ordini reali.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}