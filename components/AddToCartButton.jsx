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
  className = '',
  children,
}) {
  const [adding, setAdding] = useState(false);
  const [ok, setOk] = useState(false);

  const onAdd = () => {
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
      disabled={adding}
      className={`rounded-md px-4 py-2 text-sm font-medium text-white ring-1 ring-white/10 hover:bg-white/5 disabled:opacity-60 ${className}`}
      aria-label="Aggiungi al carrello"
    >
      {ok ? 'Aggiunto ✓' : children ?? 'Aggiungi al carrello'}
    </button>
  );
}