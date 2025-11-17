import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import type { TCEContrato, TCEMedicao, TCESituacaoObra } from '../_shared/tce-schemas.ts';
import { generateHash } from '../_shared/utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnvioTCERequest {
  tipo: 'contrato' | 'aditivo' | 'medicao' | 'situacao_obra';
  referenciaId: string;
  dados?: any;
}

/**
 * Converte dados do banco para o formato oficial TCE/SC 2025
 */
function converterParaLayoutTCE(tipo: string, dadosReferencia: any): any {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().toISOString().slice(0, 7);
  
  switch (tipo) {
    case 'contrato':
      const contrato: Partial<TCEContrato> = {
        exercicio: anoAtual,
        numero_contrato: dadosReferencia.numero || '',
        modalidade_licitacao: mapearModalidade(dadosReferencia.modalidade),
        numero_processo: dadosReferencia.numero || '',
        objeto: dadosReferencia.objeto || '',
        tipo_objeto: 'O', // O=Obra (inferir do contexto)
        data_assinatura: dadosReferencia.data_assinatura,
        data_inicio_vigencia: dadosReferencia.data_assinatura,
        data_fim_vigencia: dadosReferencia.data_vencimento,
        valor_inicial: Number(dadosReferencia.valor_inicial) || 0,
        valor_atualizado: Number(dadosReferencia.valor_atualizado) || 0,
        contratado: {
          tipo_pessoa: dadosReferencia.fornecedor?.cnpj?.length === 14 ? 'J' : 'F',
          cpf_cnpj: (dadosReferencia.fornecedor?.cnpj || '').replace(/\D/g, ''),
          nome_razao_social: dadosReferencia.fornecedor?.nome || '',
          logradouro: dadosReferencia.fornecedor?.endereco || '',
          bairro: dadosReferencia.fornecedor?.cidade || '',
          municipio: dadosReferencia.fornecedor?.cidade || '',
          uf: dadosReferencia.fornecedor?.estado || 'SC',
          cep: dadosReferencia.fornecedor?.cep || '',
        },
        recursos: [{
          fonte_recurso: '100',
          valor: Number(dadosReferencia.valor_inicial) || 0,
          percentual: 100,
        }],
        classificacoes: [{
          orgao: '01',
          unidade: '001',
          funcao: '15',
          subfuncao: '451',
          programa: '0001',
          acao: '1001',
          natureza_despesa: '4.4.90.51',
          valor: Number(dadosReferencia.valor_inicial) || 0,
        }],
      };
      return contrato;
      
    case 'medicao':
      const medicao: Partial<TCEMedicao> = {
        exercicio: anoAtual,
        numero_contrato: dadosReferencia.contrato?.numero || '',
        numero_medicao: dadosReferencia.numero_medicao || '',
        mes_competencia: dadosReferencia.competencia || mesAtual,
        data_inicio_periodo: dadosReferencia.competencia ? `${dadosReferencia.competencia}-01` : `${mesAtual}-01`,
        data_fim_periodo: dadosReferencia.competencia ? `${dadosReferencia.competencia}-28` : `${mesAtual}-28`,
        data_medicao: dadosReferencia.data_envio || new Date().toISOString().split('T')[0],
        valor_medido: Number(dadosReferencia.valor_medido) || 0,
        valor_bruto: Number(dadosReferencia.valor_medido) || 0,
        valor_retencoes: 0,
        valor_liquido: Number(dadosReferencia.valor_medido) || 0,
        percentual_executado: Number(dadosReferencia.percentual_executado) || 0,
        situacao: mapearStatusMedicao(dadosReferencia.status),
        data_aprovacao: dadosReferencia.data_aprovacao,
        observacoes: dadosReferencia.observacoes,
      };
      return medicao;
      
    case 'situacao_obra':
      const obra: Partial<TCESituacaoObra> = {
        exercicio: anoAtual,
        codigo_obra: dadosReferencia.id || '',
        mes_referencia: mesAtual,
        nome: dadosReferencia.nome || '',
        descricao: dadosReferencia.descricao || '',
        tipo_obra: 'EDF',
        logradouro: dadosReferencia.endereco || '',
        bairro: dadosReferencia.bairro || '',
        municipio: dadosReferencia.cidade || '',
        uf: dadosReferencia.uf || 'SC',
        cep: '',
        latitude: dadosReferencia.latitude,
        longitude: dadosReferencia.longitude,
        situacao: mapearStatusObra(dadosReferencia.status),
        data_inicio: dadosReferencia.data_inicio || new Date().toISOString().split('T')[0],
        data_prevista_conclusao: dadosReferencia.data_fim_prevista || new Date().toISOString().split('T')[0],
        data_real_conclusao: dadosReferencia.data_fim_real,
        valor_previsto: Number(dadosReferencia.valor_total) || 0,
        valor_executado: Number(dadosReferencia.valor_executado) || 0,
        valor_pago: Number(dadosReferencia.valor_executado) || 0,
        percentual_fisico: Number(dadosReferencia.percentual_executado) || 0,
        percentual_financeiro: Number(dadosReferencia.percentual_executado) || 0,
        contratos: dadosReferencia.contratos?.map((c: any) => ({
          numero_contrato: c.numero || '',
          valor_contratado: Number(c.valor_atualizado) || 0,
          valor_executado: Number(c.valor_executado) || 0,
        })) || [],
      };
      return obra;
      
    default:
      return dadosReferencia;
  }
}

function mapearModalidade(modalidade: string): string {
  const mapa: Record<string, string> = {
    'pregao_eletronico': 'PE',
    'pregao_presencial': 'PP',
    'concorrencia': 'CC',
    'tomada_precos': 'TP',
    'convite': 'CL',
    'dispensa': 'DL',
    'inexigibilidade': 'IN',
  };
  return mapa[modalidade?.toLowerCase()] || 'PE';
}

function mapearStatusMedicao(status: string): 'P' | 'A' | 'R' | 'C' {
  const mapa: Record<string, 'P' | 'A' | 'R' | 'C'> = {
    'pendente': 'P',
    'analise': 'P',
    'aprovado': 'A',
    'reprovado': 'R',
  };
  return mapa[status] || 'P';
}

function mapearStatusObra(status: string): 'P' | 'A' | 'C' | 'S' {
  const mapa: Record<string, 'P' | 'A' | 'C' | 'S'> = {
    'planejada': 'P',
    'andamento': 'A',
    'concluida': 'C',
    'paralisada': 'S',
  };
  return mapa[status] || 'P';
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

    // Montar payload conforme layout oficial TCE/SC 2025
    const dadosConvertidos = converterParaLayoutTCE(tipo, dadosReferencia);
    
    const payloadEnviado = {
      // Cabeçalho padrão TCE/SC
      versao_layout: '2.0.0',
      sistema_origem: 'SGOP-Gestão de Obras Públicas',
      cnpj_orgao: '00000000000000', // CNPJ do município
      nome_orgao: 'Prefeitura Municipal',
      uf: 'SC',
      tipo_envio: tipo,
      data_hora_envio: new Date().toISOString(),
      usuario_envio: user.email,
      
      // Dados no formato oficial TCE/SC
      dados: dadosConvertidos,
      
      // Metadados para auditoria
      metadados: {
        id_referencia_interna: referenciaId,
        hash_dados: generateHash(dadosConvertidos),
        ambiente: 'SIMULACAO', // Em produção: 'PRODUCAO'
      },
    };

    // Simular resposta do e-Sfinge/TCE conforme protocolo oficial
    // Em produção: const response = await fetch('https://esfinge.tce.sc.gov.br/api/v2/envios', {...})
    const protocolo = `TCESC${new Date().getFullYear()}${String(Date.now()).slice(-8)}`;
    const payloadResposta = {
      // Resposta padrão TCE/SC
      codigo_retorno: '00',
      mensagem_retorno: 'Dados recebidos e validados com sucesso',
      protocolo_tce: protocolo,
      data_hora_recebimento: new Date().toISOString(),
      numero_lote: `LOTE${Date.now()}`,
      
      // Validações realizadas pelo TCE
      validacoes: {
        validacao_estrutura: {
          status: 'APROVADO',
          mensagem: 'Estrutura do payload conforme layout 2.0.0',
        },
        validacao_campos: {
          status: 'APROVADO',
          mensagem: 'Todos os campos obrigatórios preenchidos',
          campos_validados: Object.keys(dadosConvertidos).length,
        },
        validacao_negocio: {
          status: 'APROVADO',
          mensagem: 'Regras de negócio validadas com sucesso',
        },
      },
      
      // Próximos passos
      orientacoes: [
        'O protocolo ' + protocolo + ' deve ser guardado para acompanhamento',
        'O processamento será concluído em até 24 horas',
        'Consulte o status em: https://esfinge.tce.sc.gov.br/consulta/' + protocolo,
        'Em caso de dúvidas, contate o TCE/SC através do e-mail: esfinge@tce.sc.gov.br',
      ],
      
      // Indicação de ambiente
      ambiente: 'SIMULACAO',
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
