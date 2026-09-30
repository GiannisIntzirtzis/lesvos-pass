-- Lesvos Pass — partner sign-up form ("For businesses" page)
create table public.partner_leads (
  id bigint generated always as identity primary key,
  business text not null,
  contact_name text not null,
  phone text,
  email text,
  area text,
  category text,
  message text,
  lang text,
  created_at timestamptz not null default now(),
  handled boolean not null default false
);
alter table public.partner_leads enable row level security;

create or replace function public.submit_partner_lead(
  p_business text, p_name text, p_phone text, p_email text,
  p_area text, p_category text, p_message text, p_lang text)
returns json language plpgsql security definer set search_path = public
as $$
begin
  if coalesce(trim(p_business), '') = '' or coalesce(trim(p_name), '') = ''
     or (coalesce(trim(p_phone), '') = '' and coalesce(trim(p_email), '') = '') then
    return json_build_object('ok', false);
  end if;
  -- simple protection against floods of fake submissions
  if (select count(*) from public.partner_leads where created_at > now() - interval '1 hour') >= 30 then
    return json_build_object('ok', false);
  end if;
  insert into public.partner_leads (business, contact_name, phone, email, area, category, message, lang)
  values (left(trim(p_business), 120), left(trim(p_name), 120), left(trim(p_phone), 40), left(trim(p_email), 160),
          left(p_area, 60), left(p_category, 60), left(p_message, 1000), left(p_lang, 5));
  return json_build_object('ok', true);
end $$;
revoke all on function public.submit_partner_lead(text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_partner_lead(text, text, text, text, text, text, text, text) to anon, authenticated;
