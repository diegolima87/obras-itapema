-- Habilitar RLS na tabela supabasenopause
ALTER TABLE public.supabasenopause ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas leitura por admins (tabela é gerenciada pelo cron)
CREATE POLICY "Apenas super_admins podem visualizar heartbeat"
ON public.supabasenopause
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));