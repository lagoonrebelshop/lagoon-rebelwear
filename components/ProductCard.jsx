'use client';

import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
  const { id, title, price, image, collection, size, variant } = product;

  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="rounded-xl bg-black/40 p-6">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="h-auto w-full rounded-lg object-cover"
            priority={false}
          />
        ) : (
          <div className="aspect-square w-full rounded-lg bg-white/10" />
        )}
      </div>

      <div className="mt-4">
        {collection ? (
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            {collection}
          </span>
        ) : null}

        <h3 className="mt-3 text-white font-medium">{title}</h3>
        <p className="mt-1 text-sm text-white/70">
          {variant ? `${variant} ` : ''}{size ? `• Taglia ${size}` : ''}
        </p>
        <p className="mt-2 text-sm text-white/90">€ {Number(price).toFixed(2)}</p>

        <div className="mt-4">
          <AddToCartButton
            id={id}
            title={title}
            price={Number(price)}
            size={size ?? null}
            variant={variant ?? null}
            className="w-full justify-center"
          >
            Aggiungi al carrello
          </AddToCartButton>
        </div>
      </div>
    </li>
  );
}
