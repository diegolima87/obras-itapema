// UI Constants - Status Colors and Labels

export const statusColors = {
  planejada: "bg-muted text-muted-foreground",
  andamento: "bg-primary text-primary-foreground",
  concluida: "bg-success text-success-foreground",
  paralisada: "bg-destructive text-destructive-foreground",
};

export const statusLabels = {
  planejada: "Planejada",
  andamento: "Em Andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

export const medicaoStatusColors = {
  pendente: "bg-warning text-warning-foreground",
  analise: "bg-muted text-muted-foreground",
  aprovado: "bg-success text-success-foreground",
  reprovado: "bg-destructive text-destructive-foreground",
};

export const medicaoStatusLabels = {
  pendente: "Pendente",
  analise: "Em Análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export const modalidadesContrato = [
  "Pregão Eletrônico",
  "Pregão Presencial",
  "Tomada de Preços",
  "Concorrência Pública",
  "Dispensa de Licitação",
  "Inexigibilidade",
  "RDC",
];

export const tiposObra = [
  "Infraestrutura",
  "Educação",
  "Saúde",
  "Urbanismo",
  "Habitação",
  "Meio Ambiente",
  "Transporte",
  "Saneamento",
  "Cultura",
  "Esporte",
];

export const unidadesMedida = [
  "m",
  "m²",
  "m³",
  "km",
  "un",
  "cx",
  "sc",
  "kg",
  "t",
  "pç",
  "vb",
  "cj",
];

export const origensRecurso = [
  "Recursos Próprios",
  "Convênio Federal",
  "Convênio Estadual",
  "Financiamento",
  "Emenda Parlamentar",
  "Operação de Crédito",
];

export const tiposAditivo = [
  "prazo",
  "valor",
  "ambos",
];

export const statusPagamento = [
  "pendente",
  "empenhado",
  "liquidado",
  "pago",
  "cancelado",
];
