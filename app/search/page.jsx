'use client';

import { useEffect, useMemo, useState } from 'react';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/lib/supabase-client';

function formatEURFromCents(cents) {
  const value = Number(cents || 0) / 100;
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}

function storagePublicUrl(path) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return '';
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

function getSizeOptions(category) {
  if (category === 'headwear') return ['OS'];
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
}

function getVisibleStyles(product) {
  const styles = Array.isArray(product?.product_styles)
    ? product.product_styles
    : [];

  return styles
    .filter((style) => {
      const visible = style.visibility === 'public';
      const validStatus = ['coming_soon', 'live', 'sold_out'].includes(style.status);
      return visible && validStatus;
    })
    .sort((a, b) => {
      const orderA = Number(a.sort_order) || 0;
      const orderB = Number(b.sort_order) || 0;

      if (orderA !== orderB) return orderA - orderB;

      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    });
}

function getPrimaryStyle(product) {
  return getVisibleStyles(product)[0] || null;
}

export default function Page() {
  const [q, setQ] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedStyleIds, setSelectedStyleIds] = useState({});

  const ASSET_V = '20260215';

  const hasBackBySlug = useMemo(() => new Set(['foundation-hoodie']), []);

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          drop_id,
          name,
          slug,
          price_cents,
          base_price_cents,
          images_folder,
          category,
          color_name,
          status,
          visibility,
          created_at,
          product_styles (
            id,
            product_id,
            slug,
            name,
            color_name,
            color_slug,
            graphic_name,
            edition_type,
            price_cents,
            currency,
            status,
            visibility,
            images_folder,
            sort_order,
            created_at
          )
        `)
        .in('status', ['coming_soon', 'live'])
        .eq('visibility', 'public')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    })();
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) => {
      const styles = getVisibleStyles(product);

      const styleText = styles
        .map((style) =>
          [
            style.name,
            style.slug,
            style.color_name,
            style.color_slug,
            style.graphic_name,
            style.edition_type,
          ]
            .filter(Boolean)
            .join(' ')
        )
        .join(' ');

      const hay = [
        product.name,
        product.slug,
        product.category,
        product.color_name,
        product.status,
        styleText,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return hay.includes(term);
    });
  }, [q, products]);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
      <div>
        <p className="text-[12px] uppercase tracking-[0.24em] text-[#a78bfa]/80">
          Lagoon Rebel Wear
        </p>

        <h1 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white sm:text-5xl">
          Cerca
        </h1>

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8b5cf6] to-transparent" />

        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/60">
          Cerca tra i prodotti e le varianti reali Lagoon Rebel Wear. La selezione è ancora
          in fase di sviluppo e pre-lancio commerciale.
        </p>
      </div>

      <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#8b5cf6]/20 bg-black/40 p-5 shadow-[0_0_45px_rgba(139,92,246,0.06)] sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="grid min-w-0 gap-2 text-sm">
            <span className="text-white/70">Ricerca prodotto</span>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca prodotti, colori, categorie o varianti…"
              className="w-full rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#8b5cf6]/70 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.10)]"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#8b5cf6] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(139,92,246,0.20)] transition hover:bg-[#7c3aed] sm:w-auto"
            >
              Cerca
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/45">
          <p>
            {loading
              ? 'Caricamento prodotti…'
              : results.length === 1
                ? '1 prodotto trovato'
                : `${results.length} prodotti trovati`}
          </p>

          {q.trim() ? (
            <button
              type="button"
              onClick={() => setQ('')}
              className="uppercase tracking-[0.18em] text-white/50 transition hover:text-[#c4b5fd]"
            >
              Cancella ricerca
            </button>
          ) : (
            <p className="uppercase tracking-[0.18em] text-white/35">
              Catalogo Supabase
            </p>
          )}
        </div>
      </section>

      {loading ? (
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_45px_rgba(139,92,246,0.04)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/40 to-transparent" />

          <h2 className="text-lg font-medium text-white">
            Caricamento prodotti…
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Stiamo recuperando il catalogo reale.
          </p>
        </section>
      ) : results.length === 0 ? (
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_45px_rgba(139,92,246,0.04)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/40 to-transparent" />

          <h2 className="text-lg font-medium text-white">
            Nessun prodotto trovato.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
            Prova con un termine più generico oppure torna alla home per visualizzare
            i prodotti disponibili.
          </p>
        </section>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => {
            const visibleStyles = getVisibleStyles(p);
            const primaryStyle = getPrimaryStyle(p);
            const selectedStyle =
              visibleStyles.find((style) => style.id === selectedStyleIds[p.id]) ||
              primaryStyle;

            const styleKey = selectedStyle?.id || p.id;
            const hasBack = hasBackBySlug.has(p.slug);
            const which = activeImg[styleKey] || 1;

            const imagesFolder = selectedStyle?.images_folder || p.images_folder;
            const imgFront = imagesFolder
              ? storagePublicUrl(`${imagesFolder}/01.png?v=${ASSET_V}`)
              : '/og.jpg';
            const imgBack = hasBack && imagesFolder
              ? storagePublicUrl(`${imagesFolder}/02.png?v=${ASSET_V}`)
              : null;

            const priceCents = selectedStyle?.price_cents ?? p.base_price_cents ?? p.price_cents;
            const priceLabel = formatEURFromCents(priceCents);

            const colorLabel = selectedStyle?.color_name || p.color_name || '—';
            const graphicLabel = selectedStyle?.graphic_name || null;
            const variantLabel = graphicLabel ? `${colorLabel} • ${graphicLabel}` : colorLabel;

            const sizeOptions = getSizeOptions(p.category);
            const isOneSize = sizeOptions.length === 1;
            const selectedSize = isOneSize ? sizeOptions[0] : selectedSizes[p.id] || null;
            const canAddToCart = Boolean(selectedSize && selectedStyle);

            const showColorSelector = visibleStyles.length > 1;

            return (
              <li
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-[rgba(143,92,255,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] shadow-[0_18px_55px_rgba(0,0,0,0.42)] transition hover:border-[rgba(143,92,255,0.36)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
                onMouseEnter={() => {
                  if (!hasBack) return;
                  setActiveImg((prev) => ({ ...prev, [styleKey]: 2 }));
                }}
                onMouseLeave={() => {
                  if (!hasBack) return;
                  setActiveImg((prev) => ({ ...prev, [styleKey]: 1 }));
                }}
                onClick={() => {
                  if (!hasBack) return;
                  setActiveImg((prev) => ({
                    ...prev,
                    [styleKey]: prev[styleKey] === 2 ? 1 : 2,
                  }));
                }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(143,92,255,0.13),transparent_32%),#050505]">
                  <img
                    src={imgFront}
                    alt={`${p.name} - Front`}
                    className={[
                      'absolute inset-0 h-full w-full object-contain p-6 transition duration-500',
                      hasBack && which === 2 ? 'opacity-0 scale-[1.015]' : 'opacity-100 scale-100',
                    ].join(' ')}
                    loading="lazy"
                    draggable="false"
                  />

                  {imgBack && (
                    <img
                      src={imgBack}
                      alt={`${p.name} - Back`}
                      className={[
                        'absolute inset-0 h-full w-full object-contain p-6 transition duration-500',
                        which === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]',
                      ].join(' ')}
                      loading="lazy"
                      draggable="false"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/72 backdrop-blur">
                    {p.status === 'coming_soon' ? 'Coming soon' : 'Disponibile'}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a78bfa]/75">
                        {p.category === 'headwear' ? 'Headwear' : 'Apparel'}
                      </p>

                      <h2 className="mt-2 truncate font-serif text-2xl leading-none text-white">
                        {p.name}
                      </h2>

                      <p className="mt-2 text-sm text-white/55">
                        {variantLabel}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-white">
                      {priceLabel}
                    </p>
                  </div>

                  {showColorSelector && (
                    <div className="mt-5">
                      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                        Colore
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {visibleStyles.map((style) => {
                          const active = selectedStyle?.id === style.id;

                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedStyleIds((prev) => ({
                                  ...prev,
                                  [p.id]: style.id,
                                }));
                              }}
                              className={[
                                'h-10 rounded-lg border px-3 text-xs font-bold transition',
                                active
                                  ? 'border-[rgba(143,92,255,0.88)] bg-[rgba(143,92,255,0.18)] text-white shadow-[0_0_20px_rgba(143,92,255,0.16)]'
                                  : 'border-white/15 bg-white/[0.03] text-white/72 hover:border-[rgba(143,92,255,0.58)] hover:bg-[rgba(143,92,255,0.09)]',
                              ].join(' ')}
                              aria-pressed={active}
                            >
                              {style.color_name || style.name || 'Variante'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Taglia
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {sizeOptions.map((size) => {
                        const active = selectedSize === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [p.id]: size,
                              }));
                            }}
                            className={[
                              'h-10 rounded-lg border text-xs font-bold transition',
                              active
                                ? 'border-[rgba(143,92,255,0.88)] bg-[rgba(143,92,255,0.18)] text-white shadow-[0_0_20px_rgba(143,92,255,0.16)]'
                                : 'border-white/15 bg-white/[0.03] text-white/72 hover:border-[rgba(143,92,255,0.58)] hover:bg-[rgba(143,92,255,0.09)]',
                            ].join(' ')}
                            aria-pressed={active}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    {isOneSize && (
                      <p className="mt-2 text-[11px] text-white/45">
                        Taglia unica regolabile sul retro.
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <AddToCartButton
                      id={p.slug}
                      slug={p.slug}
                      title={p.name}
                      price={Number(priceCents || 0) / 100}
                      size={selectedSize}
                      variant={variantLabel}
                      category={p.category || null}
                      colorName={colorLabel}
                      imageFront={imgFront}
                      imageBack={imgBack}
                      disabled={!canAddToCart}
                      className="w-full"
                    >
                      {canAddToCart ? 'Aggiungi al carrello' : 'Seleziona una taglia'}
                    </AddToCartButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}