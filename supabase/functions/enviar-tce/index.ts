import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnvioTCERequest {
  tipo: 'contrato' | 'aditivo' | 'medicao' | 'situacao_obra';
  referenciaId: string;
  dados?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obter token do usuário
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const body: EnvioTCERequest = await req.json();
    const { tipo, referenciaId, dados } = body;

    console.log(`[e-Sfinge] Iniciando envio simulado - Tipo: ${tipo}, Ref: ${referenciaId}`);

    // Buscar dados do registro referenciado
    let dadosReferencia: any = {};
    
    switch (tipo) {
      case 'contrato':
        const { data: contrato } = await supabaseClient
          .from('contratos')
          .select(`
            *,
            obra:obras(*),
            fornecedor:fornecedores(*)
          `)
          .eq('id', referenciaId)
          .single();
        dadosReferencia = contrato;
        break;
        
      case 'medicao':
        const { data: medicao } = await supabaseClient
          .from('medicoes')
          .select(`
            *,
            obra:obras(*),
            contrato:contratos(*),
            fornecedor:fornecedores(*)
          `)
          .eq('id', referenciaId)
          .single();
        dadosReferencia = medicao;
        break;
        
      case 'situacao_obra':
        const { data: obra } = await supabaseClient
          .from('obras')
          .select('*')
          .eq('id', referenciaId)
          .single();
        dadosReferencia = obra;
        break;
    }

    // Montar payload de envio simulado no formato e-Sfinge
    const payloadEnviado = {
      versaoLayout: 'e-sfinge-2025',
      tipo,
      referenciaId,
      dataEnvio: new Date().toISOString(),
      remetenteOrgao: {
        cnpj: '00000000000000',
        nome: 'Prefeitura Municipal - Sistema de Gestão de Obras',
        uf: 'SC',
      },
      dados: {
        ...dadosReferencia,
        ...dados,
      },
      metadados: {
        sistemaOrigem: 'Sistema de Gestão de Obras Públicas',
        versaoSistema: '1.0.0',
        usuarioEnvio: user.email,
      },
    };

    // Simular resposta do e-Sfinge/TCE
    // Em produção, aqui seria feita a chamada real à API do TCE
    const protocolo = `TCE-${tipo.toUpperCase()}-${Date.now()}`;
    const payloadResposta = {
      status: 'OK',
      protocolo,
      dataRecebimento: new Date().toISOString(),
      mensagem: 'Dados recebidos e validados com sucesso (SIMULADO)',
      validacoes: {
        estrutura: 'OK',
        campos: 'OK',
        regrasNegocio: 'OK',
      },
      proximasEtapas: [
        'Os dados serão processados pelo sistema e-Sfinge',
        'Você receberá notificação quando o processamento for concluído',
        'O protocolo deve ser guardado para consultas futuras',
      ],
      observacao: '⚠️ MODO SIMULADO - Em produção, esta seria uma resposta real do TCE-SC',
    };

    console.log(`[e-Sfinge] Payload gerado - Protocolo: ${protocolo}`);

    // Salvar no histórico de integrações
    const { data: integracao, error: integracaoError } = await supabaseClient
      .from('integracoes_tce')
      .insert({
        tipo,
        referencia_id: referenciaId,
        payload_enviado: payloadEnviado,
        payload_resposta: payloadResposta,
        status: 'sucesso',
        protocolo,
        enviado_por: user.id,
      })
      .select()
      .single();

    if (integracaoError) {
      throw integracaoError;
    }

    console.log(`[e-Sfinge] Integração salva com sucesso - ID: ${integracao.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: integracao,
        message: 'Envio simulado realizado com sucesso',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[e-Sfinge] Erro:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
