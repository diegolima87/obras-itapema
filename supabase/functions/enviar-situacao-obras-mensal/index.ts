import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const startTime = Date.now();

  try {
    console.log('🚀 Iniciando envio mensal automático de situação de obras');

    // Buscar todas as obras ativas com tenant
    const { data: obras, error: obrasError } = await supabase
      .from('obras')
      .select(`
        *,
        contratos (
          id,
          numero,
          fornecedor_id,
          valor_atualizado
        )
      `)
      .not('tenant_id', 'is', null)
      .order('created_at', { ascending: false });

    if (obrasError) {
      console.error('Erro ao buscar obras:', obrasError);
      throw obrasError;
    }

    console.log(`📊 ${obras.length} obras encontradas para envio`);

    let sucessos = 0;
    let erros = 0;
    const resultadosDetalhados = [];

    // Processar cada obra
    for (const obra of obras) {
      try {
        console.log(`  📤 Enviando situação da obra: ${obra.nome}`);

        // SIMULAÇÃO: Gerar payload de situação da obra
        const payload = {
          tipo: 'situacao_obra',
          obra_id: obra.id,
          tenant_id: obra.tenant_id,
          dados: {
            codigo_obra: obra.id,
            nome: obra.nome,
            descricao: obra.descricao,
            endereco: `${obra.endereco || ''}, ${obra.bairro || ''}, ${obra.cidade || ''}/${obra.uf || ''}`,
            coordenadas: {
              latitude: obra.latitude,
              longitude: obra.longitude
            },
            situacao: {
              status: obra.status,
              percentual_fisico: obra.percentual_executado || 0,
              valor_executado: obra.valor_executado || 0,
              valor_total: obra.valor_total || 0,
              data_inicio: obra.data_inicio,
              data_prevista_conclusao: obra.data_fim_prevista,
              data_real_conclusao: obra.data_fim_real
            },
            contratos: obra.contratos || [],
            data_referencia: new Date().toISOString().split('T')[0],
            mes_referencia: new Date().toISOString().slice(0, 7)
          },
          timestamp: new Date().toISOString()
        };

        // SIMULAÇÃO: Enviar ao e-Sfinge (em produção, seria uma chamada HTTP real)
        const resultadoSimulado = await simularEnvioESfinge(payload);

        // Registrar na tabela integracoes_tce
        const { error: integracaoError } = await supabase
          .from('integracoes_tce')
          .insert({
            tipo: 'situacao_obra',
            referencia_id: obra.id,
            payload_enviado: payload,
            payload_resposta: resultadoSimulado.resposta,
            status: resultadoSimulado.sucesso ? 'sucesso' : 'erro',
            protocolo: resultadoSimulado.protocolo,
            mensagem_erro: resultadoSimulado.erro,
            enviado_por: null // Envio automático, sem usuário
          });

        if (integracaoError) {
          console.error(`  ❌ Erro ao registrar integração:`, integracaoError);
          erros++;
          resultadosDetalhados.push({
            obra_id: obra.id,
            obra_nome: obra.nome,
            status: 'erro',
            erro: integracaoError.message
          });
        } else if (resultadoSimulado.sucesso) {
          console.log(`  ✅ Situação enviada com sucesso: ${resultadoSimulado.protocolo}`);
          sucessos++;
          resultadosDetalhados.push({
            obra_id: obra.id,
            obra_nome: obra.nome,
            status: 'sucesso',
            protocolo: resultadoSimulado.protocolo
          });
        } else {
          console.log(`  ⚠️ Falha no envio: ${resultadoSimulado.erro}`);
          erros++;
          resultadosDetalhados.push({
            obra_id: obra.id,
            obra_nome: obra.nome,
            status: 'erro',
            erro: resultadoSimulado.erro
          });
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error(`  ❌ Erro ao processar obra ${obra.id}:`, errorMessage);
        erros++;
        resultadosDetalhados.push({
          obra_id: obra.id,
          obra_nome: obra.nome,
          status: 'erro',
          erro: errorMessage
        });
      }
    }

    const tempoExecucao = Date.now() - startTime;

    // Registrar log de execução mensal
    await supabase
      .from('logs_importacao_tce')
      .insert({
        tipo: 'envio_mensal_situacao_obras',
        status: erros === 0 ? 'sucesso' : 'concluido_com_erros',
        registros_importados: sucessos,
        registros_erros: erros,
        tempo_execucao_ms: tempoExecucao,
        detalhes: {
          total_obras: obras.length,
          sucessos,
          erros,
          resultados: resultadosDetalhados,
          mes_referencia: new Date().toISOString().slice(0, 7)
        }
      });

    console.log(`✅ Envio mensal concluído em ${tempoExecucao}ms`);
    console.log(`📊 Resumo: ${sucessos} sucessos, ${erros} erros de ${obras.length} obras`);

    return new Response(
      JSON.stringify({
        success: true,
        resumo: {
          total: obras.length,
          sucessos,
          erros,
          tempo_execucao_ms: tempoExecucao
        },
        resultados: resultadosDetalhados
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro no envio mensal:', errorMessage);

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// SIMULAÇÃO: Enviar situação ao e-Sfinge
async function simularEnvioESfinge(payload: any) {
  console.log('🔄 Simulando envio ao e-Sfinge...');
  
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simular 95% de taxa de sucesso
  const sucesso = Math.random() > 0.05;

  if (sucesso) {
    const protocolo = `TCE-${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
    return {
      sucesso: true,
      protocolo,
      resposta: {
        protocolo,
        data_recebimento: new Date().toISOString(),
        mensagem: 'Situação de obra recebida e processada com sucesso'
      },
      erro: null
    };
  } else {
    return {
      sucesso: false,
      protocolo: null,
      resposta: null,
      erro: 'Erro de comunicação com o e-Sfinge (simulado)'
    };
  }
}
