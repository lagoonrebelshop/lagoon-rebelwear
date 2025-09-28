'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

export default function Page() {
  const [items, setItems] = useState([]);

  // Carica il carrello dal localStorage al primo render (solo client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('lr_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        // normalizzazione minima dei campi
        const safe = Array.isArray(parsed)
          ? parsed.map((it) => ({
              id: it.id,
              title: it.title ?? 'Prodotto',
              price: Number(it.price) || 0,
              qty: Math.max(1, Number(it.qty) || 1),
              size: it.size ?? null,
              variant: it.variant ?? null,
            }))
          : [];
        setItems(safe);
      }
    } catch {
      // ignora errori di parsing
    }
  }, []);

  // Salva ogni modifica
  useEffect(() => {
    try {
      localStorage.setItem('lr_cart', JSON.stringify(items));
    } catch {
      // ignora errori di scrittura
    }
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  const inc = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: (it.qty || 1) + 1 } : it)));

  const dec = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, (Number(it.qty) || 1) - 1) } : it
      )
    );

  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const clear = () => setItems([]);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16">
      <h1 className="text-2xl font-semibold text-white">Carrello</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-white/80">
          <p>Il tuo carrello è vuoto.</p>
          <div className="mt-6">
            <Link
              href="/search"
              className="rounded-md px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/5"
            >
              Vai alla ricerca
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <ul className="divide-y divide-white/10">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-4 p-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-medium text-white">{it.title}</h2>
                      <button
                        onClick={() => remove(it.id)}
                        className="text-sm text-white/60 hover:text-white"
                      >
                        Rimuovi
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-white/60">
                      {it.variant ? it.variant : null}{' '}
                      {it.size ? `• Taglia ${it.size}` : null}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center rounded-lg ring-1 ring-white/10">
                        <button
                          onClick={() => dec(it.id)}
                          className="px-3 py-1.5 text-white/80 hover:bg-white/5"
                          aria-label="Diminuisci quantità"
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm text-white/90">{it.qty}</span>
                        <button
                          onClick={() => inc(it.id)}
                          className="px-3 py-1.5 text-white/80 hover:bg-white/5"
                          aria-label="Aumenta quantità"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {formatEUR((Number(it.price) || 0) * (Number(it.qty) || 0))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between p-4">
              <button onClick={clear} className="text-sm text-white/70 hover:text-white">
                Svuota carrello
              </button>
              <div className="text-sm text-white/90">
                Subtotale: <span className="font-semibold">{formatEUR(subtotal)}</span>
              </div>
            </div>
          </div>

          <aside className="h-max rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-medium text-white">Riepilogo</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/70">Subtotale</dt>
                <dd className="text-white/90">{formatEUR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/70">Spedizione</dt>
                <dd className="text-white/60">Calcolata al checkout</dd>
              </div>
            </dl>
            <div className="mt-6">
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/5"
              >
                Vai al checkout
              </Link>
            </div>
            <p className="mt-3 text-xs text-white/60">Le tasse saranno calcolate al checkout.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
