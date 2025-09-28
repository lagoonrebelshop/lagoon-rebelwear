import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'Lagoon Rebel Wear — Streetwear nato a Venezia',
  description: 'Zoomania, drop ribelli e cultura lagunare.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-neutral-900 text-white">
        {/* Navbar fissa in alto */}
        <Navbar />

        {/* Spazio per non coprire l’hero */}
       <div className="pt-24 md:pt-28 lg:pt-32">
          {children}
        </div>

        {/* Footer in fondo a tutte le pagine */}
        <Footer />

        {/* Banner cookie */}
        <CookieBanner />
      </body>
    </html>
  );
}
