'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

function CartBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black px-1">
      {count}
    </span>
  );
}

// icone SVG inline (nessuna dipendenza esterna)
const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
  </svg>
);
const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.49 21.49 20 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
const IconCart = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14h9.66c.75 0 1.4-.41 1.73-1.03l3.27-6.14A1 1 0 0021 5H6.21l-.94-2H2v2h2l3.6 7.59L6.25 15A2 2 0 008 18h12v-2H8l1.1-2z"/>
  </svg>
);

export default function Navbar() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const readCartCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('lr_cart');
      const arr = raw ? JSON.parse(raw) : [];
      setCartCount(Array.isArray(arr) ? arr.reduce((n, it) => n + (Number(it.qty) || 0), 0) : 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    readCartCount();
    const onStorage = (e) => {
      if (e.key === 'lr_cart') readCartCount();
    };
    const onCustom = () => readCartCount();
    window.addEventListener('storage', onStorage);
    window.addEventListener('lr_cart_updated', onCustom);

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('lr_cart_updated', onCustom);
    };
  }, [readCartCount]);

  const onLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setMobileOpen(false);
    window.location.href = '/login';
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Left: logo + hamburger */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Apri menu"
            className="rounded-lg p-2 text-white/90 ring-1 ring-white/10 hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <IconMenu />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.png" alt="Lagoon Rebel Wear" width={36} height={36} priority />
            <span className="sr-only">Lagoon Rebel Wear</span>
          </Link>
        </div>

        {/* Center: link desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/search" className="text-sm text-white/90 hover:text-white">
            Cerca
          </Link>
          <Link href="/contact" className="text-sm text-white/90 hover:text-white">
            Contatti
          </Link>
        </div>

        {/* Right: azioni */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/90 ring-1 ring-white/10 hover:bg-white/5"
          >
            <IconSearch />
            <span className="hidden sm:inline">Cerca</span>
          </Link>

          {loading ? (
            <span className="text-sm text-white/60">…</span>
          ) : user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white ring-1 ring-white/10 hover:bg-white/5"
              >
                <IconUser />
                <span className="hidden sm:inline">Account</span>
              </Link>
              <button
                onClick={onLogout}
                className="rounded-md px-3 py-1.5 text-sm text-white/90 ring-1 ring-white/10 hover:bg-white/5"
              >
                Esci
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/5"
            >
              <IconUser />
              <span className="hidden sm:inline">Accedi</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/90 ring-1 ring-white/10 hover:bg-white/5"
          >
            <IconCart />
            <span className="hidden sm:inline">Carrello</span>
            <CartBadge count={cartCount} />
          </Link>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/90 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-2">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-white/90 ring-1 ring-white/10 hover:bg-white/5"
              >
                <IconSearch />
                <span>Cerca</span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-white/90 ring-1 ring-white/10 hover:bg-white/5"
              >
                Contatti
              </Link>

              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-white ring-1 ring-white/10 hover:bg-white/5"
                  >
                    <IconUser />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="rounded-md px-3 py-2 text-left text-white/90 ring-1 ring-white/10 hover:bg-white/5"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-white ring-1 ring-white/10 hover:bg-white/5"
                >
                  <IconUser />
                  <span>Accedi</span>
                </Link>
              )}

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-white/90 ring-1 ring-white/10 hover:bg-white/5"
              >
                <IconCart />
                <span>Carrello</span>
                <CartBadge count={cartCount} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
