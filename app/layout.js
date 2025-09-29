import './globals.css';

export const metadata = {
  title: 'Lagoon Rebel Wear',
  description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  openGraph: {
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    url: 'https://www.lagoonrebelwear.com',
    siteName: 'Lagoon Rebel Wear',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Lagoon Rebel Wear',
      },
    ],
    locale: 'it_IT',
    type: 'website',
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
      <body>{children}</body>
    </html>
  );
}
