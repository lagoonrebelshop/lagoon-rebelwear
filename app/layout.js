export const metadata = {
  metadataBase: new URL('https://www.lagoonrebelwear.com'),
  title: {
    default: 'Lagoon Rebel Wear — Streetwear nato a Venezia',
    template: '%s — Lagoon Rebel Wear',
  },
  description: 'Zoomania — Hyppopothesis. Streetwear ribelle, autentico, libero. Progettato a Venezia.',
  applicationName: 'Lagoon Rebel Wear',
  themeColor: '#111827',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://www.lagoonrebelwear.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.lagoonrebelwear.com',
    title: 'Lagoon Rebel Wear — Streetwear nato a Venezia',
    description: 'Zoomania — Hyppopothesis. Streetwear ribelle, autentico, libero.',
    images: [
      { url: '/zoomania-hyppopothesis-hoodie-front.png', width: 1200, height: 630, alt: 'Lagoon Rebel Wear' },
    ],
    locale: 'it_IT',
    siteName: 'Lagoon Rebel Wear',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagoon Rebel Wear — Streetwear nato a Venezia',
    description: 'Zoomania — Hyppopothesis. Streetwear ribelle, autentico, libero.',
    images: ['/zoomania-hyppopothesis-hoodie-front.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-black">{children}</body>
    </html>
  );
}
