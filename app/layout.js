export const metadata = {
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  title: 'Lagoon Rebel Wear',
  description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: [{ url: '/Logo.png', width: 1200, height: 630, alt: 'Lagoon Rebel Wear' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagoon Rebel Wear',
    description: 'Streetwear nato a Venezia. Ribelle, autentico, libero.',
    images: ['/Logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

// ⚠️ Nessuna classe globale, nessun wrapper strano: solo children
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
