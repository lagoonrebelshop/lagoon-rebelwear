// app/checkout/page.jsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getCart } from '@/lib/cart';

function formatEUR(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value) || 0);
}

function normalizeCart(items) {
  return Array.isArray(items)
    ? items.map((it) => ({
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
}

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'Italia',
    notes: '',
  });

  useEffect(() => {
    setItems(normalizeCart(getCart()));
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [items]
  );

  const shippingLabel = 'Calcolata nel prossimo step';
  const total = subtotal;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.24em] text-white/50">
            Lagoon Rebel Wear
          </p>

          <h1 className="mt-2 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
            Checkout
          </h1>
        </div>

        <Link
          href="/cart"
          className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
        >
          Torna al carrello
        </Link>
      </div>

      <div className="mt-6 h-px bg-white/10" />

      {items.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-lg font-medium">Il tuo carrello è vuoto.</h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Per procedere al checkout devi prima aggiungere almeno un prodotto al carrello.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-white/90"
            >
              Torna allo shop
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-md border border-white/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Cerca prodotti
            </Link>
          </div>
        </section>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-7">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                Dati cliente
              </p>

              <h2 className="mt-2 text-xl font-medium text-white">
                Informazioni di contatto e spedizione
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Questa è la prima base del checkout. Nel prossimo step collegheremo il pagamento reale e il salvataggio ordine.
              </p>
            </div>

            <form className="mt-7 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Nome</span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="Nome"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Cognome</span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="Cognome"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="email@esempio.it"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Telefono</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="+39"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="text-white/70">Indirizzo</span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                  placeholder="Via, numero civico"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_150px_120px]">
                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Città</span>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="Città"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">CAP</span>
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="00000"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-white/70">Provincia</span>
                  <input
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                    placeholder="VE"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="text-white/70">Paese</span>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  autoComplete="country-name"
                  className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                  placeholder="Italia"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-white/70">Note ordine</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  className="resize-none rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/60 focus:bg-white/[0.06]"
                  placeholder="Eventuali indicazioni per la consegna"
                />
              </label>

              <button
                type="button"
                disabled
                className="mt-3 inline-flex w-full cursor-not-allowed items-center justify-center rounded-md bg-white/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-black"
                title="Pagamento non ancora collegato"
              >
                Procedi al pagamento — prossimo step
              </button>

              <p className="text-xs leading-5 text-white/45">
                Bottone disattivato intenzionalmente: prima validiamo layout, dati e riepilogo. Poi colleghiamo Stripe Checkout.
              </p>
            </form>
          </section>

          <aside className="h-max rounded-2xl border border-white/10 bg-black/50 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Riepilogo ordine
            </p>

            <div className="mt-4 space-y-4">
              {items.map((it) => {
                const lineTotal = (Number(it.price) || 0) * (Number(it.qty) || 0);

                return (
                  <div
                    key={`${it.id}__${it.size ?? ''}__${it.variant ?? ''}`}
                    className="flex gap-3 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
                      <img
                        src={it.imageFront || '/og.jpg'}
                        alt={it.title}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        draggable="false"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <h3 className="truncate text-sm font-medium text-white">
                          {it.title}
                        </h3>

                        <span className="shrink-0 text-sm text-white">
                          {formatEUR(lineTotal)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-white/55">
                        {it.variant || it.colorName || 'Variante non specificata'}
                        {it.size ? ` • Taglia ${it.size}` : ''}
                      </p>

                      <p className="mt-1 text-xs text-white/45">
                        Quantità: {it.qty}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 h-px bg-white/10" />

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Subtotale</dt>
                <dd className="text-white">{formatEUR(subtotal)}</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Spedizione</dt>
                <dd className="text-right text-white/55">{shippingLabel}</dd>
              </div>
            </dl>

            <div className="mt-5 h-px bg-white/10" />

            <div className="mt-4 flex justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-white">
                Totale
              </span>

              <span className="font-semibold text-white">
                {formatEUR(total)}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-white/50">
              I costi di spedizione e il pagamento reale verranno gestiti nel collegamento Stripe.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
