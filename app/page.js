// app/page.js
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/lib/supabase-client';

// Animazioni
const cardIn = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

function CtaScopri({ href = '#shop', label = 'SCOPRI DROP 01' }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 rounded-full border border-[rgba(143,92,255,0.42)] bg-[rgba(143,92,255,0.10)] px-5 py-3 text-xs font-bold tracking-[0.24em] text-[var(--lrw-purple)] transition hover:border-[rgba(143,92,255,0.85)] hover:bg-[rgba(143,92,255,0.18)] hover:shadow-[0_0_26px_rgba(143,92,255,0.18)]"
    >
      <span>{label}</span>
      <span className="text-base leading-none transition-transform group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function VenetianLagoonDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-12 z-10 mx-auto hidden h-28 max-w-5xl px-6 md:block"
    >
      <svg
        viewBox="0 0 1000 150"
        className="h-full w-full overflow-visible opacity-75"
        fill="none"
      >
        {/* linea d'acqua principale */}
        <path
          d="M20 78 C 115 46, 205 46, 305 78 S 500 110, 610 78 S 805 46, 980 78"
          stroke="rgba(143,92,255,0.30)"
          strokeWidth="1.35"
          strokeLinecap="round"
        />

        {/* riflesso lagunare */}
        <path
          d="M95 93 C 185 68, 290 68, 380 93 S 560 118, 655 93 S 820 68, 940 93"
          stroke="rgba(245,242,236,0.11)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* palafitte / fondamenta sommerse */}
        {[
          [175, 70, 128],
          [215, 63, 134],
          [255, 72, 126],
          [690, 69, 132],
          [732, 61, 138],
          [774, 72, 128],
          [500, 58, 142],
        ].map(([x, y1, y2]) => (
          <path
            key={`${x}-${y1}-${y2}`}
            d={`M${x} ${y1} L${x} ${y2}`}
            stroke="rgba(245,242,236,0.13)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        {/* pali viola quasi invisibili */}
        {[
          [195, 76, 126],
          [235, 72, 130],
          [712, 75, 128],
          [752, 70, 134],
        ].map(([x, y1, y2]) => (
          <path
            key={`purple-${x}-${y1}-${y2}`}
            d={`M${x} ${y1} L${x} ${y2}`}
            stroke="rgba(143,92,255,0.20)"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        ))}

        {/* piccola arcata centrale, richiamo architettonico veneziano */}
        <path
          d="M455 57 C 472 34, 528 34, 545 57"
          stroke="rgba(143,92,255,0.18)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />

        {/* base sommersa */}
        <path
          d="M150 132 H285"
          stroke="rgba(245,242,236,0.08)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M680 134 H800"
          stroke="rgba(245,242,236,0.08)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function FoundationTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-20 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(143,92,255,0.10),transparent_62%)] opacity-80" />

      <svg
        viewBox="0 0 1200 520"
        className="absolute left-1/2 top-28 hidden h-[520px] w-[1200px] -translate-x-1/2 opacity-[0.18] md:block"
        fill="none"
      >
        {/* acqua */}
        <path
          d="M120 190 C 230 150, 330 150, 440 190 S 655 230, 770 190 S 980 150, 1090 190"
          stroke="rgba(245,242,236,0.20)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M160 224 C 255 198, 345 198, 440 224 S 625 250, 720 224 S 890 198, 1040 224"
          stroke="rgba(143,92,255,0.28)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* palafitte */}
        {[
          [230, 165, 410],
          [275, 180, 430],
          [320, 156, 405],
          [365, 176, 430],
          [835, 162, 415],
          [880, 178, 432],
          [925, 154, 405],
          [970, 176, 428],
          [590, 150, 442],
          [630, 170, 420],
        ].map(([x, y1, y2]) => (
          <path
            key={`${x}-${y1}-${y2}`}
            d={`M${x} ${y1} L${x} ${y2}`}
            stroke="rgba(245,242,236,0.18)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        {/* base strutturale */}
        <path
          d="M190 407 H405"
          stroke="rgba(143,92,255,0.22)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M805 410 H1005"
          stroke="rgba(143,92,255,0.22)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

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

function getSizeHelper(category) {
  if (category === 'headwear') return 'Taglia unica regolabile';
  return 'Seleziona la tua taglia';
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

function getColorButtonClass(colorSlug, active) {
  const base =
    'h-10 rounded-lg border px-3 text-xs font-bold transition flex items-center justify-center';

  if (active) {
    return `${base} border-[rgba(143,92,255,0.88)] bg-[rgba(143,92,255,0.18)] text-white shadow-[0_0_20px_rgba(143,92,255,0.18)]`;
  }

  if (colorSlug === 'white') {
    return `${base} border-white/25 bg-white text-black hover:border-[rgba(143,92,255,0.75)] hover:shadow-[0_0_16px_rgba(143,92,255,0.14)]`;
  }

  return `${base} border-white/15 bg-black text-white/82 hover:border-[rgba(143,92,255,0.58)] hover:bg-[rgba(143,92,255,0.10)]`;
}

export default function Home() {
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

  return (
    <>
      {/* HERO */}
      <main className="relative w-full overflow-hidden bg-neutral-950">
        <section className="relative h-[calc(100svh-var(--nav-h))] min-h-[560px] w-full overflow-hidden bg-black md:min-h-[680px]">
          {/* VIDEO */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 z-0 h-full !h-full w-full object-cover"
          >
            <source src="/Gondole01.mp4" type="video/mp4" />
          </video>

          {/* OVERLAY CINEMATICO */}
          <div className="absolute inset-0 z-10 bg-black/45" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_35%_35%,rgba(143,92,255,0.18),transparent_34%)]" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/55 to-black/20" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

          {/* DETTAGLIO EDITORIALE */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.65)] to-transparent" />

          {/* TESTI SOPRA IL VIDEO */}
          <div className="relative z-20 flex h-full w-full items-end">
            <div className="mx-auto w-full max-w-6xl px-6 pb-14 md:pb-20">
              <p className="lrw-eyebrow mb-4">
                DROP 01 • FOUNDATION • VENEZIA
              </p>

              <h1 className="lrw-title max-w-3xl text-[3rem] text-[var(--lrw-white)] sm:text-[3.45rem] md:text-[5.6rem]">
                Lagoon Rebel Wear
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/82 md:text-lg">
                Streetwear nato a Venezia. Minimal. Strutturato. Intenzionale.
              </p>

              <div className="mt-9 flex flex-col items-start gap-5">
                <CtaScopri />

                <div className="flex items-center gap-3 text-[var(--lrw-purple)]/80">
                  <span className="h-px w-12 bg-[rgba(143,92,255,0.65)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.34em]">
                    Nato in laguna
                  </span>
                  <span className="h-px w-12 bg-[rgba(143,92,255,0.65)]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SHOP */}
      <section id="shop" className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white">
        <VenetianLagoonDivider />
        <FoundationTexture />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.45)] to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,92,255,0.10),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/35 to-transparent" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="lrw-eyebrow mb-4">
              DROP 01 • FOUNDATION
            </p>

            <h2 className="lrw-section-title text-5xl text-[var(--lrw-white)] md:text-6xl">
              Foundation
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/66 md:text-base">
              Capi essenziali in black & white, rifiniti dal ricamo Foundation Purple.
              Il primo capitolo Lagoon Rebel: nato a Venezia, costruito su fondamenta invisibili ma necessarie.
            </p>

            <div className="mx-auto mt-7 flex w-full max-w-md items-center justify-center gap-3 text-[var(--lrw-purple)]/75">
              <span className="h-px flex-1 bg-[rgba(143,92,255,0.45)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.34em]">
                Fondamenta veneziane
              </span>
              <span className="h-px flex-1 bg-[rgba(143,92,255,0.45)]" />
            </div>

            <div
              aria-hidden="true"
              className="mx-auto mt-5 flex max-w-xs items-end justify-center gap-2 opacity-55"
            >
              <span className="h-5 w-px bg-white/16" />
              <span className="h-8 w-px bg-[rgba(143,92,255,0.34)]" />
              <span className="h-4 w-px bg-white/12" />
              <span className="h-10 w-px bg-white/18" />
              <span className="h-6 w-px bg-[rgba(143,92,255,0.24)]" />
              <span className="h-9 w-px bg-white/14" />
              <span className="h-5 w-px bg-white/12" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="text-white/70">
                Caricamento prodotti…
              </div>
            )}

            {!loading && products.map((p) => {
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
              const sizeHelper = getSizeHelper(p.category);

              const showColorSelector = visibleStyles.length > 1;

              return (
                <motion.div
                  key={p.id}
                  variants={cardIn}
                  whileHover={{ y: -4 }}
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
                    <Image
                      src={imgFront}
                      alt={`${p.name} - ${colorLabel} - Front`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={`object-contain transition-opacity duration-300 ${
                        hasBack ? (which === 1 ? 'opacity-100' : 'opacity-0') : 'opacity-100'
                      }`}
                      loading="lazy"
                      draggable="false"
                    />

                    {imgBack && (
                      <Image
                        src={imgBack}
                        alt={`${p.name} - ${colorLabel} - Back`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className={`object-contain transition-opacity duration-300 ${
                          which === 2 ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        draggable="false"
                      />
                    )}

                    <span className="absolute left-3 top-3 rounded-full border border-[rgba(143,92,255,0.38)] bg-[rgba(10,10,10,0.72)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lrw-purple)] backdrop-blur">
                      Foundation
                    </span>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div
                    className="flex flex-col gap-4 border-t border-[rgba(143,92,255,0.16)] bg-black/78 px-4 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-editorial truncate text-[1.35rem] leading-none text-[var(--lrw-white)]">
                          {p.name}
                        </h3>
                        <p className="mt-1 truncate text-xs font-medium text-white/58">
                          {variantLabel}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[var(--lrw-white)]">
                        {priceLabel}
                      </span>
                    </div>

                    {showColorSelector && (
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lrw-purple)]">
                            Colore
                          </p>
                          <p className="text-right text-[11px] text-white/50">
                            {colorLabel}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {visibleStyles.map((style) => {
                            const active = selectedStyle?.id === style.id;
                            const label = style.color_name || style.name || 'Style';

                            return (
                              <button
                                key={style.id}
                                type="button"
                                onClick={() => {
                                  setSelectedStyleIds((prev) => ({
                                    ...prev,
                                    [p.id]: style.id,
                                  }));

                                  setActiveImg((prev) => ({
                                    ...prev,
                                    [style.id]: 1,
                                  }));
                                }}
                                className={getColorButtonClass(style.color_slug, active)}
                                aria-pressed={active}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--lrw-purple)]">
                          Taglia
                        </p>
                        <p className="text-right text-[11px] text-white/50">
                          {selectedSize ? `Selezionata: ${selectedSize}` : sizeHelper}
                        </p>
                      </div>

                      <div className={isOneSize ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-3 gap-2'}>
                        {sizeOptions.map((size) => {
                          const active = selectedSize === size;

                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => {
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}