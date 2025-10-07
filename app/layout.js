// app/layout.js
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  title: {
    default: 'Lagoon Rebel Wear',
    template: '%s | Lagoon Rebel Wear',
  },
  description:
    'Streetwear veneziano ribelle: design originali, identità forte, qualità che dura.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Lagoon Rebel Wear',
    description:
      'Streetwear veneziano ribelle: design originali, identità forte, qualità che dura.',
    url: 'https://www.lagoonrebelwear.com',
    siteName: 'Lagoon Rebel Wear',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Lagoon Rebel Wear — streetwear veneziano ribelle',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagoon Rebel Wear',
    description:
      'Streetwear veneziano ribelle: design originali, identità forte, qualità che dura.',
    images: ['/og.jpg'],
    creator: '@lagoonrebelwear',
  },
  // Icone + cache-busting versione
  icons: {
    icon: [
      // Solo PNG versionati (niente ICO qui per evitare il tag auto-iniettato non versionato)
      { url: '/favicon-32x32.png?v=20251007', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=20251007', sizes: '16x16', type: 'image/png' },
    ],
    // Apple touch
    apple: [{ url: '/apple-touch-icon.png?v=20251007', sizes: '180x180', type: 'image/png' }],
    // Shortcut: usa l'ICO rinominato (non /favicon.ico) + versione
    shortcut: ['/favicon-legacy.ico?v=20251007'],
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-neutral-900 text-white">
        {/* Navbar fissa */}
        <Navbar />

        {/* Spazio per non coprire l’hero: regola se cambi l’altezza della navbar */}
        <div className="pt-24 md:pt-28 lg:pt-32">{children}</div>

        {/* Footer sempre in fondo */}
        <Footer />

        {/* Banner cookie */}
        <CookieBanner />
      </body>
    </html>
  );
}
