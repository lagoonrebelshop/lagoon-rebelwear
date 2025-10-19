'use client';

import Image from 'next/image';

export default function TrustBarSlim() {
  // ✅ nomi corretti per le icone che hai in /public/payments
  const payments = [
    { src: '/payments/visa.png', alt: 'Visa' },
    { src: '/payments/mastercard.png', alt: 'Mastercard' },
    { src: '/payments/paypal.png', alt: 'PayPal' },
    { src: '/payments/apple-pay.png', alt: 'Apple Pay' },
    { src: '/payments/google-pay.png', alt: 'Google Pay' },
  ];

  // piccole info di fiducia / vantaggi
  const perks = [
    { label: 'Spedizione rapida', sub: '24–48h' },
    { label: 'Reso facile', sub: '14 giorni' },
    { label: 'Pagamenti sicuri', sub: 'SSL' },
  ];

  return (
    <section aria-label="Pagamenti e garanzie"
      className="bg-neutral-900 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
        
        {/* Perks */}
        <ul className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          {perks.map((p) => (
            <li key={p.label} className="text-white/90">
              <p className="text-sm font-semibold tracking-wide">{p.label}</p>
              <p className="text-xs text-white/60 mt-1">{p.sub}</p>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-white/10" />

        {/* Metodi di pagamento */}
        <div className="mt-8">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-white/60 mb-4">
            Metodi di pagamento accettati
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {payments.map(({ src, alt }) => (
              <div key={src} className="h-6 sm:h-7 w-auto opacity-90 hover:opacity-100 transition-opacity">
                <Image
                  src={src}
                  alt={alt}
                  width={60}
                  height={30}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
