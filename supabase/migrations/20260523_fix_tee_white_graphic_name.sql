-- 20260523_fix_tee_white_graphic_name.sql
-- Lagoon Rebel Wear — Fix Tee White graphic name
-- Obiettivo: rendere coerente la variante White della Foundation Tee
-- con gli altri style che usano il ricamo Foundation Purple Logo.

update public.product_styles
set
  graphic_name = 'Foundation Purple Logo',
  updated_at = now()
where slug = 'foundation-tee-white'
  and graphic_name is null;