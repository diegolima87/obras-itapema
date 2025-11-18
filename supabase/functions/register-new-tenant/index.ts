import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TenantRegistration {
  nome: string;
  email: string;
  senha: string;
  nome_municipio: string;
  cnpj: string;
  uf: string;
  telefone?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { nome, email, senha, nome_municipio, cnpj, uf, telefone }: TenantRegistration = await req.json();

    // Validações básicas
    if (!nome || !email || !senha || !nome_municipio || !cnpj || !uf) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos obrigatórios devem ser preenchidos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (senha.length < 6) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se CNPJ já existe
    const { data: existingCnpj } = await supabaseClient
      .from('tenants')
      .select('id')
      .eq('cnpj', cnpj)
      .single();

    if (existingCnpj) {
      return new Response(
        JSON.stringify({ error: 'Este CNPJ já está cadastrado no sistema' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar slug do nome do município (normalizar e remover acentos)
    const slug = nome_municipio
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Verificar se slug já existe
    const { data: existingSlug } = await supabaseClient
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingSlug) {
      return new Response(
        JSON.stringify({ error: 'Já existe um município com este nome no sistema' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Criando tenant:', { nome_municipio, slug, cnpj, uf });

    // Criar o tenant
    const { data: tenant, error: tenantError } = await supabaseClient
      .from('tenants')
      .insert({
        nome_municipio,
        cnpj,
        uf,
        slug,
        subdominio: slug,
        email,
        telefone,
        ativo: true,
        plano: 'basico',
        portal_ativo: true,
        exigir_aprovacao: true,
        mostrar_fornecedores: true,
        mostrar_valores: true,
        permitir_comentarios: false,
      })
      .select()
      .single();

    if (tenantError) {
      console.error('Erro ao criar tenant:', tenantError);
      return new Response(
        JSON.stringify({ error: 'Erro ao criar município: ' + tenantError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Tenant criado com sucesso:', tenant.id);

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabaseClient.auth.admin.listUsers();
    const userExists = existingUser?.users.find(u => u.email === email);

    let userId: string;

    if (userExists) {
      console.log('Usuário já existe, vinculando ao novo tenant:', userExists.id);
      userId = userExists.id;

      // Atualizar o metadata do usuário para incluir o tenant_id
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        userExists.id,
        {
          user_metadata: {
            ...userExists.user_metadata,
            nome,
            tenant_id: tenant.id,
          }
        }
      );

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError);
        await supabaseClient.from('tenants').delete().eq('id', tenant.id);
        
        return new Response(
          JSON.stringify({ error: 'Erro ao vincular usuário ao tenant: ' + updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Criar novo usuário
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: {
          nome,
          tenant_id: tenant.id,
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        await supabaseClient.from('tenants').delete().eq('id', tenant.id);
        
        return new Response(
          JSON.stringify({ error: 'Erro ao criar usuário: ' + authError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = authData.user.id;
      console.log('Usuário criado com sucesso:', userId);
    }

    // Atribuir role de admin ao usuário (se ainda não tiver)
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      }, {
        onConflict: 'user_id,role',
        ignoreDuplicates: true
      });

    if (roleError) {
      console.error('Erro ao atribuir role de admin:', roleError);
      return new Response(
        JSON.stringify({ error: 'Erro ao atribuir permissões: ' + roleError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Role de admin atribuída com sucesso');

    return new Response(
      JSON.stringify({
        success: true,
        tenant: {
          id: tenant.id,
          nome_municipio: tenant.nome_municipio,
          slug: tenant.slug,
        },
        user: {
          id: userId,
          email: email,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro não tratado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor: ' + (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
