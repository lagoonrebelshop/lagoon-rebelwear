'use client';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* menu (placeholder) */}
        <button aria-label="Menu" className="text-white/80 hover:text-white">☰</button>

        {/* logo centrato — più grande + invert per far risaltare il nero su sfondo scuro */}
        <a href="/" className="inline-flex items-center">
          <img
  src="/logo.png"
  alt="Lagoon Rebel Wear"
  className="h-16 md:h-20 lg:h-24 w-auto invert drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-transform duration-300 hover:scale-105"
/>

        </a>

        {/* link destra */}
        <div className="hidden md:flex items-center gap-6 text-xs tracking-[0.2em] text-white/80">
          <a href="/search" className="hover:text-white">CERCA</a>
          <a href="/login"  className="hover:text-white">ACCEDI</a>
          <a href="/cart"   className="hover:text-white">CARRELLO [0]</a>
        </div>
      </div>
    </nav>
  );
}
