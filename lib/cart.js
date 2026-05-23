// lib/cart.js

const CART_KEY = 'lr_cart';
const CART_EVENT = 'lr_cart_updated';

// Normalizza qualsiasi forma legacy -> sempre array di items
function normalize(raw) {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch {
    return [];
  }
}

function normalizeItem(item) {
  return {
    id: item.id,
    slug: item.slug ?? item.id ?? null,
    title: item.title ?? 'Prodotto',
    price: Number(item.price) || 0,
    qty: Math.max(1, Number(item.qty) || 1),
    size: item.size ?? null,
    variant: item.variant ?? null,
    category: item.category ?? null,
    colorName: item.colorName ?? item.variant ?? null,
    imageFront: item.imageFront ?? null,
    imageBack: item.imageBack ?? null,
  };
}

export function getCart() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CART_KEY);
  return normalize(raw).map(normalizeItem);
}

export function setCart(items) {
  if (typeof window === 'undefined') return;

  try {
    const safeItems = Array.isArray(items) ? items.map(normalizeItem) : [];
    localStorage.setItem(CART_KEY, JSON.stringify(safeItems));

    // Notifica le altre componenti (Navbar/Cart) di aggiornare badge/UI
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // Evita crash se localStorage è bloccato/non disponibile
  }
}

export function addToCart(item) {
  const items = getCart();
  const incoming = normalizeItem(item);

  const idx = items.findIndex(
    (it) =>
      it.id === incoming.id &&
      it.size === incoming.size &&
      it.variant === incoming.variant
  );

  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      ...incoming,
      qty: (Number(items[idx].qty) || 1) + (Number(incoming.qty) || 1),
    };
  } else {
    items.push(incoming);
  }

  setCart(items);
  return items;
}

// Utility: somma quantità (per badge)
export function countCartItems() {
  const items = getCart();
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}