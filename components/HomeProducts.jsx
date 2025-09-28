'use client';

import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.js';

export default function HomeProducts() {
  const products = Array.isArray(productsData) ? productsData : [];
  if (!products.length) return null;

  return (
    <section id="shop" className="mx-auto mt-12 max-w-6xl px-4">
      <h2 className="text-xl font-semibold text-white">Shop</h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ul>
    </section>
  );
}
