'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  // UI state
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // refs for click-outside
  const accountRef = useRef(null);
  const mobileRef = useRef(null);

  const showAuth = !isLoading;

  // close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // ESC closes menus
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // click outside closes account dropdown
  useEffect(() => {
    const onClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // click outside closes mobile panel
  useEffect(() => {
    const onClickOutside = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // lock body scroll when mobile is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const onLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setMobileOpen(false);
      setAccountOpen(false);
      router.replace('/');
    }
  }, [router, signOut]);

  // CART BADGE
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

    const onStorage = (e) => {
      if (!e?.key || e.key === CART_KEY) update();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_EVENT, update);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_EVENT, update);
    };
  }, []);

  // SHRINK ON SCROLL
  const [shrink, setShrink] = useState(false);
  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoScale = shrink ? 'scale-90' : 'scale-100';
  const navHeight = shrink ? 'h-14 md:h-16' : 'h-16 md:h-20';
  const bgOpacity = shrink ? 'bg-black/95' : 'bg-black/80';

  const NavButton = ({ href, children, className = '', onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition ${className}`}
    >
      {children}
    </Link>
  );

  const Badge = ({ value }) => (
    <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full border border-white/50 px-1.5 text-[11px] font-semibold text-white leading-none">
      {value}
    </span>
  );

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
          <NavButton href="/search">Cerca</NavButton>

          {/* AUTH */}
          {showAuth ? (
            isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <span>Account</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 bg-black/95 border border-white/20 rounded-xl shadow-xl py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-white/50">Loggato come</p>
                      <p className="text-sm font-medium truncate text-white">{user?.email}</p>
                    </div>

                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                      onClick={() => setAccountOpen(false)}
                      role="menuitem"
                    >
                      Il mio account
                    </Link>

                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition"
                      role="menuitem"
                    >
                      Esci
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavButton href="/login">Accedi</NavButton>
            )
          ) : (
            <div className="w-24 h-9 bg-white/15 animate-pulse rounded-xl" aria-label="Caricamento account"></div>
          )}

          <NavButton href="/cart" className="relative">
            <span>Carrello</span>
            <Badge value={cartCount} />
          </NavButton>
        </nav>

        {/* MOBILE left: burger */}
        <div className="absolute inset-y-0 left-0 flex md:hidden items-center">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-3 py-2 text-white hover:bg-white/10 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
            </svg>
          </button>
        </div>

        {/* MOBILE right: cart */}
        <div className="absolute inset-y-0 right-0 flex md:hidden items-center">
          <Link
            href="/cart"
            aria-label="Vai al carrello"
            className="inline-flex items-center justify-center p-2 text-white hover:opacity-90 transition"
            title="Carrello"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-white">
              <path
                fill="currentColor"
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.16 14.26l.03.01L19 14l1.1-7H6.21l-.2-1H3V4h2.4l2.72 9.39-1.96.87Z"
              />
            </svg>
            <sup className="ml-0.5 -mt-3 inline-block align-super text-[10px] leading-none text-white">
              {cartCount}
            </sup>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        id="mobile-menu"
        ref={mobileRef}
        className={[
          'md:hidden border-t border-white/10 bg-black/90 backdrop-blur',
          mobileOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0',
          'overflow-hidden transition-all duration-300 ease-out',
        ].join(' ')}
      >
        <div className="px-6 py-4 space-y-3 text-white">
          <Link
            href="/search"
            className="block rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
          >
            Cerca
          </Link>

          {/* AUTH mobile */}
          {showAuth ? (
            isAuthenticated ? (
              <>
                <div className="px-4 py-2 rounded-lg border border-white/10">
                  <p className="text-xs text-white/50">Loggato come</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>

                <Link
                  href="/account"
                  className="block rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10 transition"
                >
                  Il mio account
                </Link>

                <button
                  onClick={onLogout}
                  className="w-full text-left rounded-lg border border-white/20 px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition"
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
            )
          ) : (
            <div className="h-12 bg-white/15 animate-pulse rounded-lg" aria-label="Caricamento account"></div>
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
