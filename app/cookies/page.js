export const metadata = { title: 'Cookie Policy — Lagoon Rebel Wear' };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>
      <p className="text-white/80 mt-4">
        Usiamo cookie tecnici per il funzionamento del sito. 
        Cookie di analytics/marketing vengono attivati solo con il tuo consenso.
      </p>

      <h2 className="text-xl font-semibold mt-6">Tipologie</h2>
      <ul className="list-disc ml-5 text-white/80">
        <li><b>Tecnici</b>: essenziali (sessione, preferenze).</li>
        <li><b>Analytics</b>: statistiche aggregate (previo consenso).</li>
        <li><b>Marketing</b>: remarketing/ads (previo consenso).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Gestione preferenze</h2>
      <p className="text-white/80">
        Puoi modificare le preferenze cancellando i cookie dal browser 
        o riaprendo il banner (aggiungeremo un link nel footer).
      </p>
    </main>
  );
}
