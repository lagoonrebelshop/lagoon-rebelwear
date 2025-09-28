export const metadata = { title: 'Privacy — Lagoon Rebel Wear' };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Informativa Privacy (GDPR)</h1>
      <p className="text-white/80 mt-4">
        Titolare: Lagoon Rebel Wear — Email: privacy@lagoonrebelwear.it
      </p>

      <h2 className="text-xl font-semibold mt-8">Dati trattati</h2>
      <ul className="list-disc ml-5 text-white/80">
        <li>Contatti (nome, email) per richieste e newsletter</li>
        <li>Dati tecnici aggregati (IP troncato, device) per sicurezza/statistiche</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Finalità e basi giuridiche</h2>
      <ul className="list-disc ml-5 text-white/80">
        <li>Rispondere a richieste (consenso o contratto)</li>
        <li>Inviare newsletter (consenso revocabile)</li>
        <li>Sicurezza del sito (legittimo interesse)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Conservazione</h2>
      <p className="text-white/80">Solo per il tempo necessario alle finalità indicate.</p>

      <h2 className="text-xl font-semibold mt-6">Diritti</h2>
      <p className="text-white/80">
        Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati scrivendo a privacy@lagoonrebelwear.it.
      </p>
    </main>
  );
}
