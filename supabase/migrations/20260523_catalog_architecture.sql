-- 20260523_catalog_architecture.sql
-- Lagoon Rebel Wear — Catalog architecture foundation
-- Obiettivo: predisporre il catalogo a drop, prodotti, style colore/grafica,
-- varianti taglia/stock e immagini collegate allo style.
-- Migration non distruttiva: non cancella dati esistenti.

-- =========================
-- 0. Estensioni necessarie
-- =========================

create extension if not exists pgcrypto;


-- =========================
-- 1. Estensione tabella drops
-- =========================

alter table public.drops
  add column if not exists slug text,
  add column if not exists subtitle text,
  add column if not exists description text,
  add column if not exists visibility text not null default 'public',
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

update public.drops
set slug = code
where slug is null and code is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'drops_status_check'
  ) then
    alter table public.drops
      add constraint drops_status_check
      check (status in ('draft', 'coming_soon', 'live', 'sold_out', 'archived', 'hidden'))
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'drops_visibility_check'
  ) then
    alter table public.drops
      add constraint drops_visibility_check
      check (visibility in ('public', 'hidden', 'archived'))
      not valid;
  end if;
end $$;


-- =========================
-- 2. Estensione tabella products
-- =========================

alter table public.products
  add column if not exists base_price_cents integer,
  add column if not exists visibility text not null default 'public',
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

update public.products
set base_price_cents = price_cents
where base_price_cents is null and price_cents is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_status_check'
  ) then
    alter table public.products
      add constraint products_status_check
      check (status in ('draft', 'coming_soon', 'live', 'sold_out', 'archived', 'hidden'))
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_visibility_check'
  ) then
    alter table public.products
      add constraint products_visibility_check
      check (visibility in ('public', 'hidden', 'archived'))
      not valid;
  end if;
end $$;


-- =========================
-- 3. Nuova tabella product_styles
-- =========================

create table if not exists public.product_styles (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  slug text not null,
  name text not null,
  color_name text,
  color_slug text,
  graphic_name text,
  edition_type text not null default 'standard',
  price_cents integer,
  currency text not null default 'EUR',
  status text not null default 'coming_soon',
  visibility text not null default 'public',
  images_folder text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_styles_edition_type_check'
  ) then
    alter table public.product_styles
      add constraint product_styles_edition_type_check
      check (edition_type in ('standard', 'limited', 'collaboration', 'capsule', 'archive'))
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_styles_status_check'
  ) then
    alter table public.product_styles
      add constraint product_styles_status_check
      check (status in ('draft', 'coming_soon', 'live', 'sold_out', 'archived', 'hidden'))
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_styles_visibility_check'
  ) then
    alter table public.product_styles
      add constraint product_styles_visibility_check
      check (visibility in ('public', 'hidden', 'archived'))
      not valid;
  end if;
end $$;

create unique index if not exists product_styles_product_slug_unique
  on public.product_styles(product_id, slug);


-- =========================
-- 4. Estensione product_variants
-- =========================

alter table public.product_variants
  add column if not exists style_id uuid references public.product_styles(id) on delete cascade,
  add column if not exists status text not null default 'live',
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_variants_status_check'
  ) then
    alter table public.product_variants
      add constraint product_variants_status_check
      check (status in ('draft', 'coming_soon', 'live', 'sold_out', 'hidden'))
      not valid;
  end if;
end $$;

create index if not exists product_variants_style_id_idx
  on public.product_variants(style_id);


-- =========================
-- 5. Estensione product_images
-- =========================

alter table public.product_images
  add column if not exists style_id uuid references public.product_styles(id) on delete cascade,
  add column if not exists alt text,
  add column if not exists image_type text not null default 'product',
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_images_image_type_check'
  ) then
    alter table public.product_images
      add constraint product_images_image_type_check
      check (image_type in ('front', 'back', 'detail', 'lookbook', 'product'))
      not valid;
  end if;
end $$;

create index if not exists product_images_style_id_idx
  on public.product_images(style_id);


-- =========================
-- 6. Backfill style attuali dai prodotti esistenti
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
  coalesce(p.slug || '-foundation-purple', p.id::text),
  coalesce(p.color_name, p.variant_name, p.name),
  p.color_name,
  lower(replace(coalesce(p.color_name, 'default'), ' ', '-')),
  p.variant_name,
  'standard',
  p.price_cents,
  coalesce(p.currency, 'EUR'),
  p.status,
  'public',
  p.images_folder,
  0
from public.products p
where not exists (
  select 1
  from public.product_styles ps
  where ps.product_id = p.id
);


-- =========================
-- 7. Collegamento product_variants agli style appena creati
-- =========================

update public.product_variants pv
set style_id = ps.id
from public.product_styles ps
where pv.product_id = ps.product_id
  and pv.style_id is null;


-- =========================
-- 8. RLS product_styles
-- =========================

alter table public.product_styles enable row level security;

drop policy if exists "Public can read visible product styles" on public.product_styles;

create policy "Public can read visible product styles"
on public.product_styles
for select
using (
  visibility = 'public'
  and status in ('coming_soon', 'live', 'sold_out')
);