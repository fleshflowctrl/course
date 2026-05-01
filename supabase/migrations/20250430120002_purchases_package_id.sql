-- Links each Stripe session to the package the customer selected.
alter table public.purchases
  add column if not exists package_id text;

comment on column public.purchases.package_id is
  'Matches lib/packages.ts id (foundations | foundations_symptoms | full). Legacy rows may have starter.';
