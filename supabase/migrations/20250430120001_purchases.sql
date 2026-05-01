-- Purchase ledger + one-time signup (Stripe session id is the idempotency key).
-- Run in Supabase SQL Editor or via CLI after deploy.

create table if not exists public.purchases (
  stripe_checkout_session_id text primary key,
  email text not null,
  amount_total integer,
  currency text,
  user_id uuid,
  signup_completed_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.purchases is
  'Stripe checkout sessions (paid). Webhook inserts; signup API sets user_id once.';

create index if not exists purchases_email_idx on public.purchases (lower(email));

alter table public.purchases enable row level security;
