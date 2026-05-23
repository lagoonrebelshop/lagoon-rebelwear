// app/page.js
'use client';

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
    <a href={href} className="group inline-flex flex-col items-start relative overflow-hidden">
      <span className="h-px w-40 bg-white/70 group-hover:bg-white transition-colors" />
      <span className="mt-3 mb-3 tracking-[0.25em] text-sm font-semibold text-white/95 group-hover:text-white relative">
        <span className="relative">{label}</span>
      </span>
      <span className="h-px w-40 bg-white/70 group-hover:bg-white transition-colors" />
    </a>
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
    'h-10 rounded-md border px-3 text-xs font-semibold transition flex items-center justify-center gap-2';

  if (active) {
    return `${base} border-white bg-white text-black`;
  }

  if (colorSlug === 'white') {
    return `${base} border-white/20 bg-white text-black hover:border-white`;
  }

  return `${base} border-white/15 bg-black text-white/80 hover:border-white/40 hover:bg-white/10`;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState({}); // { styleId: 1|2 }
  const [selectedSizes, setSelectedSizes] = useState({}); // { productId: size }
  const [selectedStyleIds, setSelectedStyleIds] = useState({}); // { productId: styleId }

  const ASSET_V = '20260215';

  // Per ora sappiamo che il retro è presente sulla hoodie.
  // Tee: solo fronte. Hoodie: fronte + retro.
  // Più avanti lo renderemo data-driven tramite product_images.
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
      <main className="relative w-full overflow-hidden bg-neutral-900">
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
          <div className="absolute inset-0 z-10 bg-black/35" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

          {/* TESTI SOPRA IL VIDEO */}
          <div className="relative z-20 flex h-full w-full items-end">
            <div className="mx-auto w-full max-w-6xl px-6 pb-14 md:pb-20">
              <p className="mb-3 text-xs tracking-[0.32em] text-white/75 md:text-sm">
                DROP 01 • FOUNDATION • VENEZIA
              </p>

              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-7xl">
                Lagoon Rebel Wear
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/88 md:text-lg">
                Streetwear nato a Venezia. Minimal. Strutturato. Intenzionale.
              </p>

              <div className="mt-9">
                <CtaScopri />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SHOP */}
      <section id="shop" className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Drop 01 — Foundation
            </h2>
            <p className="text-white/70 mt-3">
              Black essentials with Foundation Purple embroidery.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 flex flex-col"
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
                  <div className="relative aspect-[4/5] w-full bg-black overflow-hidden">
                    <img
                      src={imgFront}
                      alt={`${p.name} - ${colorLabel} - Front`}
                      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                        hasBack ? (which === 1 ? 'opacity-100' : 'opacity-0') : 'opacity-100'
                      }`}
                      loading="lazy"
                      draggable="false"
                    />

                    {imgBack && (
                      <img
                        src={imgBack}
                        alt={`${p.name} - ${colorLabel} - Back`}
                        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                          which === 2 ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                        draggable="false"
                      />
                    )}

                    <span className="absolute left-3 top-3 text-[11px] font-semibold bg-white text-black px-2 py-1 rounded-full">
                      Foundation
                    </span>
                  </div>

                  <div
                    className="border-t border-white/10 bg-black/70 px-4 py-3 flex flex-col gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{p.name}</h3>
                        <p className="text-white/70 text-sm truncate">
                          {variantLabel}
                        </p>
                      </div>
                      <span className="font-semibold shrink-0">
                        {priceLabel}
                      </span>
                    </div>

                    {showColorSelector && (
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                            Colore
                          </p>
                          <p className="text-[11px] text-white/50 text-right">
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
                                <span
                                  className={[
                                    'h-3 w-3 rounded-full border',
                                    style.color_slug === 'white'
                                      ? 'bg-white border-black/30'
                                      : 'bg-black border-white/30',
                                  ].join(' ')}
                                />
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                          Taglia
                        </p>
                        <p className="text-[11px] text-white/50 text-right">
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
                                'h-10 rounded-md border text-xs font-semibold transition',
                                active
                                  ? 'border-white bg-white text-black'
                                  : 'border-white/15 bg-white/[0.03] text-white/75 hover:border-white/40 hover:bg-white/10',
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