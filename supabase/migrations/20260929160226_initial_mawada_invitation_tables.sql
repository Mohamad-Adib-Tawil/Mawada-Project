-- Mawada invitation storage. Browser clients have no direct table privileges.
create table if not exists public.template_catalog (
  id text primary key check (id ~ '^[a-z0-9-]{1,80}$'),
  version integer not null check (version > 0),
  category text not null check (category in ('wedding','engagement','birthday','newborn','graduation','event','henna')),
  active boolean not null default true
);

insert into public.template_catalog (id, version, category) values
  ('clouds', 1, 'newborn'),
  ('moon', 1, 'newborn'),
  ('qabda', 1, 'newborn'),
  ('balloons', 1, 'birthday'),
  ('cake', 1, 'birthday'),
  ('confetti', 1, 'birthday'),
  ('neon', 1, 'birthday'),
  ('teddy', 1, 'birthday'),
  ('wedding', 1, 'wedding'),
  ('simple-invide-merrage', 1, 'wedding'),
  ('wedding-temp-2', 1, 'wedding'),
  ('wedding-temp-ethereal', 1, 'wedding'),
  ('wedding-temp-bab', 1, 'wedding'),
  ('wedding-temp-disney', 1, 'engagement'),
  ('wedding-temp-dove', 1, 'wedding'),
  ('wedding-temp-garden', 1, 'wedding'),
  ('wedding-temp-laylat-hana', 1, 'wedding'),
  ('wedding-temp-qasr', 1, 'wedding'),
  ('wedding-temp-letter', 1, 'wedding'),
  ('wedding-temp-reverie', 1, 'wedding'),
  ('wedding-temp-ring', 1, 'engagement'),
  ('wedding-temp-rozana', 1, 'wedding'),
  ('wedding-temp-starlit', 1, 'wedding'),
  ('wedding-temp-dovess', 1, 'wedding'),
  ('wedding-temp-swans', 1, 'wedding'),
  ('wedding-temp-blush', 1, 'wedding'),
  ('wedding-temp-surprise', 1, 'wedding'),
  ('wedding-temp-royal', 1, 'wedding'),
  ('wedding-temp-bahira', 1, 'wedding'),
  ('wedding-temp-storybook', 1, 'wedding'),
  ('wedding-temp-vangogh', 1, 'wedding'),
  ('wedding-temp-ivory-palace', 1, 'wedding'),
  ('wedding-temp-rosegold', 1, 'wedding'),
  ('wedding-temp-wisal', 1, 'wedding')
on conflict (id) do update set version = excluded.version, category = excluded.category, active = true;

create table if not exists public.team_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now(),
  added_by uuid references auth.users(id) on delete set null
);

create table if not exists public.invitations (
  id text primary key check (id ~ '^inv_[a-f0-9]{32}$'),
  template_id text not null references public.template_catalog(id),
  template_version integer not null check (template_version > 0),
  occasion text not null check (occasion in ('wedding','engagement','birthday','newborn','graduation','event')),
  data jsonb not null check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 48000),
  status text not null default 'published' check (status = 'published'),
  revision integer not null default 1 check (revision > 0),
  request_id uuid not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (created_by, request_id)
);

create index if not exists invitations_created_at_idx on public.invitations (created_at desc);

alter table public.template_catalog enable row level security;
alter table public.team_members enable row level security;
alter table public.invitations enable row level security;

-- No policies are intentionally defined: browsers cannot query these tables.
revoke all on table public.template_catalog, public.team_members, public.invitations from public, anon, authenticated;
grant select on table public.template_catalog to service_role;
grant select on table public.team_members to service_role;
grant select, insert, update, delete on table public.invitations to service_role;
