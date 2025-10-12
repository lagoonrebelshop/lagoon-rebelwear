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

export function getCart() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CART_KEY);
  return normalize(raw);
}

export function setCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
    // notifica le altre componenti (Navbar/Cart) di aggiornare il badge/UI
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {}
}

export function addToCart(item) {
  const items = getCart();
  const idx = items.findIndex(
    (it) => it.id === item.id && it.size === item.size && it.variant === item.variant
  );
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      qty: (Number(items[idx].qty) || 1) + (Number(item.qty) || 1),
    };
  } else {
    items.push({
      id: item.id,
      title: item.title ?? 'Prodotto',
      price: Number(item.price) || 0,
      qty: Math.max(1, Number(item.qty) || 1),
      size: item.size ?? null,
      variant: item.variant ?? null,
    });
  }
  setCart(items);
  return items;
}

// Utility: somma quantità (per badge)
export function countCartItems() {
  const items = getCart();
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}
