import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeleteUserRequest {
  userId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📝 Iniciando exclusão de usuário');

    // Criar cliente Supabase com service_role para operações admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verificar autenticação do usuário que está fazendo a requisição
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autenticado');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('❌ Erro ao verificar usuário:', userError);
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ Usuário autenticado:', user.id);

    // Verificar se o usuário tem permissão (admin, gestor ou super_admin)
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('❌ Erro ao verificar roles:', rolesError);
      throw new Error('Erro ao verificar permissões');
    }

    const hasPermission = roles?.some(r => 
      ['super_admin', 'admin', 'gestor'].includes(r.role)
    );

    if (!hasPermission) {
      console.error('❌ Usuário sem permissão:', user.id);
      throw new Error('Sem permissão para excluir usuários');
    }

    console.log('✅ Usuário tem permissão');

    // Obter dados da requisição
    const { userId }: DeleteUserRequest = await req.json();

    if (!userId) {
      throw new Error('userId é obrigatório');
    }

    console.log('🗑️ Deletando usuário:', userId);

    // Verificar se não está tentando deletar um super_admin (proteção extra)
    const { data: targetRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    const isSuperAdmin = targetRoles?.some(r => r.role === 'super_admin');
    
    if (isSuperAdmin && !roles?.some(r => r.role === 'super_admin')) {
      throw new Error('Não é possível excluir um super admin');
    }

    // 1. Remover todos os roles do usuário
    console.log('📋 Removendo roles...');
    const { error: rolesDeleteError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (rolesDeleteError) {
      console.error('❌ Erro ao remover roles:', rolesDeleteError);
      throw rolesDeleteError;
    }

    // 2. Deletar o perfil
    console.log('👤 Removendo perfil...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('❌ Erro ao remover perfil:', profileError);
      throw profileError;
    }

    // 3. Deletar o usuário do Auth usando Admin API
    console.log('🔐 Removendo usuário do Auth...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('⚠️ Aviso ao deletar do Auth:', authError);
      // Não falhar se o usuário já foi deletado do auth
    }

    console.log('✅ Usuário excluído com sucesso:', userId);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Usuário excluído com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro na edge function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});