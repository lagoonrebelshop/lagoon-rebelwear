// app/layout.js
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  title: {
    default: 'Lagoon Rebel Wear',
    template: '%s | Lagoon Rebel Wear',
  },
  description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Lagoon Rebel Wear' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: ['/og.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-neutral-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
