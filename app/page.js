// app/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/lib/supabase-client';

// Animazioni
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

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
  if (!base) return '';
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Toggle mobile (tap) + stato immagine per prodotto: 1 = front, 2 = back
  const [activeImg, setActiveImg] = useState({}); // { [productId]: 1|2 }

  // ✅ Cache-busting semplice: cambia valore quando fai replace delle immagini
  const ASSET_V = '20260215';

  // slug che hanno sicuramente la 02.png (per ora: solo hoodie)
  const hasBackBySlug = useMemo(() => new Set(['foundation-hoodie']), []);

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, price_cents, images_folder, category, color_name, status, created_at')
        .in('status', ['coming_soon', 'live'])
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
      <main className="relative h-[100svh] w-full overflow-hidden bg-neutral-900">
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Gondole01.mp4" type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-end max-w-6xl mx-auto px-6 pb-16">
          <div>
            <p className="text-white/70 text-xs tracking-[0.25em] mb-3">
              DROP 01 • FOUNDATION • VENEZIA
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-bold">
              Lagoon Rebel Wear
            </h1>
            <p className="mt-3 text-white/90 max-w-xl">
              Streetwear nato a Venezia. Minimal. Strutturato. Intenzionale.
            </p>
            <div className="mt-8">
              <CtaScopri />
            </div>
          </div>
        </div>
      </main>

      {/* SHOP */}
      <section id="shop" className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Drop 01 — Foundation
            </h2>
            <p className="text-white/70 mt-3">
              <span className="font-semibold text-white">COLOR:</span> Foundation Purple
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="text-white/70">
                Caricamento prodotti…
              </div>
            )}

            {!loading && products.map((p) => {
              const hasBack = hasBackBySlug.has(p.slug);
              const which = activeImg[p.id] || 1;

              const imgFront = storagePublicUrl(`${p.images_folder}/01.png?v=${ASSET_V}`);
              const imgBack = hasBack
                ? storagePublicUrl(`${p.images_folder}/02.png?v=${ASSET_V}`)
                : null;

              const priceLabel = formatEURFromCents(p.price_cents);

              return (
                <motion.div
                  key={p.id}
                  variants={cardIn}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl overflow-hidden bg-neutral-800/60 border border-white/10 flex flex-col"
                  // ✅ Desktop: hover mostra retro (se esiste)
                  onMouseEnter={() => {
                    if (!hasBack) return;
                    setActiveImg((prev) => ({ ...prev, [p.id]: 2 }));
                  }}
                  onMouseLeave={() => {
                    if (!hasBack) return;
                    setActiveImg((prev) => ({ ...prev, [p.id]: 1 }));
                  }}
                  // ✅ Mobile: tap alterna 01/02 (solo se esiste 02)
                  onClick={() => {
                    if (!hasBack) return;
                    setActiveImg((prev) => ({ ...prev, [p.id]: (prev[p.id] === 2 ? 1 : 2) }));
                  }}
                >
                  <div className="relative aspect-[4/5] w-full bg-black/20 overflow-hidden">
                    <div className="relative w-full h-full">
                      {/* FRONT */}
                      <img
                        src={imgFront}
                        alt={p.name}
                        className={`absolute inset-0 h-full w-full object-contain max-h-full max-w-full transition-opacity duration-300 ${
                          hasBack
                            ? (which === 1 ? 'opacity-100' : 'opacity-0')
                            : 'opacity-100'
                        }`}
                        loading="lazy"
                      />

                      {/* BACK (solo per hoodie) */}
                      {imgBack && (
                        <img
                          src={imgBack}
                          alt={p.name}
                          className={`absolute inset-0 h-full w-full object-contain max-h-full max-w-full transition-opacity duration-300 ${
                            which === 2 ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <span className="absolute left-3 top-3 text-[11px] font-semibold bg-white text-black px-2 py-1 rounded-full">
                      Foundation
                    </span>
                  </div>

                  <div className="border-t border-white/10 bg-black/60 px-4 py-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-white/70 text-sm">
                          Venezia • Lagoon Rebel Wear
                        </p>
                      </div>
                      <span className="font-semibold">
                        {priceLabel}
                      </span>
                    </div>

                    <AddToCartButton
                      id={p.slug}
                      title={p.name}
                      price={Number(p.price_cents || 0) / 100}
                      size={p.category === 'headwear' ? 'OS' : 'M'}
                      variant={p.color_name || '—'}
                      className="w-full"
                    >
                      Aggiungi al carrello
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
