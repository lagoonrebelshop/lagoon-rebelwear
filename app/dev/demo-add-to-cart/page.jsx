'use client';

import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

const products = [
  { id: 'tee-lr-nero', title: 'T-Shirt Lagoon Rebel Nera', price: 24.9, size: 'M', variant: 'Nero' },
  { id: 'hoodie-lr', title: 'Felpa Lagoon Rebel', price: 49.0, size: 'L', variant: 'Black' },
  { id: 'cap-lr', title: 'Cappellino Lagoon Rebel', price: 19.5, size: null, variant: 'Black' },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-2xl font-semibold text-white">Demo — Aggiungi al carrello</h1>
      <p className="mt-2 text-white/70">
        Usa questa pagina di prova per aggiungere prodotti e poi vai al{' '}
        <Link href="/cart" className="underline">carrello</Link>.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-white font-medium">{p.title}</h2>
            <p className="mt-1 text-sm text-white/70">
              {p.variant ? `${p.variant} ` : ''}{p.size ? `• Taglia ${p.size}` : ''}
            </p>
            <p className="mt-2 text-white/90 text-sm">€ {p.price.toFixed(2)}</p>
            <div className="mt-4">
              <AddToCartButton
                id={p.id}
                title={p.title}
                price={p.price}
                size={p.size}
                variant={p.variant}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
