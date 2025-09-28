export const metadata = { title: 'Termini & Condizioni — Lagoon Rebel Wear' };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Termini & Condizioni</h1>

      <h2 className="text-xl font-semibold mt-6">Ordini e pagamenti</h2>
      <p className="text-white/80">
        Prezzi IVA inclusa ove applicabile. Il contratto si conclude alla conferma d’ordine.
      </p>

      <h2 className="text-xl font-semibold mt-6">Spedizioni & Resi</h2>
      <p className="text-white/80">
        Diritto di recesso entro 14 giorni dalla consegna, con prodotto integro e non usato. 
        Istruzioni e indirizzo resi verranno forniti via email.
      </p>

      <h2 className="text-xl font-semibold mt-6">Responsabilità</h2>
      <p className="text-white/80">
        Il sito è fornito “così com’è”. Possibili interruzioni non dipendenti da noi.
      </p>
    </main>
  );
}
