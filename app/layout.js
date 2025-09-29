// app/layout.js
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  title: {
    default: 'Lagoon Rebel Wear',
    template: '%s · Lagoon Rebel Wear',
  },
  description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: '/',
    siteName: 'Lagoon Rebel Wear',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Lagoon Rebel Wear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: ['/Logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
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
