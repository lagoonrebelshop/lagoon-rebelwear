'use client';

import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

const products = [
  {
    id: 'dev-tee-lr-black',
    title: 'DEV — T-Shirt test',
    price: 24.9,
    size: 'M',
    variant: 'Black',
  },
  {
    id: 'dev-hoodie-lr-black',
    title: 'DEV — Hoodie test',
    price: 49.0,
    size: 'L',
    variant: 'Black',
  },
  {
    id: 'dev-cap-lr-black',
    title: 'DEV — Cap test',
    price: 19.5,
    size: 'OS',
    variant: 'Black',
  },
];

export default function Page() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment) {
    return (
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-white">
        <section className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-black/40 p-8 shadow-[0_0_45px_rgba(139,92,246,0.06)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]/80">
            Lagoon Rebel Wear
          </p>

          <h1 className="mt-2 text-xl font-medium text-white">
            Pagina di sviluppo non disponibile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Questa pagina è riservata ai test locali e non è accessibile in produzione.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.22)] transition hover:bg-[#7c3aed]"
          >
            Torna alla home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Development
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Demo carrello
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Pagina locale di test per aggiungere prodotti demo al carrello.
          Non viene mostrata come pagina operativa in produzione.
        </p>

        <p className="mt-3 text-sm text-white/50">
          Vai al{' '}
          <Link href="/cart" className="text-[#c4b5fd] underline-offset-4 hover:text-white hover:underline">
            carrello
          </Link>
          .
        </p>
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_0_35px_rgba(139,92,246,0.05)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/45 to-transparent" />

            <p className="text-[10px] uppercase tracking-[0.22em] text-[#a78bfa]/75">
              Test item
            </p>

            <h2 className="mt-2 font-medium text-white">
              {p.title}
            </h2>

            <p className="mt-2 text-sm text-white/60">
              {p.variant}
              {p.size ? ` • Taglia ${p.size}` : ''}
            </p>

            <p className="mt-3 text-sm font-semibold text-white">
              € {p.price.toFixed(2)}
            </p>

            <div className="mt-5">
              <AddToCartButton
                id={p.id}
                title={p.title}
                price={p.price}
                size={p.size}
                variant={p.variant}
                className="w-full"
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}