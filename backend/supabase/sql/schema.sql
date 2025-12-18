create table transactions (
   id uuid default gen_random_uuid() primary key,
   user_id uuid refrences auth.users(id),
   name text not null,
    amount numeric not null,
    type text check (type in ('income', 'expense')) not null,
    date date not null,
    created_at timestamp default now()
);

alter table transactions enable row level security;

create policy "User can manage their transactions" on transactions
   for all
   using (auth.uid() = user_id);