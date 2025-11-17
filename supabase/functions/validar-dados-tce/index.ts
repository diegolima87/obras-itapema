import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import {
  CAMPOS_OBRIGATORIOS_CONTRATO,
  CAMPOS_OBRIGATORIOS_MEDICAO,
  CAMPOS_OBRIGATORIOS_SITUACAO_OBRA,
  type CampoObrigatorio,
} from '../_shared/tce-schemas.ts';
import { validarCPF, validarCNPJ, validarData, validarDataPosterior, limparCPFCNPJ } from '../_shared/utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidacaoRequest {
  tipo: 'contrato' | 'aditivo' | 'medicao' | 'situacao_obra';
  ids: string[];
}

interface ErroValidacao {
  campo: string;
  mensagem: string;
  nivel: 'erro' | 'aviso';
}

interface ResultadoValidacao {
  id: string;
  valido: boolean;
  erros: ErroValidacao[];
  avisos: ErroValidacao[];
}

/**
 * Valida campos obrigatórios conforme schema TCE/SC
 */
function validarCamposObrigatorios(
  dados: any,
  campos: CampoObrigatorio[],
  erros: ErroValidacao[]
): void {
  for (const campo of campos) {
    const valor = getNestedValue(dados, campo.campo);
    
    // Verificar se existe
    if (valor === null || valor === undefined || valor === '') {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} é obrigatório`,
        nivel: 'erro',
      });
      continue;
    }
    
    // Validar tipo
    if (campo.tipo === 'string' && typeof valor !== 'string') {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} deve ser um texto`,
        nivel: 'erro',
      });
      continue;
    }
    
    if (campo.tipo === 'number' && typeof valor !== 'number') {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} deve ser um número`,
        nivel: 'erro',
      });
      continue;
    }
    
    // Validar tamanho de string
    if (campo.tipo === 'string' && campo.maxLength && valor.length > campo.maxLength) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} excede o tamanho máximo de ${campo.maxLength} caracteres`,
        nivel: 'erro',
      });
    }
    
    if (campo.tipo === 'string' && campo.minLength && valor.length < campo.minLength) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} deve ter no mínimo ${campo.minLength} caracteres`,
        nivel: 'erro',
      });
    }
    
    // Validar pattern
    if (campo.pattern && !campo.pattern.test(valor)) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} não está no formato válido`,
        nivel: 'erro',
      });
    }
    
    // Validar range numérico
    if (campo.tipo === 'number' && campo.min !== undefined && valor < campo.min) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} deve ser maior ou igual a ${campo.min}`,
        nivel: 'erro',
      });
    }
    
    if (campo.tipo === 'number' && campo.max !== undefined && valor > campo.max) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} deve ser menor ou igual a ${campo.max}`,
        nivel: 'erro',
      });
    }
    
    // Validar data
    if (campo.tipo === 'date' && !validarData(valor)) {
      erros.push({
        campo: campo.campo,
        mensagem: `${campo.nome} não é uma data válida (formato esperado: YYYY-MM-DD)`,
        nivel: 'erro',
      });
    }
  }
}

/**
 * Obtém valor aninhado de um objeto usando notação de ponto
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Sem autorização');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { tipo, ids }: ValidacaoRequest = await req.json();

    console.log(`Validando ${ids.length} registro(s) do tipo ${tipo}`);

    const resultados: ResultadoValidacao[] = [];

    for (const id of ids) {
      const erros: ErroValidacao[] = [];
      const avisos: ErroValidacao[] = [];

      if (tipo === 'contrato') {
        const { data: contrato } = await supabase
          .from('contratos')
          .select('*, obra:obras(*), fornecedor:fornecedores(*)')
          .eq('id', id)
          .single();

        if (!contrato) {
          erros.push({ campo: 'geral', mensagem: 'Contrato não encontrado', nivel: 'erro' });
        } else {
          // Validações obrigatórias
          if (!contrato.numero) {
            erros.push({ campo: 'numero', mensagem: 'Número do contrato é obrigatório', nivel: 'erro' });
          }
          if (!contrato.objeto) {
            erros.push({ campo: 'objeto', mensagem: 'Objeto do contrato é obrigatório', nivel: 'erro' });
          }
          if (!contrato.modalidade) {
            erros.push({ campo: 'modalidade', mensagem: 'Modalidade é obrigatória', nivel: 'erro' });
          }
          if (!contrato.data_assinatura) {
            erros.push({ campo: 'data_assinatura', mensagem: 'Data de assinatura é obrigatória', nivel: 'erro' });
          }
          if (!contrato.data_vencimento) {
            erros.push({ campo: 'data_vencimento', mensagem: 'Data de vencimento é obrigatória', nivel: 'erro' });
          }
          if (!contrato.valor_inicial || contrato.valor_inicial <= 0) {
            erros.push({ campo: 'valor_inicial', mensagem: 'Valor inicial deve ser maior que zero', nivel: 'erro' });
          }
          
          // Validações de fornecedor
          if (!contrato.fornecedor?.cnpj) {
            erros.push({ campo: 'fornecedor.cnpj', mensagem: 'CNPJ do fornecedor é obrigatório', nivel: 'erro' });
          } else if (!/^\d{14}$/.test(contrato.fornecedor.cnpj.replace(/\D/g, ''))) {
            erros.push({ campo: 'fornecedor.cnpj', mensagem: 'CNPJ do fornecedor inválido', nivel: 'erro' });
          }
          
          // Avisos
          if (!contrato.origem_recurso) {
            avisos.push({ campo: 'origem_recurso', mensagem: 'Origem do recurso não informada', nivel: 'aviso' });
          }
          
          // Validação de datas
          const dataAssinatura = new Date(contrato.data_assinatura);
          const dataVencimento = new Date(contrato.data_vencimento);
          if (dataVencimento <= dataAssinatura) {
            erros.push({ campo: 'data_vencimento', mensagem: 'Data de vencimento deve ser posterior à assinatura', nivel: 'erro' });
          }
        }
      } else if (tipo === 'medicao') {
        const { data: medicao } = await supabase
          .from('medicoes')
          .select('*, obra:obras(*), contrato:contratos(*), fornecedor:fornecedores(*)')
          .eq('id', id)
          .single();

        if (!medicao) {
          erros.push({ campo: 'geral', mensagem: 'Medição não encontrada', nivel: 'erro' });
        } else {
          // Validações obrigatórias
          if (!medicao.numero_medicao) {
            erros.push({ campo: 'numero_medicao', mensagem: 'Número da medição é obrigatório', nivel: 'erro' });
          }
          if (!medicao.competencia) {
            erros.push({ campo: 'competencia', mensagem: 'Competência é obrigatória', nivel: 'erro' });
          }
          if (!medicao.valor_medido || medicao.valor_medido <= 0) {
            erros.push({ campo: 'valor_medido', mensagem: 'Valor medido deve ser maior que zero', nivel: 'erro' });
          }
          if (medicao.percentual_fisico < 0 || medicao.percentual_fisico > 100) {
            erros.push({ campo: 'percentual_fisico', mensagem: 'Percentual físico deve estar entre 0 e 100', nivel: 'erro' });
          }
          
          // Validar status
          if (medicao.status !== 'aprovado') {
            avisos.push({ campo: 'status', mensagem: 'Medição ainda não foi aprovada', nivel: 'aviso' });
          }
          
          // Verificar itens da medição
          const { data: itens } = await supabase
            .from('medicoes_itens')
            .select('*')
            .eq('medicao_id', id);
          
          if (!itens || itens.length === 0) {
            erros.push({ campo: 'itens', mensagem: 'Medição deve ter pelo menos um item', nivel: 'erro' });
          }
        }
      } else if (tipo === 'situacao_obra') {
        const { data: obra } = await supabase
          .from('obras')
          .select('*')
          .eq('id', id)
          .single();

        if (!obra) {
          erros.push({ campo: 'geral', mensagem: 'Obra não encontrada', nivel: 'erro' });
        } else {
          // Validações obrigatórias
          if (!obra.nome) {
            erros.push({ campo: 'nome', mensagem: 'Nome da obra é obrigatório', nivel: 'erro' });
          }
          if (!obra.unidade_gestora) {
            erros.push({ campo: 'unidade_gestora', mensagem: 'Unidade gestora é obrigatória', nivel: 'erro' });
          }
          if (!obra.endereco) {
            avisos.push({ campo: 'endereco', mensagem: 'Endereço não informado', nivel: 'aviso' });
          }
          if (!obra.data_inicio) {
            erros.push({ campo: 'data_inicio', mensagem: 'Data de início é obrigatória', nivel: 'erro' });
          }
          if (!obra.valor_total || obra.valor_total <= 0) {
            erros.push({ campo: 'valor_total', mensagem: 'Valor total deve ser maior que zero', nivel: 'erro' });
          }
          if (!obra.latitude || !obra.longitude) {
            avisos.push({ campo: 'localizacao', mensagem: 'Localização geográfica não informada', nivel: 'aviso' });
          }
        }
      }

      resultados.push({
        id,
        valido: erros.length === 0,
        erros,
        avisos,
      });
    }

    const totalValidos = resultados.filter(r => r.valido).length;
    const totalInvalidos = resultados.filter(r => !r.valido).length;

    return new Response(
      JSON.stringify({
        success: true,
        totalRegistros: ids.length,
        totalValidos,
        totalInvalidos,
        resultados,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na validação:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
