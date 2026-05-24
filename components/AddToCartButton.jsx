'use client';

import { useState } from 'react';
import { addToCart } from '../lib/cart';

export default function AddToCartButton({
  id,
  slug = null,
  title,
  price,
  size = null,
  variant = null,
  category = null,
  colorName = null,
  imageFront = null,
  imageBack = null,
  qty = 1,
  disabled = false,
  className = '',
  children,
}) {
  const [adding, setAdding] = useState(false);
  const [ok, setOk] = useState(false);

  const isDisabled = disabled || adding;

  const onAdd = () => {
    if (isDisabled) return;

    setAdding(true);

    addToCart({
      id,
      slug,
      title,
      price,
      size,
      variant,
      category,
      colorName,
      imageFront,
      imageBack,
      qty,
    });

    setAdding(false);
    setOk(true);
    setTimeout(() => setOk(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={isDisabled}
      className={`rounded-lg border border-[rgba(143,92,255,0.46)] bg-[rgba(143,92,255,0.14)] px-4 py-2.5 text-sm font-bold text-white ring-1 ring-[rgba(143,92,255,0.16)] transition hover:border-[rgba(143,92,255,0.78)] hover:bg-[rgba(143,92,255,0.22)] hover:shadow-[0_0_22px_rgba(143,92,255,0.16)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-white/45 disabled:ring-white/5 disabled:hover:bg-white/[0.04] disabled:hover:shadow-none ${className}`}
      aria-label="Aggiungi al carrello"
    >
      {ok ? 'Aggiunto ✓' : children ?? 'Aggiungi al carrello'}
    </button>
  );
}