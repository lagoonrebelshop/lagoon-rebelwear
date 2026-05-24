'use client';

import Link from 'next/link';

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--lrw-purple)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-sm text-white/66">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}

function ExternalFooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="transition hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[rgba(143,92,255,0.16)] bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.52)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,92,255,0.08),transparent_34%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.35fr_0.7fr_0.7fr_0.7fr] md:gap-10">
          <div>
            <p className="lrw-eyebrow mb-4">
              Lagoon dispatch
            </p>

            <h3 className="font-editorial text-4xl leading-none text-[var(--lrw-white)]">
              Iscriviti
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/62">
              Drop, aggiornamenti e storie da Venezia. Niente spam, solo comunicazioni selezionate.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="la-tua@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white placeholder-white/38 outline-none transition focus:border-[rgba(143,92,255,0.62)] focus:bg-white/[0.06] focus:shadow-[0_0_18px_rgba(143,92,255,0.10)]"
              />

              <button
                type="submit"
                className="whitespace-nowrap rounded-xl border border-[rgba(143,92,255,0.52)] bg-[rgba(143,92,255,0.16)] px-5 py-3 text-sm font-bold text-white transition hover:border-[rgba(143,92,255,0.82)] hover:bg-[rgba(143,92,255,0.24)] hover:shadow-[0_0_22px_rgba(143,92,255,0.16)]"
              >
                Iscrivimi
              </button>
            </form>

            <div className="mt-7 flex max-w-xs items-center gap-3 text-[var(--lrw-purple)]/70">
              <span className="h-px flex-1 bg-[rgba(143,92,255,0.34)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]">
                Venezia
              </span>
              <span className="h-px flex-1 bg-[rgba(143,92,255,0.34)]" />
            </div>
          </div>

          <FooterColumn title="Shop">
            <FooterLink href="/search">Cerca</FooterLink>
            <FooterLink href="/cart">Carrello</FooterLink>
            <FooterLink href="/account">Account</FooterLink>
          </FooterColumn>

          <FooterColumn title="Legale">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/cookies">Cookie</FooterLink>
            <FooterLink href="/terms">Termini</FooterLink>
            <FooterLink href="/contact">Contatti</FooterLink>
          </FooterColumn>

          <FooterColumn title="Social">
            <ExternalFooterLink href="https://www.instagram.com">
              Instagram
            </ExternalFooterLink>
            <ExternalFooterLink href="https://www.tiktok.com">
              TikTok
            </ExternalFooterLink>
          </FooterColumn>
        </div>

        <div className="my-10 h-px bg-[linear-gradient(90deg,transparent,rgba(143,92,255,0.28),transparent)]" />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/48">
            © {year} Lagoon Rebel Wear — All rights reserved. · Venezia, Italia
          </p>

          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--lrw-purple)]/80">
            Born in the lagoon
          </p>
        </div>
      </div>
    </footer>
  );
}