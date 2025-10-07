// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-16 border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Newsletter */}
        <div className="md:col-span-2">
          <h3 className="font-bold text-lg">Lagoon Rebel — Newsletter</h3>
          <p className="text-white/70 text-sm mt-2">Drop esclusivi e news dalla Laguna.</p>
          {/* Sostituisci action con il tuo provider (Mailchimp/Formspree) */}
          <form className="mt-4 flex gap-2" action="https://formspree.io/f/IL_TUO_ID" method="POST">
            <input
              name="email"
              type="email"
              required
              placeholder="La tua email"
              className="w-full px-4 py-2 rounded-md bg-white text-black"
            />
            <button className="px-5 py-2 rounded-md bg-white text-black font-semibold hover:bg-neutral-200">
              ISCRIVITI
            </button>
          </form>
        </div>

        {/* Link utili */}
        <div>
          <h4 className="font-semibold mb-3">Info</h4>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><a href="/contact" className="hover:text-white">Contatti</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
            <li><a href="/cookies" className="hover:text-white">Cookie</a></li>
            <li><a href="/terms" className="hover:text-white">Termini & Condizioni</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Social</h4>
          <ul className="space-y-2 text-white/80 text-sm">
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a></li>
            <li><a href="https://tiktok.com"   target="_blank" rel="noreferrer" className="hover:text-white">TikTok</a></li>
            <li><a href="https://youtube.com"  target="_blank" rel="noreferrer" className="hover:text-white">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 text-xs text-white/60">
        © {new Date().getFullYear()} Lagoon Rebel Wear — Venezia, Italia
      </div>
    </footer>
  );
}
