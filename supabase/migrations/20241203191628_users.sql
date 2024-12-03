create table public.users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text unique not null,
  car text,
  is_approved boolean default false,
  push_notification_token text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);