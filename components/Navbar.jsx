'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  // ---- AUTH ----
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setUser(data?.session?.user ?? null);
      } catch {
        if (!active) return;
        setUser(null);
      } finally {
        if (!active) return;
        setChecking(false);
      }
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
    });
    load();
    return () => {
      active = false;
      try { sub?.subscription?.unsubscribe?.(); } catch {}
    };
  }, []);

  const onLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    setMobileOpen(false);
    router.replace('/');
  };

  // ---- CART BADGE ----
  const CART_KEY = 'lr_cart';
  const CART_EVENT = 'lr_cart_updated';
  const [cartCount, setCartCount] = useState(0);

  const readCartCount = () => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items)) return 0;
      return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const update = () => setCartCount(readCartCount());
    update();
    const onStorage = (e) => { if (!e?.key || e.key === CART_KEY) update(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_EVENT, update);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_EVENT, update);
    };
  }, []);

  // ---- MOBILE MENU ----
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // ---- SHRINK ON SCROLL ----
  const [shrink, setShrink] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const userInitial =
    (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const logoScale = shrink ? 'scale-90' : 'scale-100';
  const navHeight = shrink ? 'h-14 md:h-16' : 'h-16 md:h-20';
  const bgOpacity = shrink ? 'bg-black/95' : 'bg-black/80';

  return (
    <header
      role="banner"
      aria-label="Barra di navigazione"
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${bgOpacity}`}
    >
      <div className={`relative mx-auto ${navHeight} max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
        {/* LOGO centrato */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Link
            href="/"
            className={`pointer-events-auto inline-flex items-center transition-transform duration-500 ease-out ${logoScale}`}
            aria-label="Vai alla home"
          >
            <img
              src="/Logo.png"
              alt="Lagoon Rebel — logo"
              className="block w-auto h-[48px] md:h-[60px] lg:h-[72px] brightness-0 invert drop-shadow"
              decoding="async"
              style={{ maxHeight: '72px' }}
            />
          </Link>
        </div>

        {/* DESKTOP */}
        <nav
          role="navigation"
          aria-label="Azioni desktop"
          className="absolute inset-y-0 right-0 hidden md:flex items-center gap-3 text-white"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            <span>Cerca</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition"
                aria-label="Account"
                title="Account"
              >
                {userInitial}
              </Link>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
              >
                <span>Esci</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              <span>Accedi</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            <span>Carrello</span>
            <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full border border-white/50 px-1.5 text-[11px] font-semibold text-white leading-none">
              {cartCount}
            </span>
          </Link>
        </nav>

        {/* MOBILE */}
        <div className="absolute inset-y-0 left-0 flex md:hidden items-center">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Apri menu"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/>
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex md:hidden items-center">
          <Link
            href="/cart"
            aria-label="Vai al carrello"
            className="inline-flex items-center justify-center p-2 text-white hover:opacity-90 transition"
            title="Carrello"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-white">
              <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.16 14.26l.03.01L19 14l1.1-7H6.21l-.2-1H3V4h2.4l2.72 9.39-1.96.87Z"/>
            </svg>
            <sup className="ml-0.5 -mt-3 inline-block align-super text-[10px] leading-none text-white">
              {cartCount}
            </sup>
          </Link>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        ref={menuRef}
        className={[
          "md:hidden overflow-hidden border-t border-white/10 bg-black/90 backdrop-blur",
          mobileOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0",
          "transition-all duration-300 ease-out"
        ].join(' ')}
      >
        <div className="px-6 py-4 space-y-3 text-white">
          <Link
            href="/search"
            className="block rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
          >
            Cerca
          </Link>

          {user ? (
            <>
              <Link
                href="/account"
                className="block rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
              >
                Account
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
              >
                Esci
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
            >
              Accedi
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center justify-between rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
          >
            <span>Carrello</span>
            <span className="inline-flex min-w-[20px] items-center justify-center rounded-full border border-white/50 px-1.5 text-[11px] font-semibold text-white leading-none">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
