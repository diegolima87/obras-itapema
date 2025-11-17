export interface Obra {
  id: string;
  nome: string;
  descricao: string;
  status: "planejada" | "andamento" | "concluida" | "paralisada";
  unidade_gestora: string;
  engenheiro_nome: string;
  engenheiro_id: string;
  valor_total: number;
  percentual_executado: number;
  data_inicio?: string;
  data_previsao_termino?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  tipo_obra?: string;
  publico_portal?: boolean;
  coordenadas_fonte?: 'google' | 'nominatim' | 'cidade_aproximada' | 'manual' | 'desconhecida';
}

export interface ItemObra {
  id: string;
  obra_id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade_contratada: number;
  quantidade_executada: number;
  valor_unitario: number;
  valor_total: number;
}

export interface Medicao {
  id: string;
  obra_id: string;
  numero: number;
  data: string;
  status: "pendente" | "em_analise" | "aprovada" | "reprovada";
  valor: number;
  percentual: number;
  observacoes?: string;
}

export interface Aditivo {
  id: string;
  obra_id: string;
  numero: number;
  tipo: "prazo" | "valor" | "ambos";
  data: string;
  valor_adicional?: number;
  prazo_adicional?: number;
  justificativa: string;
}

export interface DocumentoObra {
  id: string;
  obra_id: string;
  tipo: string;
  nome: string;
  url: string;
  data_upload: string;
  validade?: string;
}

export interface FotoObra {
  id: string;
  obra_id: string;
  url: string;
  legenda?: string;
  data: string;
}

export interface HistoricoObra {
  id: string;
  obra_id: string;
  data: string;
  usuario: string;
  acao: string;
  detalhes?: string;
}
