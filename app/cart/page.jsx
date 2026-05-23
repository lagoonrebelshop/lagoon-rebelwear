// app/cart/page.jsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { getCart, setCart } from '@/lib/cart';

function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

const CART_EVENT = 'lr_cart_updated';

const keyOf = (it) => `${it.id}__${it.size ?? ''}__${it.variant ?? ''}`;

function getImagesForCartItem(it) {
  return {
    front: it?.imageFront || '/og.jpg',
    back: it?.imageBack || null,
  };
}

export default function Page() {
  const [items, setItems] = useState([]);
  const [flipped, setFlipped] = useState({});

  // Carica dal localStorage e normalizza i dati del carrello
  const load = useCallback(() => {
    const next = getCart();

    const safe = Array.isArray(next)
      ? next.map((it) => ({
          id: it.id,
          slug: it.slug ?? it.id ?? null,
          title: it.title ?? 'Prodotto',
          price: Number(it.price) || 0,
          qty: Math.max(1, Number(it.qty) || 1),
          size: it.size ?? null,
          variant: it.variant ?? null,
          category: it.category ?? null,
          colorName: it.colorName ?? it.variant ?? null,
          imageFront: it.imageFront ?? null,
          imageBack: it.imageBack ?? null,
        }))
      : [];

    setItems(safe);
  }, []);

  // Primo render + ascolta aggiornamenti esterni del carrello
  useEffect(() => {
    load();

    const onCustom = () => load();
    window.addEventListener(CART_EVENT, onCustom);

    return () => window.removeEventListener(CART_EVENT, onCustom);
  }, [load]);

  // Helpers update + persist
  const updateAll = (fn) =>
    setItems((prev) => {
      const next = fn(prev);
      setCart(next);
      return next;
    });

  const inc = (k) =>
    updateAll((prev) =>
      prev.map((it) =>
        keyOf(it) === k
          ? { ...it, qty: (Number(it.qty) || 1) + 1 }
          : it
      )
    );

  const dec = (k) =>
    updateAll((prev) =>
      prev.map((it) =>
        keyOf(it) === k
          ? { ...it, qty: Math.max(1, (Number(it.qty) || 1) - 1) }
          : it
      )
    );

  const remove = (k) => {
    updateAll((prev) => prev.filter((it) => keyOf(it) !== k));
    setFlipped((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const clear = () => {
    updateAll(() => []);
    setFlipped({});
  };

  const toggleFlip = (k) => {
    setFlipped((prev) => ({
      ...prev,
      [k]: !prev[k],
    }));
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [items]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
      {/* HEADER */}
      <h1 className="text-[13px] tracking-[0.22em] text-white/80 uppercase">
        Il tuo carrello
      </h1>
      <div className="mt-2 h-px bg-white/10" />

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-white/80">
          <p>Il tuo carrello è vuoto.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-md px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/5"
            >
              Vai alla ricerca
            </Link>

            <Link
              href="/"
              className="rounded-md px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/5"
            >
              Torna alla home
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
          {/* LISTA ARTICOLI */}
          <div className="rounded-2xl border border-white/10 bg-black/40">
            <ul className="divide-y divide-white/10">
              {items.map((it) => {
                const k = keyOf(it);
                const imgs = getImagesForCartItem(it);
                const hasBack = Boolean(imgs.back);
                const isFlipped = Boolean(flipped[k]);
                const total = formatEUR(
                  (Number(it.price) || 0) * (Number(it.qty) || 0)
                );

                return (
                  <li key={k} className="flex items-start gap-4 p-4">
                    {/* THUMB prodotto reale dal carrello */}
                    <div className="group relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-black sm:w-28">
                      <img
                        src={imgs.front}
                        alt={`${it.title} - Front`}
                        className={[
                          'absolute inset-0 h-full w-full object-contain transition-opacity duration-300',
                          hasBack && isFlipped ? 'opacity-0 md:opacity-100' : 'opacity-100',
                          hasBack ? 'md:group-hover:opacity-0' : '',
                        ].join(' ')}
                        loading="lazy"
                        draggable="false"
                      />

                      {hasBack && (
                        <img
                          src={imgs.back}
                          alt={`${it.title} - Back`}
                          className={[
                            'absolute inset-0 h-full w-full object-contain transition-opacity duration-300',
                            isFlipped ? 'opacity-100 md:opacity-0' : 'opacity-0',
                            'md:group-hover:opacity-100',
                          ].join(' ')}
                          loading="lazy"
                          draggable="false"
                        />
                      )}

                      {hasBack && (
                        <button
                          type="button"
                          className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] text-white ring-1 ring-white/20 md:hidden"
                          onClick={() => toggleFlip(k)}
                          aria-label="Mostra fronte/retro"
                          title="Mostra fronte/retro"
                        >
                          ↺
                        </button>
                      )}
                    </div>

                    {/* DETTAGLI */}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <h2 className="truncate text-sm font-medium">
                          {it.title}
                        </h2>

                        <button
                          type="button"
                          onClick={() => remove(k)}
                          className="shrink-0 text-xs text-white/60 hover:text-white"
                          title="Rimuovi"
                          aria-label={`Rimuovi ${it.title} dal carrello`}
                        >
                          Rimuovi
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-white/60">
                        {it.variant || it.colorName || 'Variante non specificata'}
                        {it.size ? ` • Taglia ${it.size}` : ''}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => dec(k)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                            aria-label="Diminuisci quantità"
                          >
                            –
                          </button>

                          <span className="w-8 text-center text-sm">
                            {it.qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => inc(k)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                            aria-label="Aumenta quantità"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm font-medium">{total}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <button
                type="button"
                onClick={clear}
                className="text-xs uppercase tracking-widest text-white/70 hover:text-white"
              >
                Svuota carrello
              </button>

              <span className="text-sm">
                Subtotale: <b>{formatEUR(subtotal)}</b>
              </span>
            </div>
          </div>

          {/* RIEPILOGO */}
          <aside className="h-max rounded-2xl border border-white/10 bg-black/50 p-6">
            <h3 className="text-[12px] uppercase tracking-[0.2em] text-white/80">
              Riepilogo
            </h3>
            <div className="mt-3 h-px bg-white/10" />

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/70">Subtotale</dt>
                <dd>{formatEUR(subtotal)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-white/70">Spedizione</dt>
                <dd className="text-white/60">Calcolata al checkout</dd>
              </div>
            </dl>

            <div className="mt-4 h-px bg-white/10" />

            <div className="mt-3 flex justify-between">
              <span className="text-sm font-semibold uppercase text-white">
                Totale
              </span>
              <span className="font-semibold text-white">
                {formatEUR(subtotal)}
              </span>
            </div>

            <p className="mt-2 text-xs text-white/70">
              o 3 rate da <b>{formatEUR(subtotal / 3)}</b> senza interessi con Scalapay
            </p>

            <div className="mt-6">
              <button
                type="button"
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-md bg-white/40 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
                title="Checkout non ancora attivo"
              >
                Checkout in preparazione
              </button>
            </div>

            <p className="mt-3 text-[11px] text-white/60">
              Il checkout non è ancora attivo. Nel prossimo step collegheremo il pagamento reale.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}