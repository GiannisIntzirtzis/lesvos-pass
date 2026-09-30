-- =====================================================================
-- Lesvos Pass — database setup (step 1)
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- Partner businesses (ids match js/partners.js)
create table public.partners (
  id text primary key,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Which login belongs to which partner business
create table public.partner_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  partner_id text not null references public.partners(id) on delete cascade
);

create sequence public.card_number_seq start 1;

-- Cards. The secret QR token is never stored, only its fingerprint (hash).
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  token_hash text not null unique,
  status text not null default 'active' check (status in ('inactive', 'active', 'void')),
  channel text not null default 'online' check (channel in ('online', 'agency', 'test')),
  agency_id text,
  email text,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  expires_at timestamptz
);

-- Every use of a card at a partner. One use per card per partner, enforced by the database.
create table public.redemptions (
  id bigint generated always as identity primary key,
  card_id uuid not null references public.cards(id) on delete cascade,
  partner_id text not null references public.partners(id),
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz not null default now(),
  unique (card_id, partner_id)
);

-- Lock all tables. Nobody reads or writes them directly;
-- everything goes through the functions below, which check the rules.
alter table public.partners enable row level security;
alter table public.partner_members enable row level security;
alter table public.cards enable row level security;
alter table public.redemptions enable row level security;

-- ---------------------------------------------------------------------
-- Helper: fingerprint of a token
-- ---------------------------------------------------------------------
create or replace function public._hash_token(p_token text)
returns text language sql immutable
as $$ select encode(extensions.digest(p_token, 'sha256'), 'hex') $$;
revoke all on function public._hash_token(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Create a card (only you / the server can run this, never visitors)
-- Returns the card number and the secret token for the QR code.
-- ---------------------------------------------------------------------
create or replace function public.create_card(p_channel text default 'online', p_email text default null, p_active boolean default true)
returns table (card_number text, card_token text)
language plpgsql security definer set search_path = public
as $$
declare
  v_token text;
  v_number text;
begin
  v_token := translate(encode(extensions.gen_random_bytes(16), 'base64'), '+/=', '-_');
  v_number := 'LP-' || to_char(now(), 'YY') || '-' || lpad(nextval('public.card_number_seq')::text, 5, '0');
  insert into public.cards (number, token_hash, status, channel, email, activated_at, expires_at)
  values (
    v_number,
    public._hash_token(v_token),
    case when p_active then 'active' else 'inactive' end,
    p_channel,
    p_email,
    case when p_active then now() end,
    case when p_active then now() + interval '3 months' end
  );
  card_number := v_number;
  card_token := v_token;
  return next;
end $$;
revoke all on function public.create_card(text, text, boolean) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Card page for the visitor: is my card valid, until when, where used
-- ---------------------------------------------------------------------
create or replace function public.card_info(p_token text)
returns json language plpgsql stable security definer set search_path = public
as $$
declare
  c public.cards;
begin
  select * into c from public.cards where token_hash = public._hash_token(p_token);
  if not found then
    return json_build_object('state', 'not_found');
  end if;
  return json_build_object(
    'state', case
               when c.status = 'void' then 'void'
               when c.status = 'inactive' then 'inactive'
               when c.expires_at < now() then 'expired'
               else 'valid'
             end,
    'number', c.number,
    'expires_at', c.expires_at,
    'used', coalesce((select json_agg(r.partner_id order by r.redeemed_at)
                      from public.redemptions r where r.card_id = c.id), '[]'::json)
  );
end $$;
revoke all on function public.card_info(text) from public;
grant execute on function public.card_info(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Partner scan: check a card and (optionally) record the use.
-- p_code = QR token, full card link, or card number typed by hand (LP-27-00001)
-- ---------------------------------------------------------------------
create or replace function public.partner_scan(p_code text, p_redeem boolean default false)
returns json language plpgsql security definer set search_path = public
as $$
declare
  v_partner text;
  v_code text;
  v_used timestamptz;
  v_state text;
  c public.cards;
begin
  select partner_id into v_partner from public.partner_members where user_id = auth.uid();
  if v_partner is null then
    return json_build_object('state', 'not_partner');
  end if;

  v_code := trim(coalesce(p_code, ''));
  if position('/c/' in v_code) > 0 then
    v_code := regexp_replace(v_code, '^.*/c/', '');
  end if;

  if upper(v_code) ~ '^LP-[0-9]{2}-[0-9]{5}$' then
    select * into c from public.cards where number = upper(v_code);
  else
    select * into c from public.cards where token_hash = public._hash_token(v_code);
  end if;
  if not found then
    return json_build_object('state', 'not_found');
  end if;

  select redeemed_at into v_used from public.redemptions where card_id = c.id and partner_id = v_partner;

  v_state := case
               when c.status = 'void' then 'void'
               when c.status = 'inactive' then 'inactive'
               when c.expires_at < now() then 'expired'
               when v_used is not null then 'used_here'
               else 'valid'
             end;

  if p_redeem and v_state = 'valid' then
    begin
      insert into public.redemptions (card_id, partner_id, redeemed_by) values (c.id, v_partner, auth.uid());
      v_state := 'redeemed';
      v_used := now();
    exception when unique_violation then
      v_state := 'used_here';
      select redeemed_at into v_used from public.redemptions where card_id = c.id and partner_id = v_partner;
    end;
  end if;

  return json_build_object('state', v_state, 'number', c.number, 'expires_at', c.expires_at,
                           'used_at', v_used, 'partner', v_partner);
end $$;
revoke all on function public.partner_scan(text, boolean) from public, anon;
grant execute on function public.partner_scan(text, boolean) to authenticated;

-- ---------------------------------------------------------------------
-- Partners (same ids as js/partners.js). Add real ones here as you sign them.
-- ---------------------------------------------------------------------
insert into public.partners (id, name) values
  ('genesis', 'Genesis Cafe Snack All Day Bar'),
  ('ex-taverna-port', 'Harbour taverna (example)'),
  ('ex-pastry', 'Pastry shop (example)'),
  ('ex-boutique', 'Fashion boutique (example)'),
  ('ex-jewellery', 'Jewellery shop (example)'),
  ('ex-olive', 'Olive oil and local products (example)'),
  ('ex-baths', 'Thermal baths (example)'),
  ('ex-taverna-molyvos', 'Castle view taverna (example)'),
  ('ex-boat', 'Boat trips (example)'),
  ('ex-petra-cafe', 'Seafront cafe (example)'),
  ('ex-kalloni', 'Sardine and ouzo restaurant (example)'),
  ('ex-beachbar', 'Beach bar (example)'),
  ('ex-pottery', 'Pottery workshop (example)'),
  ('ex-ouzo', 'Ouzo distillery (example)'),
  ('ex-plomari-beach', 'Seaside sunbeds (example)');
