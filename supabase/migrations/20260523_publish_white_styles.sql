-- 20260523_publish_white_styles.sql
-- Lagoon Rebel Wear — Publish White styles
-- Obiettivo: rendere visibili nel catalogo pubblico le varianti White
-- di Foundation Tee e Foundation Hoodie.
-- Migration non distruttiva: non cancella dati esistenti.

update public.product_styles
set
  visibility = 'public',
  updated_at = now()
where slug in (
  'foundation-tee-white',
  'foundation-hoodie-white'
);