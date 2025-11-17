import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportacaoResultado {
  contratos: { importados: number; atualizados: number; erros: number };
  aditivos: { importados: number; atualizados: number; erros: number };
  liquidacoes: { importados: number; atualizados: number; erros: number };
  documentos: { importados: number; atualizados: number; erros: number };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const startTime = Date.now();
  let logId: string | null = null;

  try {
    console.log('🚀 Iniciando importação automática do e-Sfinge TCE/SC');

    // Criar log de importação inicial
    const { data: logData, error: logError } = await supabase
      .from('logs_importacao_tce')
      .insert({
        tipo: 'importacao_automatica',
        status: 'processando',
        detalhes: { inicio: new Date().toISOString() }
      })
      .select()
      .single();

    if (logError) {
      console.error('Erro ao criar log:', logError);
      throw logError;
    }

    logId = logData.id;
    console.log(`📝 Log de importação criado: ${logId}`);

    // SIMULAÇÃO: Buscar dados do e-Sfinge
    // Em produção, aqui seria feita a chamada real à API do e-Sfinge
    const dadosSimulados = await simularBuscaESfinge();

    const resultado: ImportacaoResultado = {
      contratos: { importados: 0, atualizados: 0, erros: 0 },
      aditivos: { importados: 0, atualizados: 0, erros: 0 },
      liquidacoes: { importados: 0, atualizados: 0, erros: 0 },
      documentos: { importados: 0, atualizados: 0, erros: 0 }
    };

    // Importar liquidações
    console.log('💰 Processando liquidações...');
    for (const liquidacao of dadosSimulados.liquidacoes) {
      try {
        // Verificar se já existe
        const { data: existente } = await supabase
          .from('liquidacoes')
          .select('id')
          .eq('numero_liquidacao', liquidacao.numero_liquidacao)
          .maybeSingle();

        if (existente) {
          // Atualizar
          await supabase
            .from('liquidacoes')
            .update({
              valor_liquidado: liquidacao.valor_liquidado,
              data_liquidacao: liquidacao.data_liquidacao,
              dados_esfinge: liquidacao,
              updated_at: new Date().toISOString()
            })
            .eq('id', existente.id);
          
          resultado.liquidacoes.atualizados++;
          console.log(`  ✅ Liquidação atualizada: ${liquidacao.numero_liquidacao}`);
        } else {
          // Inserir nova
          const { error: insertError } = await supabase
            .from('liquidacoes')
            .insert({
              medicao_id: liquidacao.medicao_id,
              contrato_id: liquidacao.contrato_id,
              tenant_id: liquidacao.tenant_id,
              numero_empenho: liquidacao.numero_empenho,
              numero_liquidacao: liquidacao.numero_liquidacao,
              data_liquidacao: liquidacao.data_liquidacao,
              valor_liquidado: liquidacao.valor_liquidado,
              observacoes: liquidacao.observacoes,
              dados_esfinge: liquidacao
            });

          if (insertError) {
            console.error(`  ❌ Erro ao inserir liquidação:`, insertError);
            resultado.liquidacoes.erros++;
          } else {
            resultado.liquidacoes.importados++;
            console.log(`  ✅ Nova liquidação importada: ${liquidacao.numero_liquidacao}`);
          }
        }
      } catch (error) {
        console.error(`  ❌ Erro ao processar liquidação:`, error);
        resultado.liquidacoes.erros++;
      }
    }

    // Calcular tempo de execução
    const tempoExecucao = Date.now() - startTime;
    const totalRegistros = 
      resultado.contratos.importados + resultado.contratos.atualizados +
      resultado.aditivos.importados + resultado.aditivos.atualizados +
      resultado.liquidacoes.importados + resultado.liquidacoes.atualizados +
      resultado.documentos.importados + resultado.documentos.atualizados;

    const totalErros = 
      resultado.contratos.erros + resultado.aditivos.erros +
      resultado.liquidacoes.erros + resultado.documentos.erros;

    // Atualizar log com resultado final
    await supabase
      .from('logs_importacao_tce')
      .update({
        status: totalErros > 0 ? 'concluido_com_erros' : 'sucesso',
        registros_importados: totalRegistros,
        registros_erros: totalErros,
        tempo_execucao_ms: tempoExecucao,
        detalhes: {
          inicio: logData.detalhes?.inicio,
          fim: new Date().toISOString(),
          resultado
        }
      })
      .eq('id', logId);

    console.log(`✅ Importação concluída em ${tempoExecucao}ms`);
    console.log(`📊 Resumo: ${totalRegistros} registros processados, ${totalErros} erros`);

    return new Response(
      JSON.stringify({
        success: true,
        logId,
        tempoExecucao,
        resultado,
        resumo: {
          total: totalRegistros,
          erros: totalErros
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erro na importação:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Atualizar log com erro
    if (logId) {
      await supabase
        .from('logs_importacao_tce')
        .update({
          status: 'erro',
          mensagem_erro: errorMessage,
          tempo_execucao_ms: Date.now() - startTime,
          detalhes: {
            erro: errorMessage,
            stack: errorStack
          }
        })
        .eq('id', logId);
    }

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

// SIMULAÇÃO: Gerar dados fictícios do e-Sfinge
async function simularBuscaESfinge() {
  console.log('🔄 Simulando busca de dados no e-Sfinge...');
  
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Gerar liquidações fictícias
  const liquidacoes = [];
  const numLiquidacoes = Math.floor(Math.random() * 5) + 1; // 1-5 liquidações

  for (let i = 0; i < numLiquidacoes; i++) {
    liquidacoes.push({
      medicao_id: null, // Em produção, seria vinculado a medições reais
      contrato_id: null,
      tenant_id: null,
      numero_empenho: `2025NE${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      numero_liquidacao: `2025LQ${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      data_liquidacao: new Date().toISOString().split('T')[0],
      valor_liquidado: Math.floor(Math.random() * 500000) + 10000,
      observacoes: 'Importado automaticamente do e-Sfinge TCE/SC',
      data_importacao: new Date().toISOString()
    });
  }

  console.log(`  📦 ${liquidacoes.length} liquidações simuladas`);

  return {
    contratos: [],
    aditivos: [],
    liquidacoes,
    documentos: []
  };
}
