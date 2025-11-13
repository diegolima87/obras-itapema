export const mockObras = [
  {
    id: "1",
    nome: "Pavimentação da Rua das Flores",
    descricao: "Pavimentação asfáltica com drenagem",
    endereco: "Rua das Flores, 1000 - Centro",
    latitude: -27.5954,
    longitude: -48.5480,
    status: "andamento",
    unidade_gestora: "Secretaria de Obras",
    engenheiro_id: "eng1",
    engenheiro_nome: "João Silva",
    valor_total: 850000,
    data_inicio: "2024-01-15",
    data_fim_prevista: "2024-12-30",
    percentual_executado: 45,
  },
  {
    id: "2",
    nome: "Construção de Creche Municipal",
    descricao: "Construção de creche para 200 crianças",
    endereco: "Av. Principal, 2500 - Bairro Novo",
    latitude: -27.6000,
    longitude: -48.5500,
    status: "planejada",
    unidade_gestora: "Secretaria de Educação",
    engenheiro_id: "eng2",
    engenheiro_nome: "Maria Santos",
    valor_total: 1200000,
    data_inicio: "2024-06-01",
    data_fim_prevista: "2025-12-31",
    percentual_executado: 0,
  },
  {
    id: "3",
    nome: "Reforma da Praça Central",
    descricao: "Revitalização completa com paisagismo",
    endereco: "Praça Central - Centro",
    latitude: -27.5920,
    longitude: -48.5460,
    status: "concluida",
    unidade_gestora: "Secretaria de Urbanismo",
    engenheiro_id: "eng1",
    engenheiro_nome: "João Silva",
    valor_total: 350000,
    data_inicio: "2023-03-01",
    data_fim_prevista: "2023-11-30",
    data_fim_real: "2023-11-28",
    percentual_executado: 100,
  },
];

export const mockContratos = [
  {
    id: "1",
    obra_id: "1",
    numero: "001/2024",
    modalidade: "Tomada de Preços",
    fornecedor_id: "f1",
    fornecedor_nome: "Construtora ABC Ltda",
    valor_inicial: 850000,
    valor_atualizado: 850000,
    data_assinatura: "2024-01-10",
    data_vencimento: "2024-12-31",
    origem_recurso: "Recursos Próprios",
  },
  {
    id: "2",
    obra_id: "3",
    numero: "045/2023",
    modalidade: "Pregão Eletrônico",
    fornecedor_id: "f2",
    fornecedor_nome: "Obras & Cia",
    valor_inicial: 350000,
    valor_atualizado: 350000,
    data_assinatura: "2023-02-20",
    data_vencimento: "2023-12-31",
    origem_recurso: "Convênio Estadual",
  },
];

export const mockFornecedores = [
  {
    id: "f1",
    nome: "Construtora ABC Ltda",
    cnpj: "12.345.678/0001-90",
    email: "contato@abcconstrutora.com.br",
    telefone: "(48) 3333-4444",
    endereco: "Rua das Empresas, 100",
  },
  {
    id: "f2",
    nome: "Obras & Cia",
    cnpj: "98.765.432/0001-10",
    email: "obras@obrasecia.com.br",
    telefone: "(48) 3333-5555",
    endereco: "Av. Industrial, 500",
  },
];

export const mockMedicoes = [
  {
    id: "1",
    obra_id: "1",
    fornecedor_id: "f1",
    numero_medicao: "001/2024",
    etapa: "Primeira Medição",
    descricao: "Serviços de terraplanagem e drenagem",
    percentual_executado: 25,
    valor_executado: 212500,
    status: "aprovado",
    data_envio: "2024-03-15",
    data_aprovacao: "2024-03-20",
  },
  {
    id: "2",
    obra_id: "1",
    fornecedor_id: "f1",
    numero_medicao: "002/2024",
    etapa: "Segunda Medição",
    descricao: "Pavimentação asfáltica - 1ª camada",
    percentual_executado: 20,
    valor_executado: 170000,
    status: "pendente",
    data_envio: "2024-05-10",
  },
];

export const mockUsuarios = [
  {
    id: "user1",
    nome: "Admin Sistema",
    email: "admin@prefeitura.sc.gov.br",
    perfil: "Administrador",
  },
  {
    id: "eng1",
    nome: "João Silva",
    email: "joao.silva@prefeitura.sc.gov.br",
    perfil: "Engenheiro/Fiscal",
  },
  {
    id: "eng2",
    nome: "Maria Santos",
    email: "maria.santos@prefeitura.sc.gov.br",
    perfil: "Engenheiro/Fiscal",
  },
];

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