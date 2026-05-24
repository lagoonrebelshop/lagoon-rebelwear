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

  // ✅ MISURA ALTEZZA NAVBAR → scrive --nav-h (serve al layout e al hero)
  useEffect(() => {
    const header = document.getElementById('lr-navbar');
    if (!header) return;

    const apply = () => {
      const h = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-h', `${Math.round(h)}px`);
    };

    apply();

    const ro = new ResizeObserver(() => apply());
    ro.observe(header);

    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, [shrink, mobileOpen]);

  const NavButton = ({ href, children, className = '', onClick }) => (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[13px] font-medium tracking-wide text-white/80',
        'shadow-[0_0_22px_rgba(139,92,246,0.04)] backdrop-blur-sm transition-all duration-200',
        'hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.12)]',
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  );

  const CartButton = ({ href = '/cart', className = '', children }) => (
    <Link
      href={href}
      className={[
        'inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/35 bg-[#8b5cf6]/10 px-4 py-2 text-[13px] font-semibold tracking-wide text-white',
        'shadow-[0_0_26px_rgba(139,92,246,0.10)] backdrop-blur-sm transition-all duration-200',
        'hover:border-[#a78bfa]/60 hover:bg-[#8b5cf6]/18 hover:shadow-[0_0_34px_rgba(139,92,246,0.18)]',
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  );

  const Badge = ({ value }) => (
    <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full border border-[#a78bfa]/50 bg-black/40 px-1.5 text-[11px] font-semibold leading-none text-[#ddd6fe]">
      {value}
    </span>
  );

  return (
    <header
      id="lr-navbar"
      role="banner"
      aria-label="Barra di navigazione"
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${bgOpacity}`}
    >
      <div className={`relative mx-auto ${navHeight} max-w-7xl px-4 transition-all duration-300 sm:px-6 lg:px-8`}>
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
              className="block h-[48px] w-auto brightness-0 invert drop-shadow md:h-[60px] lg:h-[72px]"
              decoding="async"
              style={{ maxHeight: '72px' }}
            />
          </Link>
        </div>

        {/* DESKTOP */}
        <nav
          role="navigation"
          aria-label="Azioni desktop"
          className="absolute inset-y-0 right-0 hidden items-center gap-3 text-white md:flex"
        >
          <NavButton href="/search">Cerca</NavButton>

          {/* AUTH */}
          {showAuth ? (
            isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className={[
                    'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[13px] font-medium tracking-wide text-white/80',
                    'shadow-[0_0_22px_rgba(139,92,246,0.04)] backdrop-blur-sm transition-all duration-200',
                    'hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.12)]',
                  ].join(' ')}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <span>Account</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`}
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
                    className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-[#8b5cf6]/25 bg-black/95 py-2 shadow-[0_0_45px_rgba(139,92,246,0.14)]"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a78bfa]/75">
                        Loggato come
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/account"
                      className="block px-4 py-2.5 text-sm text-white/75 transition hover:bg-[#8b5cf6]/10 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                      role="menuitem"
                    >
                      Il mio account
                    </Link>

                    <button
                      onClick={onLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm text-red-300 transition hover:bg-white/10 hover:text-red-200"
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
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/15" aria-label="Caricamento account"></div>
          )}

          <CartButton href="/cart">
            <span>Carrello</span>
            <Badge value={cartCount} />
          </CartButton>
        </nav>

        {/* MOBILE left: burger */}
        <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-white shadow-[0_0_22px_rgba(139,92,246,0.06)] transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-white"
            >
              <path
                d="M5 7.25H19"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M5 16.75H19"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M6.5 7.25C8.7 5.45 15.3 5.45 17.5 7.25"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeLinecap="round"
                opacity="0.32"
              />
              <path
                d="M6.5 16.75C8.7 18.55 15.3 18.55 17.5 16.75"
                stroke="currentColor"
                strokeWidth="0.6"
                strokeLinecap="round"
                opacity="0.32"
              />
            </svg>
          </button>
        </div>

        {/* MOBILE right: cart */}
        <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
          <Link
            href="/cart"
            aria-label="Vai al carrello"
            className="inline-flex items-center justify-center rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-2 text-white shadow-[0_0_22px_rgba(139,92,246,0.10)] transition hover:bg-[#8b5cf6]/15"
            title="Carrello"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-white"
            >
              <path
                d="M7.5 9.5H16.5L17.25 19H6.75L7.5 9.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinejoin="round"
              />
              <path
                d="M9.25 9.5V8.25C9.25 6.75 10.45 5.5 12 5.5C13.55 5.5 14.75 6.75 14.75 8.25V9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinecap="round"
              />
              <path
                d="M8.75 12.25H15.25"
                stroke="currentColor"
                strokeWidth="0.65"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>

            <sup className="ml-1 -mt-3 inline-flex min-w-[16px] items-center justify-center rounded-full border border-[#a78bfa]/50 bg-black/60 px-1 text-[10px] font-semibold leading-none text-[#ddd6fe]">
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
          'border-t border-white/10 bg-black/95 backdrop-blur md:hidden',
          mobileOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0',
          'overflow-hidden transition-all duration-300 ease-out',
        ].join(' ')}
      >
        <div className="space-y-3 px-6 py-4 text-white">
          <Link
            href="/search"
            className="block rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
          >
            Cerca
          </Link>

          {/* AUTH mobile */}
          {showAuth ? (
            isAuthenticated ? (
              <>
                <div className="rounded-xl border border-[#8b5cf6]/20 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#a78bfa]/75">
                    Loggato come
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-white">
                    {user?.email}
                  </p>
                </div>

                <Link
                  href="/account"
                  className="block rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
                >
                  Il mio account
                </Link>

                <button
                  onClick={onLogout}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-left text-sm text-red-300 transition hover:bg-white/10 hover:text-red-200"
                >
                  Esci
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition hover:border-[#8b5cf6]/45 hover:bg-[#8b5cf6]/10 hover:text-white"
              >
                Accedi
              </Link>
            )
          ) : (
            <div className="h-12 animate-pulse rounded-xl bg-white/15" aria-label="Caricamento account"></div>
          )}

          <Link
            href="/cart"
            className="flex items-center justify-between rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-4 py-3 text-sm font-medium text-white transition hover:border-[#a78bfa]/55 hover:bg-[#8b5cf6]/15"
          >
            <span>Carrello</span>
            <span className="inline-flex min-w-[22px] items-center justify-center rounded-full border border-[#a78bfa]/50 bg-black/50 px-1.5 text-[11px] font-semibold leading-none text-[#ddd6fe]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}