export const metadata = { title: 'Contatti — Lagoon Rebel Wear' };

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Contatti</h1>
      <p className="text-white/80 mt-4">
        Email: <a href="mailto:hello@lagoonrebelwear.it" className="underline">hello@lagoonrebelwear.it</a>
      </p>

      <form className="mt-8 space-y-4" action="https://formspree.io/f/IL_TUO_ID" method="POST">
        <input name="name" placeholder="Nome" required className="w-full px-4 py-2 rounded-md bg-white text-black"/>
        <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 rounded-md bg-white text-black"/>
        <textarea name="message" placeholder="Messaggio" rows={5} required className="w-full px-4 py-2 rounded-md bg-white text-black"/>
        <button className="px-5 py-2 rounded-md bg-white text-black font-semibold hover:bg-neutral-200">Invia</button>
      </form>
    </main>
  );
}
