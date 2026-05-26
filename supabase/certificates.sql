-- GLOC 정품인증서 시스템 Supabase 전환용 스키마 초안
-- 현재 운영 앱은 Google Sheets/Apps Script를 사용합니다.
-- Supabase로 전환할 때 이 파일을 기준으로 테이블과 RLS를 생성하세요.

create extension if not exists pgcrypto;

create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  dealer_name text not null,
  dealer_code text not null unique,
  email text,
  password text,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  reservation_id text not null unique,
  dealer_id uuid references public.dealers(id),
  customer_name text,
  customer_phone text,
  vehicle_number text,
  vehicle_model text,
  product_type text,
  product_name text,
  product_serial text,
  certificate_number text not null unique,
  random_code text not null,
  check_digit text not null,
  installation_date timestamptz,
  issued_at timestamptz not null default now(),
  issued_by text,
  verified_count integer not null default 0,
  last_verified_at timestamptz,
  status text not null default 'active' check (status in ('active', 'revoked', 'reissued')),
  created_at timestamptz not null default now()
);

create table if not exists public.certificate_verification_logs (
  id uuid primary key default gen_random_uuid(),
  certificate_number text not null,
  verified_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  result text not null check (result in ('success', 'invalid', 'revoked', 'reissued', 'malformed'))
);

alter table public.dealers enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_verification_logs enable row level security;

-- 실제 앱 전환 시에는 auth.jwt()의 role/dealer_code 클레임에 맞춰 정책을 조정하세요.
create policy if not exists "admins can read all certificates"
on public.certificates for select
using (auth.jwt() ->> 'role' = 'admin');

create policy if not exists "dealers can read own certificates"
on public.certificates for select
using (auth.jwt() ->> 'dealer_code' = (
  select dealer_code from public.dealers where dealers.id = certificates.dealer_id
));

create policy if not exists "public verify reads active certificate fields through rpc"
on public.certificate_verification_logs for insert
with check (true);
