// app/page.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

// Animazioni
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const cardIn = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// CTA
function CtaScopri({ href = '#shop', label = 'SCOPRI ZOOMANIA' }) {
  return (
    <a href={href} className="group inline-flex flex-col items-start relative overflow-hidden">
      <span className="h-px w-40 bg-white/70 group-hover:bg-white transition-colors" />
      <span className="mt-3 mb-3 tracking-[0.25em] text-sm font-semibold text-white/95 group-hover:text-white relative">
        <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-white/10" />
        <span className="relative">{label}</span>
      </span>
      <span className="h-px w-40 bg-white/70 group-hover:bg-white transition-colors" />
    </a>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <main
        className="relative w-full overflow-hidden bg-neutral-900 pt-[64px] md:pt-[80px]"
        style={{ height: '100dvh' }} // viewport affidabile su iOS
      >
        {/* Video fullscreen */}
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
        >
          <source src="/Gondole01.mp4" type="video/mp4" />
        </motion.video>

        {/* Overlay per contrasto */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* CONTENUTO HERO — assoluto SOPRA al video, ancorato al fondo */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)', // niente spazio nero
          }}
        >
          <div className="mx-auto max-w-6xl w-full px-6 pb-4 md:pb-10">
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[11px] md:text-xs tracking-[0.25em] text-white/70"
            >
              FALL / WINTER 2025 • VENEZIA
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white"
            >
              Lagoon Rebel Wear
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-xl text-base md:text-lg text-white/90"
            >
              Streetwear nato a Venezia. Ribelle, autentico, libero.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <CtaScopri href="#shop" label="SCOPRI ZOOMANIA" />
            </motion.div>
          </div>
        </motion.div>

        {/* Indicatore scroll */}
        <motion.div
          className="absolute left-1/2 z-10 -translate-x-1/2 bottom-2 md:bottom-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
        >
          <span className="block text-center text-xs tracking-[0.25em] text-white/70">SCORRI</span>
          <div className="mx-auto mt-1 h-5 w-px animate-pulse bg-white/60" />
        </motion.div>
      </main>

      {/* SEZIONE SHOP */}
      <section id="shop" className="bg-neutral-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold">
              Collezione Ribelle
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-white/70">
              <span className="font-semibold text-white">NEW:</span> Zoomania — Hyppopothesis
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {/* CARD: Tee */}
            <motion.div
              variants={cardIn}
              whileHover={{ y: -4 }}
              className="group rounded-2xl overflow-hidden bg-neutral-800/60 border border-white/10 flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/zoomania-hyppopothesis-front.png"
                  alt="Hyppopothesis Tee - Front"
                  fill
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                <Image
                  src="/zoomania-hyppopothesis-back.png"
                  alt="Hyppopothesis Tee - Back"
                  fill
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
                <span className="absolute left-3 top-3 text-[11px] font-semibold tracking-wide bg-white text-black px-2 py-1 rounded-full">
                  Zoomania
                </span>
              </div>
              <div className="border-t border-white/10 bg-black/60 px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">Hyppopothesis — Tee</h3>
                    <p className="text-white/70 text-sm truncate">Venezia • Rebel Wear Series</p>
                  </div>
                  <span className="text-white/90 font-semibold whitespace-nowrap">€29,00</span>
                </div>
                <AddToCartButton
                  id="tee-lr-nero"
                  title="Hyppopothesis — Tee"
                  price={29}
                  size="M"
                  variant="Nero"
                  className="w-full"
                >
                  Aggiungi al carrello
                </AddToCartButton>
              </div>
            </motion.div>

            {/* CARD: Hoodie */}
            <motion.div
              variants={cardIn}
              whileHover={{ y: -4 }}
              className="group rounded-2xl overflow-hidden bg-neutral-800/60 border border-white/10 flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/zoomania-hyppopothesis-hoodie-front.png"
                  alt="Hyppopothesis Hoodie - Front"
                  fill
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                <Image
                  src="/zoomania-hyppopothesis-hoodie-back.png"
                  alt="Hyppopothesis Hoodie - Back"
                  fill
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
                <span className="absolute left-3 top-3 text-[11px] font-semibold tracking-wide bg-white text-black px-2 py-1 rounded-full">
                  Zoomania
                </span>
              </div>
              <div className="border-t border-white/10 bg-black/60 px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">Hyppopothesis — Hoodie</h3>
                    <p className="text-white/70 text-sm truncate">Venezia • Rebel Wear Series</p>
                  </div>
                  <span className="text-white/90 font-semibold whitespace-nowrap">€59,00</span>
                </div>
                <AddToCartButton
                  id="hoodie-lr"
                  title="Hyppopothesis — Hoodie"
                  price={59}
                  size="L"
                  variant="Black"
                  className="w-full"
                >
                  Aggiungi al carrello
                </AddToCartButton>
              </div>
            </motion.div>

            {/* Placeholder */}
            <motion.div
              variants={cardIn}
              whileHover={{ y: -4 }}
              className="rounded-2xl overflow-hidden border border-white/10 bg-[#2A2A2A]"
            >
              <div className="aspect-[4/5] w-full bg-[#3A3A3A]" />
              <div className="border-t border-white/10 bg-black/60 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Prossimo Drop</h3>
                  <p className="text-white/70 text-sm">In arrivo…</p>
                </div>
                <span className="text-white/60 text-sm tracking-wide">—</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
