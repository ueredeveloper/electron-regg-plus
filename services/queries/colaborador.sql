create table if not exists colaborador (
  id bigint generated always as identity primary key,
  email character varying(120) not null unique,
  password_hash text not null,
  autorizacao boolean not null default false,
  created_at timestamp default now(),
  updated_at timestamp
);

-- Adiciona a coluna caso a tabela já existia sem ela
alter table colaborador
  add column if not exists autorizacao boolean not null default false;


create or replace function upsert_colaborador(
  p_id bigint,
  p_email character varying,
  p_password_hash text
)
returns table (
  id bigint,
  email character varying
)
language plpgsql
as $$
begin

  -- validação básica
  if p_email is null or trim(p_email) = '' then
    raise exception 'Email é obrigatório';
  end if;

  -- normaliza email
  p_email := lower(trim(p_email));

  -- 🔵 INSERT (ou re-cadastro: e-mail já existe → atualiza senha e revoga autorização)
  if p_id is null then

    if exists (
      select 1 from colaborador c where c.email = p_email
    ) then

      update colaborador
      set
        password_hash = p_password_hash,
        autorizacao   = false,
        updated_at    = now()
      where colaborador.email = p_email
      returning colaborador.id, colaborador.email
      into id, email;

      return next;

    else

      insert into colaborador (email, password_hash, autorizacao)
      values (p_email, p_password_hash, false)
      returning colaborador.id, colaborador.email
      into id, email;

      return next;

    end if;

  else

    -- 🔵 UPDATE
    if not exists (
      select 1 from colaborador c where c.id = p_id
    ) then
      raise exception 'Colaborador não encontrado';
    end if;

    if exists (
      select 1 from colaborador c
      where c.email = p_email
      and c.id <> p_id
    ) then
      raise exception 'Email já em uso';
    end if;

    update colaborador
    set
      email = p_email,
      password_hash = coalesce(p_password_hash, password_hash)
    where colaborador.id = p_id
    returning colaborador.id, colaborador.email
    into id, email;

    return next;

  end if;

end;
$$;

