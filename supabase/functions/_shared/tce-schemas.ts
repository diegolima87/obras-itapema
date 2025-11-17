/**
 * TCE/SC e-Sfinge 2025 - Schemas e Layouts Oficiais
 * 
 * Documentação completa dos payloads e validações conforme
 * Manual de Integração TCE/SC - Layout 2025
 * 
 * Referência: https://esfinge.tce.sc.gov.br/documentacao
 */

// ==================== CONTRATO ====================

export interface TCEContrato {
  // Identificação (OBRIGATÓRIO)
  exercicio: number;                    // Ano do exercício fiscal
  numero_contrato: string;              // Número único do contrato (max 50 chars)
  modalidade_licitacao: string;         // Código da modalidade TCE (ex: "TP", "CC", "PE")
  numero_processo: string;              // Número do processo licitatório
  
  // Objeto (OBRIGATÓRIO)
  objeto: string;                       // Descrição detalhada (max 8000 chars)
  tipo_objeto: 'O' | 'S' | 'C';        // O=Obra, S=Serviço, C=Compra
  
  // Datas (OBRIGATÓRIO)
  data_assinatura: string;              // YYYY-MM-DD
  data_inicio_vigencia: string;         // YYYY-MM-DD
  data_fim_vigencia: string;            // YYYY-MM-DD
  prazo_execucao_dias?: number;         // Prazo em dias
  
  // Valores (OBRIGATÓRIO)
  valor_inicial: number;                // Valor original do contrato
  valor_atualizado: number;             // Valor com aditivos
  
  // Fornecedor/Contratado (OBRIGATÓRIO)
  contratado: {
    tipo_pessoa: 'J' | 'F';            // J=Jurídica, F=Física
    cpf_cnpj: string;                  // Apenas números (11 ou 14 dígitos)
    nome_razao_social: string;         // max 200 chars
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    uf?: string;
    cep?: string;
  };
  
  // Origem dos Recursos
  recursos: Array<{
    fonte_recurso: string;             // Código da fonte (ex: "100", "101")
    valor: number;
    percentual: number;
  }>;
  
  // Classificações Orçamentárias
  classificacoes: Array<{
    orgao: string;
    unidade: string;
    funcao: string;
    subfuncao: string;
    programa: string;
    acao: string;
    natureza_despesa: string;
    valor: number;
  }>;
  
  // Garantia Contratual (OPCIONAL)
  garantia?: {
    tipo: string;                      // "C"=Caução, "S"=Seguro, "F"=Fiança
    valor: number;
    percentual: number;
  };
  
  // Publicação (OBRIGATÓRIO para alguns casos)
  publicacao?: {
    tipo_veiculo: string;              // "DO"=Diário Oficial, "JO"=Jornal
    nome_veiculo: string;
    data_publicacao: string;           // YYYY-MM-DD
  };
}

// ==================== ADITIVO ====================

export interface TCEAditivo {
  // Identificação (OBRIGATÓRIO)
  exercicio: number;
  numero_contrato: string;              // Referência ao contrato original
  numero_aditivo: string;               // Número sequencial (1, 2, 3...)
  tipo_aditivo: string;                 // "P"=Prazo, "V"=Valor, "Q"=Qualitativo, "M"=Misto
  
  // Datas (OBRIGATÓRIO)
  data_assinatura: string;
  data_publicacao?: string;
  
  // Alterações de Prazo
  prazo_prorrogacao_dias?: number;
  nova_data_fim_vigencia?: string;
  
  // Alterações de Valor
  valor_acrescimo?: number;
  valor_supressao?: number;
  valor_reajuste?: number;
  percentual_acrescimo?: number;
  percentual_supressao?: number;
  
  // Justificativa (OBRIGATÓRIO)
  justificativa: string;                // max 8000 chars
  fundamento_legal: string;             // Base legal para o aditivo
  
  // Novos Valores (se houver alteração)
  novo_valor_total?: number;
  novo_prazo_dias?: number;
}

// ==================== MEDIÇÃO/PAGAMENTO ====================

export interface TCEMedicao {
  // Identificação (OBRIGATÓRIO)
  exercicio: number;
  numero_contrato: string;
  numero_medicao: string;               // Sequencial ou identificador único
  
  // Período de Referência (OBRIGATÓRIO)
  mes_competencia: string;              // YYYY-MM
  data_inicio_periodo: string;          // YYYY-MM-DD
  data_fim_periodo: string;             // YYYY-MM-DD
  data_medicao: string;                 // Data da medição
  
  // Valores (OBRIGATÓRIO)
  valor_medido: number;                 // Valor desta medição
  valor_bruto: number;
  valor_retencoes: number;
  valor_liquido: number;
  percentual_executado: number;         // 0-100
  
  // Retenções e Descontos
  retencoes?: Array<{
    tipo: string;                       // "INSS", "IRRF", "ISS", "CSLL", etc.
    valor: number;
    percentual: number;
    codigo_receita?: string;
  }>;
  
  // Itens Medidos (OPCIONAL mas recomendado)
  itens?: Array<{
    item: string;                       // Código/número do item
    descricao: string;
    unidade: string;
    quantidade_prevista: number;
    quantidade_executada: number;
    quantidade_medida: number;          // Quantidade desta medição
    valor_unitario: number;
    valor_total: number;
  }>;
  
  // Status (OBRIGATÓRIO)
  situacao: 'P' | 'A' | 'R' | 'C';     // P=Pendente, A=Aprovada, R=Rejeitada, C=Cancelada
  data_aprovacao?: string;
  aprovado_por?: string;
  
  // Observações
  observacoes?: string;
}

// ==================== LIQUIDAÇÃO ====================

export interface TCELiquidacao {
  // Identificação (OBRIGATÓRIO)
  exercicio: number;
  numero_contrato: string;
  numero_medicao?: string;              // Referência à medição
  numero_empenho: string;               // Número do empenho
  numero_liquidacao: string;            // Número da liquidação
  
  // Data (OBRIGATÓRIO)
  data_liquidacao: string;              // YYYY-MM-DD
  
  // Valores (OBRIGATÓRIO)
  valor_liquidado: number;
  
  // Dados Orçamentários
  classificacao_orcamentaria?: {
    orgao: string;
    unidade: string;
    funcao: string;
    subfuncao: string;
    programa: string;
    acao: string;
    natureza_despesa: string;
  };
  
  // Observações
  observacoes?: string;
  historico?: string;
}

// ==================== SITUAÇÃO DE OBRA ====================

export interface TCESituacaoObra {
  // Identificação (OBRIGATÓRIO)
  exercicio: number;
  codigo_obra: string;                  // Código único da obra
  mes_referencia: string;               // YYYY-MM
  
  // Dados da Obra (OBRIGATÓRIO)
  nome: string;
  descricao: string;
  tipo_obra: string;                    // Código do tipo (EDF=Edificação, etc.)
  
  // Localização (OBRIGATÓRIO)
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  
  // Status e Execução (OBRIGATÓRIO)
  situacao: 'P' | 'A' | 'C' | 'S';     // P=Planejada, A=Andamento, C=Concluída, S=Suspensa
  data_inicio: string;
  data_prevista_conclusao: string;
  data_real_conclusao?: string;
  
  // Valores e Percentuais (OBRIGATÓRIO)
  valor_previsto: number;
  valor_executado: number;
  valor_pago: number;
  percentual_fisico: number;            // 0-100
  percentual_financeiro: number;        // 0-100
  
  // Responsáveis
  responsavel_tecnico?: {
    nome: string;
    cpf: string;
    registro_profissional: string;      // CREA, CAU, etc.
    numero_registro: string;
  };
  
  responsavel_fiscal?: {
    nome: string;
    cpf: string;
    matricula?: string;
  };
  
  // Contratos Vinculados
  contratos: Array<{
    numero_contrato: string;
    valor_contratado: number;
    valor_executado: number;
  }>;
  
  // Observações e Problemas
  observacoes?: string;
  problemas_encontrados?: string;
  acoes_corretivas?: string;
}

// ==================== FUNÇÕES DE VALIDAÇÃO ====================

export interface CampoObrigatorio {
  campo: string;
  nome: string;
  tipo: 'string' | 'number' | 'date' | 'array' | 'object';
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
}

export const CAMPOS_OBRIGATORIOS_CONTRATO: CampoObrigatorio[] = [
  { campo: 'exercicio', nome: 'Exercício', tipo: 'number', min: 2000, max: 2100 },
  { campo: 'numero_contrato', nome: 'Número do Contrato', tipo: 'string', maxLength: 50, minLength: 1 },
  { campo: 'modalidade_licitacao', nome: 'Modalidade de Licitação', tipo: 'string', maxLength: 10 },
  { campo: 'numero_processo', nome: 'Número do Processo', tipo: 'string', maxLength: 50 },
  { campo: 'objeto', nome: 'Objeto do Contrato', tipo: 'string', maxLength: 8000, minLength: 10 },
  { campo: 'tipo_objeto', nome: 'Tipo de Objeto', tipo: 'string', pattern: /^[OSC]$/ },
  { campo: 'data_assinatura', nome: 'Data de Assinatura', tipo: 'date' },
  { campo: 'data_inicio_vigencia', nome: 'Data de Início', tipo: 'date' },
  { campo: 'data_fim_vigencia', nome: 'Data de Fim', tipo: 'date' },
  { campo: 'valor_inicial', nome: 'Valor Inicial', tipo: 'number', min: 0.01 },
  { campo: 'valor_atualizado', nome: 'Valor Atualizado', tipo: 'number', min: 0.01 },
  { campo: 'contratado.tipo_pessoa', nome: 'Tipo de Pessoa', tipo: 'string', pattern: /^[JF]$/ },
  { campo: 'contratado.cpf_cnpj', nome: 'CPF/CNPJ', tipo: 'string', pattern: /^\d{11}$|^\d{14}$/ },
  { campo: 'contratado.nome_razao_social', nome: 'Nome/Razão Social', tipo: 'string', maxLength: 200, minLength: 3 },
];

export const CAMPOS_OBRIGATORIOS_MEDICAO: CampoObrigatorio[] = [
  { campo: 'exercicio', nome: 'Exercício', tipo: 'number', min: 2000, max: 2100 },
  { campo: 'numero_contrato', nome: 'Número do Contrato', tipo: 'string', maxLength: 50 },
  { campo: 'numero_medicao', nome: 'Número da Medição', tipo: 'string', maxLength: 50 },
  { campo: 'mes_competencia', nome: 'Mês de Competência', tipo: 'string', pattern: /^\d{4}-\d{2}$/ },
  { campo: 'data_medicao', nome: 'Data da Medição', tipo: 'date' },
  { campo: 'valor_medido', nome: 'Valor Medido', tipo: 'number', min: 0 },
  { campo: 'percentual_executado', nome: 'Percentual Executado', tipo: 'number', min: 0, max: 100 },
  { campo: 'situacao', nome: 'Situação', tipo: 'string', pattern: /^[PARC]$/ },
];

export const CAMPOS_OBRIGATORIOS_SITUACAO_OBRA: CampoObrigatorio[] = [
  { campo: 'exercicio', nome: 'Exercício', tipo: 'number', min: 2000, max: 2100 },
  { campo: 'codigo_obra', nome: 'Código da Obra', tipo: 'string', maxLength: 50 },
  { campo: 'mes_referencia', nome: 'Mês de Referência', tipo: 'string', pattern: /^\d{4}-\d{2}$/ },
  { campo: 'nome', nome: 'Nome da Obra', tipo: 'string', maxLength: 500, minLength: 5 },
  { campo: 'descricao', nome: 'Descrição', tipo: 'string', maxLength: 8000, minLength: 10 },
  { campo: 'municipio', nome: 'Município', tipo: 'string', maxLength: 100 },
  { campo: 'uf', nome: 'UF', tipo: 'string', pattern: /^[A-Z]{2}$/ },
  { campo: 'situacao', nome: 'Situação', tipo: 'string', pattern: /^[PACS]$/ },
  { campo: 'valor_previsto', nome: 'Valor Previsto', tipo: 'number', min: 0.01 },
  { campo: 'percentual_fisico', nome: 'Percentual Físico', tipo: 'number', min: 0, max: 100 },
];

// ==================== MODALIDADES DE LICITAÇÃO TCE/SC ====================

export const MODALIDADES_LICITACAO: Record<string, string> = {
  'CC': 'Concorrência',
  'TP': 'Tomada de Preços',
  'CL': 'Convite',
  'PE': 'Pregão Eletrônico',
  'PP': 'Pregão Presencial',
  'DL': 'Dispensa de Licitação',
  'IN': 'Inexigibilidade',
  'CR': 'Concurso',
  'LE': 'Leilão',
  'RDC': 'Regime Diferenciado de Contratação',
  'DI': 'Diálogo Competitivo',
};

// ==================== TIPOS DE OBRA TCE/SC ====================

export const TIPOS_OBRA: Record<string, string> = {
  'EDF': 'Edificação',
  'PAV': 'Pavimentação',
  'SAN': 'Saneamento',
  'DRE': 'Drenagem',
  'URB': 'Urbanização',
  'ENE': 'Energia',
  'TEL': 'Telecomunicações',
  'TRA': 'Transportes',
  'HID': 'Hidráulica',
  'AMB': 'Meio Ambiente',
  'OUT': 'Outros',
};

// ==================== FONTES DE RECURSO TCE/SC ====================

export const FONTES_RECURSO: Record<string, string> = {
  '100': 'Recursos Ordinários',
  '101': 'Recursos Vinculados - Educação',
  '102': 'Recursos Vinculados - Saúde',
  '103': 'Recursos Vinculados - Assistência Social',
  '150': 'Convênios - União',
  '151': 'Convênios - Estado',
  '200': 'Operações de Crédito',
  '250': 'Alienação de Bens',
  '300': 'Recursos Próprios',
};
