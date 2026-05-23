-- 20260523_fix_catalog_color_naming.sql
-- Lagoon Rebel Wear — Fix catalog color naming
-- Obiettivo: distinguere il colore reale del capo dal colore del logo/grafica.
-- Il capo attuale è Black; Foundation Purple è il colore del logo/dettaglio grafico.
-- Migration non distruttiva: non cancella dati esistenti.

-- =========================
-- 1. Correzione style attuali Black
-- =========================

update public.product_styles ps
set
  name = 'Black',
  color_name = 'Black',
  color_slug = 'black',
  graphic_name = 'Foundation Purple Logo',
  updated_at = now()
from public.products p
where ps.product_id = p.id
  and p.slug in ('foundation-tee', 'foundation-hoodie')
  and ps.slug in ('foundation-tee-foundation-purple', 'foundation-hoodie-foundation-purple');

update public.product_styles ps
set
  name = 'Micro Emblem',
  color_name = 'Black',
  color_slug = 'black',
  graphic_name = 'Foundation Purple Micro Emblem',
  updated_at = now()
from public.products p
where ps.product_id = p.id
  and p.slug = 'foundation-cap-micro-emblem'
  and ps.slug = 'foundation-cap-micro-emblem-foundation-purple';


-- =========================
-- 2. Correzione prodotti legacy
-- =========================

update public.products
set
  color_name = 'Black',
  updated_at = now()
where slug in (
  'foundation-tee',
  'foundation-hoodie',
  'foundation-cap-micro-emblem'
)
and color_name = 'Foundation Purple';


-- =========================
-- 3. Aggiornamento SKU esistenti da foundation-purple a black
-- =========================

update public.product_variants
set
  sku = replace(sku, 'FOUNDATION-PURPLE', 'BLACK'),
  updated_at = now()
where sku like '%FOUNDATION-PURPLE%';