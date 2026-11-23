-- Alternância global e atômica dos preços dos dois order bumps.
-- Execute esta migration no SQL Editor do projeto Supabase antes de ativar o checkout.

create table if not exists public.order_bump_price_counter (
  id smallint primary key check (id = 1),
  next_sequence bigint not null default 0
);

insert into public.order_bump_price_counter (id, next_sequence)
values (1, 0)
on conflict (id) do nothing;

create table if not exists public.order_bump_price_assignments (
  visitor_id uuid primary key,
  price_cents integer not null check (price_cents in (590, 990)),
  assigned_at timestamptz not null default now()
);

alter table public.order_bump_price_counter enable row level security;
alter table public.order_bump_price_assignments enable row level security;

revoke all on table public.order_bump_price_counter from anon, authenticated;
revoke all on table public.order_bump_price_assignments from anon, authenticated;

create or replace function public.assign_order_bump_price(p_visitor_id uuid)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_price integer;
  v_sequence bigint;
begin
  -- O bloqueio serializa a atribuição inclusive em acessos simultâneos.
  select next_sequence
    into v_sequence
    from public.order_bump_price_counter
   where id = 1
   for update;

  -- Reutiliza a mesma faixa se o mesmo visitante fizer outra chamada.
  select price_cents
    into v_price
    from public.order_bump_price_assignments
   where visitor_id = p_visitor_id;

  if found then
    return v_price;
  end if;

  v_price := case when mod(v_sequence, 2) = 0 then 590 else 990 end;

  insert into public.order_bump_price_assignments (visitor_id, price_cents)
  values (p_visitor_id, v_price);

  update public.order_bump_price_counter
     set next_sequence = next_sequence + 1
   where id = 1;

  return v_price;
end;
$$;

revoke all on function public.assign_order_bump_price(uuid) from public, anon, authenticated;
grant execute on function public.assign_order_bump_price(uuid) to service_role;
