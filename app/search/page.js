'use client';

import { useMemo, useState } from 'react';
import { products } from '@/data/products';

export default function Page() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return products.filter(p => {
      const hay = (p.title + ' ' + p.subtitle + ' ' + p.tags.join(' ')).toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Cerca</h1>
      <p className="text-white/70 mt-2">Digita per cercare tra i prodotti Lagoon Rebel.</p>

      <div className="mt-6 flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-md bg-white text-black"
          placeholder="Es. tee, hoodie, zoomania, hyppopothesis, venezia…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-neutral-200"
          onClick={() => setQ(q)}
        >
          Cerca
        </button>
      </div>

      {/* Stato iniziale */}
      {!q && (
        <p className="text-white/60 mt-6">
          Suggerimenti: <span className="underline">tee</span>, <span className="underline">hoodie</span>, <span className="underline">zoomania</span>, <span className="underline">venezia</span>
        </p>
      )}

      {/* Nessun risultato */}
      {q && results.length === 0 && (
        <p className="text-white/60 mt-6">
          Nessun risultato per “{q}”. Prova con: tee, hoodie, zoomania…
        </p>
      )}

      {/* Risultati */}
      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(p => (
            <a
              key={p.id}
              href="#"
              className="group rounded-2xl overflow-hidden bg-neutral-800/60 border border-white/10 block"
            >
              <div className="relative aspect-[4/5] w-full">
                <img
                  src={p.frontSrc}
                  alt={`${p.title} - Front`}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                  loading="lazy"
                />
                <img
                  src={p.backSrc}
                  alt={`${p.title} - Back`}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 text-[11px] font-semibold tracking-wide bg-white text-black px-2 py-1 rounded-full">
                  Zoomania
                </span>
              </div>
              <div className="border-t border-white/10 bg-black/60 px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <p className="text-white/70 text-sm truncate">{p.subtitle}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
