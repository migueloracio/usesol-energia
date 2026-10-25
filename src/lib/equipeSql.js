export const EQUIPE_SQL_SCRIPT = `-- 1. Habilitar extensão de criptografia
create extension if not exists "pgcrypto";

-- 2. Listar membros da equipe (Exclusivo Master Alex)
create or replace function public.listar_equipe()
returns table (
  id uuid,
  email text,
  nome text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  total_propostas bigint
)
language plpgsql
security definer
set search_path = public, auth
as $func$
begin
  if coalesce(lower(trim(auth.jwt() ->> 'email')), '') not in ('gouloalex@gmail.com') then
    raise exception 'Acesso não autorizado';
  end if;

  return query
  select 
    u.id,
    u.email::text,
    coalesce(nullif(u.raw_user_meta_data->>'nome', ''), split_part(u.email::text, '@', 1))::text as nome,
    u.created_at,
    u.last_sign_in_at,
    count(p.id)::bigint as total_propostas
  from auth.users u
  left join public.propostas p on p.user_id = u.id
  group by u.id, u.email, u.raw_user_meta_data, u.created_at, u.last_sign_in_at
  order by 
    case when lower(trim(u.email::text)) = 'gouloalex@gmail.com' then 0 else 1 end,
    u.created_at desc;
end;
$func$;

-- 3. Alterar senha de consultor (Exclusivo Master)
create or replace function public.admin_alterar_senha(
  target_user_id uuid,
  nova_senha text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $func$
begin
  if coalesce(lower(trim(auth.jwt() ->> 'email')), '') not in ('gouloalex@gmail.com') then
    raise exception 'Acesso não autorizado';
  end if;

  if length(nova_senha) < 6 then
    raise exception 'A nova senha deve ter no mínimo 6 caracteres';
  end if;

  update auth.users
  set 
    encrypted_password = extensions.crypt(nova_senha, extensions.gen_salt('bf')),
    updated_at = now()
  where id = target_user_id;

  return true;
end;
$func$;

-- 4. Atualizar nome do consultor
create or replace function public.admin_atualizar_consultor(
  target_user_id uuid,
  novo_nome text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $func$
begin
  if coalesce(lower(trim(auth.jwt() ->> 'email')), '') not in ('gouloalex@gmail.com') then
    raise exception 'Acesso não autorizado';
  end if;

  update auth.users
  set 
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('nome', trim(novo_nome)),
    updated_at = now()
  where id = target_user_id;

  return true;
end;
$func$;

-- 5. Excluir consultor da equipe (Exclusivo Master)
create or replace function public.admin_excluir_consultor(
  target_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $func$
declare
  target_email text;
  master_id uuid;
begin
  if coalesce(lower(trim(auth.jwt() ->> 'email')), '') not in ('gouloalex@gmail.com') then
    raise exception 'Acesso não autorizado';
  end if;

  select email into target_email from auth.users where id = target_user_id;

  if lower(trim(coalesce(target_email, ''))) = 'gouloalex@gmail.com' then
    raise exception 'Não é permitido excluir o usuário Master';
  end if;

  select id into master_id from auth.users where lower(trim(email)) = 'gouloalex@gmail.com' limit 1;

  if master_id is not null then
    update public.propostas set user_id = master_id where user_id = target_user_id;
  end if;

  delete from auth.users where id = target_user_id;

  return true;
end;
$func$;

-- 6. Permissões de execução
grant execute on function public.listar_equipe() to authenticated;
grant execute on function public.admin_alterar_senha(uuid, text) to authenticated;
grant execute on function public.admin_atualizar_consultor(uuid, text) to authenticated;
grant execute on function public.admin_excluir_consultor(uuid) to authenticated;
`;
