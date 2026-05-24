'use client';

import Image from 'next/image';

function IconShell({ children }) {
  return (
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(143,92,255,0.30)] bg-[radial-gradient(circle_at_50%_35%,rgba(143,92,255,0.18),rgba(143,92,255,0.06)_55%,transparent_100%)] text-[var(--lrw-purple)] shadow-[0_0_20px_rgba(143,92,255,0.10)]">
      {children}
    </div>
  );
}

function ShippingLagoonIcon() {
  return (
    <IconShell>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="5" width="10" height="7" rx="1.5" />
        <path d="M12 5v7" />
        <path d="M5 16c1-.9 2-.9 3 0s2 .9 3 0 2-.9 3 0 2 .9 3 0 2-.9 3 0" />
        <path d="M6 19c1-.9 2-.9 3 0s2-.9 3 0 2 .9 3 0 2-.9 3 0" />
      </svg>
    </IconShell>
  );
}

function PremiumEmbroideryIcon() {
  return (
    <IconShell>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M15.5 5.5 18.5 8.5" />
        <path d="M6 18c2-1 3.5-1 5 0s3 1 5 0" />
        <path d="M8 14.5c.7.7 1.6 1.1 2.6 1.1" />
      </svg>
    </IconShell>
  );
}

function SecureVeniceIcon() {
  return (
    <IconShell>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3 18 5.5v5.3c0 4.2-2.4 7.4-6 9.2-3.6-1.8-6-5-6-9.2V5.5L12 3Z" />
        <path d="M9 12.5c0-1.8 1.3-3 3-3s3 1.2 3 3" />
        <path d="M9 12.5h6" />
      </svg>
    </IconShell>
  );
}

export default function TrustBarSlim() {
  const payments = [
    { src: '/payments/visa.png', alt: 'Visa' },
    { src: '/payments/mastercard.png', alt: 'Mastercard' },
    { src: '/payments/paypal.png', alt: 'PayPal' },
    { src: '/payments/apple-pay.png', alt: 'Apple Pay' },
    { src: '/payments/google-pay.png', alt: 'Google Pay' },
  ];

  const perks = [
    { label: 'Spedizione tracciata', sub: 'Tracking incluso', icon: <ShippingLagoonIcon /> },
    { label: 'Ricamo premium', sub: 'Foundation Purple', icon: <PremiumEmbroideryIcon /> },
    { label: 'Pagamenti sicuri', sub: 'SSL checkout', icon: <SecureVeniceIcon /> },
  ];

  return (
    <section
      aria-label="Pagamenti e garanzie"
      className="relative overflow-hidden border-t border-[rgba(143,92,255,0.16)] bg-[linear-gradient(180deg,rgba(9,9,11,0.96),rgba(6,6,8,1))]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(143,92,255,0.5)] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,92,255,0.10),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
        <ul className="grid grid-cols-1 gap-5 text-center sm:grid-cols-3">
          {perks.map((p) => (
            <li
              key={p.label}
              className="rounded-2xl border border-[rgba(143,92,255,0.14)] bg-[rgba(255,255,255,0.02)] px-5 py-6 shadow-[0_12px_34px_rgba(0,0,0,0.24)]"
            >
              {p.icon}
              <p className="text-sm font-semibold tracking-[0.04em] text-white">
                {p.label}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--lrw-purple)]">
                {p.sub}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(143,92,255,0.28),transparent)]" />

        <div className="mt-8">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.28em] text-[var(--lrw-purple)]">
            Metodi di pagamento accettati
          </p>

          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-7 gap-y-4">
            {payments.map(({ src, alt }) => (
              <div
                key={src}
                className="flex h-8 items-center justify-center opacity-90 transition hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(143,92,255,0.22)]"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={66}
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