'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row: Newsletter + Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Iscriviti</h3>
            <p className="text-white/70 mt-2 text-sm">
              Offerte, drop e storie da Venezia. Niente spam.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                placeholder="la-tua@email.com"
                className="w-full rounded-md bg-white/10 px-4 py-2.5 text-sm placeholder-white/50 outline-none border border-white/10 focus:border-white/30"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-md bg-white text-black px-4 py-2.5 text-sm font-semibold hover:bg-neutral-200"
              >
                Iscrivimi
              </button>
            </form>
          </div>

          {/* Colonna 1 — Shop (link esistenti) */}
          <div>
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="mt-3 space-y-2 text-white/80 text-sm">
              <li><Link href="/search" className="hover:text-white">Cerca</Link></li>
              <li><Link href="/cart" className="hover:text-white">Carrello</Link></li>
              <li><Link href="/account" className="hover:text-white">Account</Link></li>
            </ul>
          </div>

          {/* Colonna 2 — Legale (link esistenti) */}
          <div>
            <h3 className="text-lg font-semibold">Legale</h3>
            <ul className="mt-3 space-y-2 text-white/80 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie</Link></li>
              <li><Link href="/terms" className="hover:text-white">Termini</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contatti</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Lagoon Rebel Wear — All rights reserved. · Venezia, Italia
          </p>

          {/* Social (facoltativi) */}
          <div className="flex items-center gap-4 text-sm">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">Instagram</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
