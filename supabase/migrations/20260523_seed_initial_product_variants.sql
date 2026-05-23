-- 20260523_seed_initial_product_variants.sql
-- Lagoon Rebel Wear — Initial product variants seed
-- Obiettivo: creare le varianti taglia/stock iniziali per gli style esistenti.
-- Stock iniziale impostato a 0 per evitare disponibilità fittizie.
-- Migration non distruttiva: non cancella dati esistenti e non crea duplicati.

-- =========================
-- 1. Inserimento varianti taglia iniziali
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
        coalesce(ps.color_slug, 'default'),
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
  select unnest(
    case
      when p.category = 'headwear' then array['OS']
      else array['XS', 'S', 'M', 'L', 'XL', 'XXL']
    end
  ) as size
) sizes
where not exists (
  select 1
  from public.product_variants pv
  where pv.style_id = ps.id
    and pv.size = sizes.size
);


-- =========================
-- 2. Verifica rapida dati creati
-- =========================

-- Query utile da lanciare manualmente se serve:
-- select p.name, ps.name as style_name, pv.size, pv.sku, pv.stock, pv.status
-- from public.product_variants pv
-- join public.product_styles ps on ps.id = pv.style_id
-- join public.products p on p.id = pv.product_id
-- order by p.name, ps.name, pv.size;