-- 20260523_add_foundation_tee_white_style.sql
-- Lagoon Rebel Wear — Add Foundation Tee White style
-- Obiettivo: predisporre la variante colore White della Foundation Tee.
-- La variante resta nascosta finché non avremo immagini e selettore colore pronti.
-- Migration non distruttiva: non cancella dati esistenti e non crea duplicati.

-- =========================
-- 1. Creazione style White
-- =========================

insert into public.product_styles (
  product_id,
  slug,
  name,
  color_name,
  color_slug,
  graphic_name,
  edition_type,
  price_cents,
  currency,
  status,
  visibility,
  images_folder,
  sort_order
)
select
  p.id,
  'foundation-tee-white',
  'White',
  'White',
  'white',
  null,
  'standard',
  p.price_cents,
  coalesce(p.currency, 'EUR'),
  'coming_soon',
  'hidden',
  'drop-01-foundation/foundation-tee-white',
  10
from public.products p
where p.slug = 'foundation-tee'
  and not exists (
    select 1
    from public.product_styles ps
    where ps.product_id = p.id
      and ps.slug = 'foundation-tee-white'
  );


-- =========================
-- 2. Creazione varianti taglia per White
-- =========================

insert into public.product_variants (
  product_id,
  style_id,
  size,
  sku,
  stock,
  status
)
select
  p.id as product_id,
  ps.id as style_id,
  sizes.size as size,
  upper(
    regexp_replace(
      concat_ws(
        '-',
        p.slug,
        ps.color_slug,
        sizes.size
      ),
      '[^a-zA-Z0-9-]',
      '-',
      'g'
    )
  ) as sku,
  0 as stock,
  'sold_out' as status
from public.product_styles ps
join public.products p
  on p.id = ps.product_id
cross join lateral (
  select unnest(array['XS', 'S', 'M', 'L', 'XL', 'XXL']) as size
) sizes
where p.slug = 'foundation-tee'
  and ps.slug = 'foundation-tee-white'
  and not exists (
    select 1
    from public.product_variants pv
    where pv.style_id = ps.id
      and pv.size = sizes.size
  );


-- =========================
-- 3. Query utile di verifica
-- =========================

-- select
--   p.name as product_name,
--   ps.name as style_name,
--   ps.visibility,
--   pv.size,
--   pv.sku,
--   pv.stock,
--   pv.status
-- from public.product_variants pv
-- join public.product_styles ps on ps.id = pv.style_id
-- join public.products p on p.id = pv.product_id
-- where p.slug = 'foundation-tee'
-- order by ps.sort_order, pv.size;