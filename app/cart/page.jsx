'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { getCart, setCart } from '@/lib/cart';

function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

const CART_EVENT = 'lr_cart_updated';

const keyOf = (it) => `${it.id}__${it.size ?? ''}__${it.variant ?? ''}`;

/** Mappa immagini prodotto fronte/retro */
function getImagesFor(it) {
  const title = (it?.title || '').toLowerCase();
  const id = (it?.id || '').toLowerCase();

  if (id.includes('tee') || title.includes('tee')) {
    return {
      front: '/zoomania-hyppopothesis-front.png',
      back: '/zoomania-hyppopothesis-back.png',
      aspect: 'aspect-[4/5]',
    };
  }
  if (id.includes('hoodie') || title.includes('hoodie')) {
    return {
      front: '/zoomania-hyppopothesis-hoodie-front.png',
      back: '/zoomania-hyppopothesis-hoodie-back.png',
      aspect: 'aspect-[4/5]',
    };
  }
  return { front: '/og.jpg', back: '/og.jpg', aspect: 'aspect-square' };
}

/** Icona pagamento uniforme 72x36
 * Ordine di tentativi:
 *   1) /payments/<name>.png
 *   2) /payments/<name>.svg.png
 *   3) fallback testuale
 */
function PaymentIcon({ name, alt }) {
  const png = `/payments/${name}.png`;
  const svgpng = `/payments/${name}.svg.png`;

  const onError = (e) => {
    const tried = e.currentTarget.dataset.fallback || 'none';
    if (tried === 'none') {
      e.currentTarget.dataset.fallback = 'svgpng';
      e.currentTarget.src = svgpng;
      return;
    }
    // fallback finale testuale
    e.currentTarget.parentElement.innerHTML =
      `<span class="inline-flex h-[36px] w-[72px] items-center justify-center rounded-[8px] bg-white/10 text-[10px] uppercase tracking-wide text-white/80 ring-1 ring-white/20"> ${alt} </span>`;
  };

  return (
    <span className="inline-flex h-[36px] w-[72px] items-center justify-center">
      <span className="inline-flex h-[36px] w-[72px] items-center justify-center rounded-[8px] bg-white shadow-sm ring-1 ring-white/10 overflow-hidden">
        <img
          src={png}
          alt={alt}
          className="h-[24px] w-auto object-contain"
          decoding="async"
          data-fallback="none"
          onError={onError}
        />
      </span>
    </span>
  );
}

export default function Page() {
  const [items, setItems] = useState([]);

  // Carica dal localStorage (via lib) e normalizza
  const load = useCallback(() => {
    const next = getCart();
    const safe = Array.isArray(next)
      ? next.map((it) => ({
          id: it.id,
          title: it.title ?? 'Prodotto',
          price: Number(it.price) || 0,
          qty: Math.max(1, Number(it.qty) || 1),
          size: it.size ?? null,
          variant: it.variant ?? null,
        }))
      : [];
    setItems(safe);
  }, []);

  // Primo render + ascolta aggiornamenti esterni
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
      prev.map((it) => (keyOf(it) === k ? { ...it, qty: (Number(it.qty) || 1) + 1 } : it))
    );

  const dec = (k) =>
    updateAll((prev) =>
      prev.map((it) =>
        keyOf(it) === k ? { ...it, qty: Math.max(1, (Number(it.qty) || 1) - 1) } : it
      )
    );

  const remove = (k) => updateAll((prev) => prev.filter((it) => keyOf(it) !== k));
  const clear = () => updateAll(() => []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
    [items]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
      {/* HEADER */}
      <h1 className="text-[13px] tracking-[0.22em] text-white/80 uppercase">Il tuo carrello</h1>
      <div className="mt-2 h-px bg-white/10" />

      {items.length === 0 ? (
        <div className="mt-12 border border-white/10 rounded-2xl bg-white/5 p-8 text-white/80">
          <p>Il tuo carrello è vuoto.</p>
          <div className="mt-6 flex gap-3">
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
          <div className="border border-white/10 rounded-2xl bg-black/40">
            <ul className="divide-y divide-white/10">
              {items.map((it) => {
                const k = keyOf(it);
                const imgs = getImagesFor(it);
                const total = formatEUR((Number(it.price) || 0) * (Number(it.qty) || 0));
                return (
                  <li key={k} className="flex items-start gap-4 p-4">
                    {/* THUMB fronte/retro */}
                    <div className={`group relative w-24 sm:w-28 ${imgs.aspect} shrink-0`}>
                      <Image
                        src={imgs.front}
                        alt={it.title}
                        fill
                        sizes="112px"
                        className="object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                      />
                      <Image
                        src={imgs.back}
                        alt={it.title}
                        fill
                        sizes="112px"
                        className="object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      />
                      {/* flip mobile */}
                      <button
                        type="button"
                        className="md:hidden absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] text-white ring-1 ring-white/20"
                        onClick={(e) => {
                          e.preventDefault();
                          const wrapper = e.currentTarget.parentElement;
                          const imgsEl = wrapper?.querySelectorAll('img');
                          if (imgsEl && imgsEl.length >= 2) {
                            imgsEl[0].classList.toggle('opacity-0');
                            imgsEl[0].classList.toggle('opacity-100');
                            imgsEl[1].classList.toggle('opacity-0');
                            imgsEl[1].classList.toggle('opacity-100');
                          }
                        }}
                        aria-label="Mostra fronte/retro"
                        title="Mostra fronte/retro"
                      >
                        ↺
                      </button>
                    </div>

                    {/* DETTAGLI */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <h2 className="text-sm font-medium truncate">{it.title}</h2>
                        <button
                          onClick={() => remove(k)}
                          className="text-xs text-white/60 hover:text-white shrink-0"
                          title="Rimuovi"
                        >
                          🗑
                        </button>
                      </div>

                      <p className="text-xs text-white/60 mt-1">
                        {it.variant} {it.size ? `• Taglia ${it.size}` : ''}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dec(k)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                            aria-label="Diminuisci quantità"
                          >
                            –
                          </button>
                          <span className="w-8 text-center text-sm">{it.qty}</span>
                          <button
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

            <div className="flex justify-between items-center p-4 border-t border-white/10">
              <button
                onClick={clear}
                className="text-xs tracking-widest uppercase text-white/70 hover:text-white"
              >
                Svuota carrello
              </button>
              <span className="text-sm">
                Subtotale: <b>{formatEUR(subtotal)}</b>
              </span>
            </div>
          </div>

          {/* RIEPILOGO */}
          <aside className="h-max border border-white/10 rounded-2xl bg-black/50 p-6">
            <h3 className="text-[12px] uppercase tracking-[0.2em] text-white/80">Riepilogo</h3>
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
              <span className="text-white font-semibold uppercase text-sm">Totale</span>
              <span className="text-white font-semibold">{formatEUR(subtotal)}</span>
            </div>

            <p className="mt-2 text-xs text-white/70">
              o 3 rate da <b>{formatEUR(subtotal / 3)}</b> senza interessi con Scalapay
            </p>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-black hover:bg-neutral-200"
              >
                Completa ordine
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-white/60">
              Potrai inserire il codice sconto nel passaggio successivo.
            </p>
          </aside>
        </div>
      )}

      {/* FOOTER PAGINA — PAGAMENTI & NEWSLETTER */}
      <footer className="mt-16 border-t border-white/10 pt-10 text-sm text-white/60">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-white/80">Informazioni</h4>
            <ul className="mt-3 space-y-1 text-white/70">
              <li>FAQ</li>
              <li>Privacy</li>
              <li>Termini e condizioni</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-white/80">Supporto</h4>
            <ul className="mt-3 space-y-1 text-white/70">
              <li>Spedizioni</li>
              <li>Pagamenti</li>
              <li>Resi e rimborsi</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-white/80">Resta aggiornato</h4>
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="email"
                placeholder="Inserisci la tua email"
                className="rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:ring-white/20 focus:outline-none"
              />
              <button className="rounded-md bg-white text-black text-sm font-semibold py-2 hover:bg-neutral-200 transition">
                Iscriviti
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-white/80">Metodi di pagamento</h4>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <PaymentIcon name="apple-pay" alt="Apple Pay" />
              <PaymentIcon name="google-pay" alt="Google Pay" />
              <PaymentIcon name="paypal" alt="PayPal" />
              <PaymentIcon name="visa" alt="Visa" />
              <PaymentIcon name="mastercard" alt="Mastercard" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} Lagoon Rebel Wear — All rights reserved. · Venezia, Italia
        </p>
      </footer>
    </main>
  );
}
