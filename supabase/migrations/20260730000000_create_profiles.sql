-- Enable Row Level Security for profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'facilitator', 'student')),
  cohort text not null default 'Cohort 5',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policy 1: A user can always read their own profile row.
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy 2: Admins can read/write all profiles.
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert all profiles"
  on public.profiles
  for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on public.profiles
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete all profiles"
  on public.profiles
  for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy 3: Students and Facilitators can only read profiles within their own cohort.
create policy "Users can read profiles in same cohort"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.cohort = public.profiles.cohort
    )
  );

-- Helper function and trigger to handle new user registration in Supabase auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role, cohort)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'cohort', 'Cohort 5')
  );
  return new;
end;
$$;

-- Create trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
