// lib/cart.js

export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('lr_cart');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('lr_cart', JSON.stringify(items));
    // notifica le altre componenti (Navbar) di aggiornare il badge
    window.dispatchEvent(new Event('lr_cart_updated'));
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
