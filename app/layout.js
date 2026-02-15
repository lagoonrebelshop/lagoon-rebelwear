import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import TrustBarSlim from '@/components/TrustBarSlim'
import { AuthProvider } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-server'

const inter = Inter({ subsets: ['latin'] })

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
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=20251007', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=20251007', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=20251007', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon-legacy.ico?v=20251007'],
  },
  manifest: '/manifest.webmanifest',
}

export default async function RootLayout({ children }) {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error fetching session in layout:', error)
  }

  const user = session?.user ?? null

  return (
    <html lang="it">
      <body className={`${inter.className} bg-neutral-900 text-white`}>
        <AuthProvider initialSession={session} initialUser={user}>
          <Navbar />
          <div className="pt-24 md:pt-28 lg:pt-32">{children}</div>
          <TrustBarSlim />
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  )
}
