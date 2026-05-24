'use client';

import Image from 'next/image';
import Link from 'next/link';

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--lrw-purple)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-sm text-white/62">
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

function FooterText({ children }) {
  return (
    <li className="text-white/42">
      {children}
    </li>
  );
}

function FooterArchAsset({ side = 'left' }) {
  const isRight = side === 'right';

  return (
    <Image
      src="/footer-arch-left.png"
      alt=""
      aria-hidden="true"
      width={1024}
      height={1536}
      priority={false}
      className={[
        'pointer-events-none absolute -bottom-20 z-0 hidden h-[64px] w-auto select-none md:block lg:-bottom-24 lg:h-[82px] xl:-bottom-28 xl:h-[96px]',
        'opacity-[0.46] brightness-[0.74] contrast-[1.18] saturate-[0.84]',
        isRight
          ? 'right-0 translate-x-[26%] scale-x-[-1]'
          : 'left-0 -translate-x-[26%]',
      ].join(' ')}
    />
  );
}

function FooterVenetianSymbol() {
  return (
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
      <Image
        src="/footer-venetian-symbol.png"
        alt=""
        aria-hidden="true"
        width={80}
        height={80}
        priority={false}
        className="h-9 w-9 object-contain opacity-90 brightness-[0.78] contrast-[1.12] saturate-[0.85] drop-shadow-[0_0_16px_rgba(139,92,246,0.42)]"
      />
    </div>
  );
}

function NewsletterBlock() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl text-center">
      <FooterVenetianSymbol />

      <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--lrw-purple)]">
        Lagoon dispatch
      </p>

      <h3 className="mt-3 font-editorial text-5xl leading-none text-[var(--lrw-white)] md:text-6xl">
        Iscriviti
      </h3>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/64">
        Drop, aggiornamenti e storie da Venezia. Nessuna newsletter è ancora attiva:
        questo spazio è in preparazione per il lancio ufficiale.
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="rounded-xl border border-white/12 bg-black/68 px-4 py-3 text-left text-sm text-white/34 shadow-inner backdrop-blur-sm">
          la-tua@email.com
        </div>

        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center rounded-xl border border-[rgba(143,92,255,0.38)] bg-[rgba(143,92,255,0.42)] px-7 py-3 text-sm font-bold tracking-wide text-white/76 shadow-[0_0_30px_rgba(143,92,255,0.18)]"
        >
          In preparazione
        </button>
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[rgba(143,92,255,0.22)] bg-black text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.72)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_20%,rgba(143,92,255,0.06))]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[540px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(143,92,255,0.13),transparent_64%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(143,92,255,0.30)] bg-[linear-gradient(180deg,rgba(255,255,255,0.052),rgba(255,255,255,0.018))] shadow-[0_0_90px_rgba(0,0,0,0.66)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.72)] to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,92,255,0.14),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-t from-black via-black/88 to-transparent" />

          <FooterArchAsset side="left" />
          <FooterArchAsset side="right" />

          <div className="relative z-10 px-6 pb-8 pt-14 md:px-10 md:pb-10 md:pt-16">
            <NewsletterBlock />

            <div className="mx-auto mt-12 h-px max-w-5xl bg-[linear-gradient(90deg,transparent,rgba(143,92,255,0.34),transparent)]" />

            <div className="relative mx-auto mt-10 max-w-5xl rounded-[1.5rem] border border-white/10 bg-black/74 p-6 shadow-[0_0_50px_rgba(0,0,0,0.52)] backdrop-blur-sm md:p-8">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.25fr_0.75fr_0.75fr_0.75fr]">
                <div>
                  <p className="lrw-eyebrow mb-4">
                    Pre-lancio
                  </p>

                  <h3 className="font-editorial text-3xl leading-none text-[var(--lrw-white)]">
                    Lagoon Rebel Wear
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/58">
                    Brand streetwear nato a Venezia. Minimal, strutturato, intenzionale.
                    Costruito su fondamenta invisibili ma necessarie.
                  </p>

                  <div className="mt-6 flex max-w-xs items-center gap-3 text-[var(--lrw-purple)]/74">
                    <span className="h-px flex-1 bg-[rgba(143,92,255,0.38)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em]">
                      Nato in laguna
                    </span>
                    <span className="h-px flex-1 bg-[rgba(143,92,255,0.38)]" />
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
                  <FooterText>Instagram — in preparazione</FooterText>
                  <FooterText>TikTok — in preparazione</FooterText>
                </FooterColumn>
              </div>
            </div>

            <div className="mx-auto mt-7 flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-white/46">
                © {year} Lagoon Rebel Wear — All rights reserved. · Venezia, Italia
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--lrw-purple)]/84">
                Fondamenta veneziane
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}