-- Criar tabela para manter o banco ativo
CREATE TABLE IF NOT EXISTS public.supabasenopause (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ultima_atividade timestamp with time zone NOT NULL DEFAULT now(),
  mensagem text DEFAULT 'Heartbeat para manter banco ativo'
);

-- Inserir registro inicial
INSERT INTO public.supabasenopause (mensagem) 
VALUES ('Heartbeat inicial - ' || now()::text);

-- Criar função para atualizar o heartbeat
CREATE OR REPLACE FUNCTION public.heartbeat_supabase()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deletar registro antigo
  DELETE FROM public.supabasenopause;
  
  -- Inserir novo registro com data atual
  INSERT INTO public.supabasenopause (mensagem)
  VALUES ('Heartbeat - ' || now()::text);
END;
$$;

-- Habilitar extensões necessárias para cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar cron job para rodar a cada 5 dias
SELECT cron.schedule(
  'heartbeat-supabase-nopause',
  '0 0 */5 * *',  -- A cada 5 dias à meia-noite
  $$SELECT public.heartbeat_supabase()$$
);