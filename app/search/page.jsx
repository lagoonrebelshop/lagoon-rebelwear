'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.js';

export default function Page() {
  const [q, setQ] = useState('');

  const CATALOG = Array.isArray(productsData) ? productsData : [];

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return CATALOG;
    return CATALOG.filter((p) => {
      const hay = `${p.title ?? ''} ${p.collection ?? ''} ${p.variant ?? ''}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q, CATALOG]);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-3xl font-semibold text-white">Cerca</h1>
      <p className="mt-2 text-white/70">Digita per cercare tra i prodotti Lagoon Rebel.</p>

      <form className="mt-6 flex gap-3" onSubmit={(e) => e.preventDefault()}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca prodotti…"
          className="w-full rounded-md bg-white px-4 py-3 text-sm text-black outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black/30"
        />
        <button
          type="submit"
          className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-black ring-1 ring-black/10 hover:bg-white/90"
        >
          Cerca
        </button>
      </form>

      {results.length === 0 ? (
        <p className="mt-8 text-white/60">Nessun prodotto trovato.</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(results || []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      )}
    </main>
  );
}
