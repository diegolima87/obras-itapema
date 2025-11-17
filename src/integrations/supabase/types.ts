export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      aditivos: {
        Row: {
          contrato_id: string
          created_at: string | null
          data_assinatura: string
          id: string
          justificativa: string | null
          nova_data_vencimento: string | null
          numero: string
          prazo_aditado: number | null
          tenant_id: string | null
          tipo: string
          updated_at: string | null
          valor_aditado: number | null
        }
        Insert: {
          contrato_id: string
          created_at?: string | null
          data_assinatura: string
          id?: string
          justificativa?: string | null
          nova_data_vencimento?: string | null
          numero: string
          prazo_aditado?: number | null
          tenant_id?: string | null
          tipo: string
          updated_at?: string | null
          valor_aditado?: number | null
        }
        Update: {
          contrato_id?: string
          created_at?: string | null
          data_assinatura?: string
          id?: string
          justificativa?: string | null
          nova_data_vencimento?: string | null
          numero?: string
          prazo_aditado?: number | null
          tenant_id?: string | null
          tipo?: string
          updated_at?: string | null
          valor_aditado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aditivos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aditivos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      anexos_medicao: {
        Row: {
          arquivo_path: string | null
          created_at: string
          criado_por: string | null
          descricao: string | null
          id: string
          medicao_id: string
          mime_type: string | null
          nome_original: string | null
          tamanho: number | null
          tipo: string
          url: string
        }
        Insert: {
          arquivo_path?: string | null
          created_at?: string
          criado_por?: string | null
          descricao?: string | null
          id?: string
          medicao_id: string
          mime_type?: string | null
          nome_original?: string | null
          tamanho?: number | null
          tipo: string
          url: string
        }
        Update: {
          arquivo_path?: string | null
          created_at?: string
          criado_por?: string | null
          descricao?: string | null
          id?: string
          medicao_id?: string
          mime_type?: string | null
          nome_original?: string | null
          tamanho?: number | null
          tipo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexos_medicao_medicao_id_fkey"
            columns: ["medicao_id"]
            isOneToOne: false
            referencedRelation: "medicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_sistema: {
        Row: {
          chave: string
          descricao: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
          valor: string | null
        }
        Insert: {
          chave: string
          descricao?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          valor?: string | null
        }
        Update: {
          chave?: string
          descricao?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      contratos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data_assinatura: string
          data_vencimento: string
          fornecedor_id: string
          id: string
          modalidade: string
          numero: string
          objeto: string | null
          obra_id: string
          origem_recurso: string | null
          tenant_id: string | null
          updated_at: string | null
          valor_atualizado: number
          valor_inicial: number
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data_assinatura: string
          data_vencimento: string
          fornecedor_id: string
          id?: string
          modalidade: string
          numero: string
          objeto?: string | null
          obra_id: string
          origem_recurso?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_atualizado: number
          valor_inicial: number
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data_assinatura?: string
          data_vencimento?: string
          fornecedor_id?: string
          id?: string
          modalidade?: string
          numero?: string
          objeto?: string | null
          obra_id?: string
          origem_recurso?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_atualizado?: number
          valor_inicial?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          arquivo_path: string | null
          arquivo_url: string | null
          contrato_id: string | null
          created_at: string | null
          fornecedor_id: string | null
          id: string
          medicao_id: string | null
          mime_type: string | null
          nome: string
          nome_original: string | null
          obra_id: string | null
          tamanho: number | null
          tenant_id: string | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          arquivo_path?: string | null
          arquivo_url?: string | null
          contrato_id?: string | null
          created_at?: string | null
          fornecedor_id?: string | null
          id?: string
          medicao_id?: string | null
          mime_type?: string | null
          nome: string
          nome_original?: string | null
          obra_id?: string | null
          tamanho?: number | null
          tenant_id?: string | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          arquivo_path?: string | null
          arquivo_url?: string | null
          contrato_id?: string | null
          created_at?: string | null
          fornecedor_id?: string | null
          id?: string
          medicao_id?: string | null
          mime_type?: string | null
          nome?: string
          nome_original?: string | null
          obra_id?: string | null
          tamanho?: number | null
          tenant_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_medicao_id_fkey"
            columns: ["medicao_id"]
            isOneToOne: false
            referencedRelation: "medicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          ativo: boolean | null
          cep: string | null
          cidade: string | null
          cnpj: string
          created_at: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          cnpj: string
          created_at?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string
          created_at?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      integracao_esfinge_envios: {
        Row: {
          created_at: string | null
          dados: Json | null
          data_envio: string | null
          enviado_por: string | null
          id: string
          mensagem_erro: string | null
          resposta: Json | null
          status: Database["public"]["Enums"]["status_esfinge"] | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          dados?: Json | null
          data_envio?: string | null
          enviado_por?: string | null
          id?: string
          mensagem_erro?: string | null
          resposta?: Json | null
          status?: Database["public"]["Enums"]["status_esfinge"] | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          dados?: Json | null
          data_envio?: string | null
          enviado_por?: string | null
          id?: string
          mensagem_erro?: string | null
          resposta?: Json | null
          status?: Database["public"]["Enums"]["status_esfinge"] | null
          tipo?: string
        }
        Relationships: []
      }
      integracoes_tce: {
        Row: {
          created_at: string
          enviado_por: string | null
          id: string
          mensagem_erro: string | null
          payload_enviado: Json
          payload_resposta: Json | null
          protocolo: string | null
          referencia_id: string
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mensagem_erro?: string | null
          payload_enviado: Json
          payload_resposta?: Json | null
          protocolo?: string | null
          referencia_id: string
          status?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mensagem_erro?: string | null
          payload_enviado?: Json
          payload_resposta?: Json | null
          protocolo?: string | null
          referencia_id?: string
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      itens_obra: {
        Row: {
          codigo: string | null
          created_at: string | null
          descricao: string
          id: string
          obra_id: string
          percentual_executado: number | null
          quantidade_executada: number | null
          quantidade_total: number
          tenant_id: string | null
          unidade: string
          updated_at: string | null
          valor_total: number | null
          valor_unitario: number
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          descricao: string
          id?: string
          obra_id: string
          percentual_executado?: number | null
          quantidade_executada?: number | null
          quantidade_total: number
          tenant_id?: string | null
          unidade: string
          updated_at?: string | null
          valor_total?: number | null
          valor_unitario: number
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          descricao?: string
          id?: string
          obra_id?: string
          percentual_executado?: number | null
          quantidade_executada?: number | null
          quantidade_total?: number
          tenant_id?: string | null
          unidade?: string
          updated_at?: string | null
          valor_total?: number | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_obra_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_obra_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidacoes: {
        Row: {
          contrato_id: string | null
          created_at: string | null
          dados_esfinge: Json | null
          data_liquidacao: string
          id: string
          medicao_id: string | null
          numero_empenho: string
          numero_liquidacao: string
          observacoes: string | null
          tenant_id: string | null
          updated_at: string | null
          valor_liquidado: number
        }
        Insert: {
          contrato_id?: string | null
          created_at?: string | null
          dados_esfinge?: Json | null
          data_liquidacao: string
          id?: string
          medicao_id?: string | null
          numero_empenho: string
          numero_liquidacao: string
          observacoes?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_liquidado: number
        }
        Update: {
          contrato_id?: string | null
          created_at?: string | null
          dados_esfinge?: Json | null
          data_liquidacao?: string
          id?: string
          medicao_id?: string | null
          numero_empenho?: string
          numero_liquidacao?: string
          observacoes?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_liquidado?: number
        }
        Relationships: [
          {
            foreignKeyName: "liquidacoes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liquidacoes_medicao_id_fkey"
            columns: ["medicao_id"]
            isOneToOne: false
            referencedRelation: "medicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liquidacoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_auditoria: {
        Row: {
          acao: string
          created_at: string | null
          dados_antes: Json | null
          dados_depois: Json | null
          id: string
          registro_id: string
          tabela: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_antes?: Json | null
          dados_depois?: Json | null
          id?: string
          registro_id: string
          tabela: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_antes?: Json | null
          dados_depois?: Json | null
          id?: string
          registro_id?: string
          tabela?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      logs_importacao_tce: {
        Row: {
          created_at: string | null
          data_importacao: string
          detalhes: Json | null
          id: string
          mensagem_erro: string | null
          registros_atualizados: number | null
          registros_erros: number | null
          registros_importados: number | null
          status: string
          tempo_execucao_ms: number | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          data_importacao?: string
          detalhes?: Json | null
          id?: string
          mensagem_erro?: string | null
          registros_atualizados?: number | null
          registros_erros?: number | null
          registros_importados?: number | null
          status?: string
          tempo_execucao_ms?: number | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          data_importacao?: string
          detalhes?: Json | null
          id?: string
          mensagem_erro?: string | null
          registros_atualizados?: number | null
          registros_erros?: number | null
          registros_importados?: number | null
          status?: string
          tempo_execucao_ms?: number | null
          tipo?: string
        }
        Relationships: []
      }
      medicoes: {
        Row: {
          aprovado_por: string | null
          competencia: string | null
          contrato_id: string
          created_at: string | null
          criado_por: string | null
          data_aprovacao: string | null
          data_envio: string | null
          descricao: string | null
          etapa: string | null
          fornecedor_id: string
          id: string
          numero_medicao: string
          obra_id: string
          observacoes: string | null
          percentual_executado: number | null
          percentual_financeiro: number | null
          percentual_fisico: number | null
          status: Database["public"]["Enums"]["status_medicao"] | null
          tenant_id: string | null
          updated_at: string | null
          valor_executado: number | null
          valor_medido: number | null
        }
        Insert: {
          aprovado_por?: string | null
          competencia?: string | null
          contrato_id: string
          created_at?: string | null
          criado_por?: string | null
          data_aprovacao?: string | null
          data_envio?: string | null
          descricao?: string | null
          etapa?: string | null
          fornecedor_id: string
          id?: string
          numero_medicao: string
          obra_id: string
          observacoes?: string | null
          percentual_executado?: number | null
          percentual_financeiro?: number | null
          percentual_fisico?: number | null
          status?: Database["public"]["Enums"]["status_medicao"] | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_executado?: number | null
          valor_medido?: number | null
        }
        Update: {
          aprovado_por?: string | null
          competencia?: string | null
          contrato_id?: string
          created_at?: string | null
          criado_por?: string | null
          data_aprovacao?: string | null
          data_envio?: string | null
          descricao?: string | null
          etapa?: string | null
          fornecedor_id?: string
          id?: string
          numero_medicao?: string
          obra_id?: string
          observacoes?: string | null
          percentual_executado?: number | null
          percentual_financeiro?: number | null
          percentual_fisico?: number | null
          status?: Database["public"]["Enums"]["status_medicao"] | null
          tenant_id?: string | null
          updated_at?: string | null
          valor_executado?: number | null
          valor_medido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medicoes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      medicoes_itens: {
        Row: {
          created_at: string | null
          id: string
          item_obra_id: string
          medicao_id: string
          quantidade_executada: number
          quantidade_prevista: number | null
          valor_executado: number
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_obra_id: string
          medicao_id: string
          quantidade_executada: number
          quantidade_prevista?: number | null
          valor_executado: number
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_obra_id?: string
          medicao_id?: string
          quantidade_executada?: number
          quantidade_prevista?: number | null
          valor_executado?: number
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medicoes_itens_item_obra_id_fkey"
            columns: ["item_obra_id"]
            isOneToOne: false
            referencedRelation: "itens_obra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicoes_itens_medicao_id_fkey"
            columns: ["medicao_id"]
            isOneToOne: false
            referencedRelation: "medicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          bairro: string | null
          cidade: string | null
          created_at: string | null
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio: string | null
          descricao: string | null
          endereco: string | null
          engenheiro_fiscal_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          percentual_executado: number | null
          publico_portal: boolean | null
          status: Database["public"]["Enums"]["status_obra"] | null
          tenant_id: string | null
          tipo_obra: string | null
          uf: string | null
          unidade_gestora: string
          updated_at: string | null
          valor_executado: number | null
          valor_total: number | null
        }
        Insert: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          endereco?: string | null
          engenheiro_fiscal_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          percentual_executado?: number | null
          publico_portal?: boolean | null
          status?: Database["public"]["Enums"]["status_obra"] | null
          tenant_id?: string | null
          tipo_obra?: string | null
          uf?: string | null
          unidade_gestora: string
          updated_at?: string | null
          valor_executado?: number | null
          valor_total?: number | null
        }
        Update: {
          bairro?: string | null
          cidade?: string | null
          created_at?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          endereco?: string | null
          engenheiro_fiscal_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          percentual_executado?: number | null
          publico_portal?: boolean | null
          status?: Database["public"]["Enums"]["status_obra"] | null
          tenant_id?: string | null
          tipo_obra?: string | null
          uf?: string | null
          unidade_gestora?: string
          updated_at?: string | null
          valor_executado?: number | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          contrato_id: string
          created_at: string | null
          data_pagamento: string | null
          data_prevista: string | null
          fornecedor_id: string
          id: string
          medicao_id: string
          numero_empenho: string | null
          observacoes: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          contrato_id: string
          created_at?: string | null
          data_pagamento?: string | null
          data_prevista?: string | null
          fornecedor_id: string
          id?: string
          medicao_id: string
          numero_empenho?: string | null
          observacoes?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor: number
        }
        Update: {
          contrato_id?: string
          created_at?: string | null
          data_pagamento?: string | null
          data_prevista?: string | null
          fornecedor_id?: string
          id?: string
          medicao_id?: string
          numero_empenho?: string | null
          observacoes?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_medicao_id_fkey"
            columns: ["medicao_id"]
            isOneToOne: false
            referencedRelation: "medicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          crea: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          crea?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          telefone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          crea?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          ativo: boolean | null
          cnpj: string
          cor_destaque: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          created_at: string | null
          data_contratacao: string | null
          dominio_customizado: string | null
          email: string
          endereco: string | null
          exigir_aprovacao: boolean | null
          favicon_url: string | null
          id: string
          logo_dark_url: string | null
          logo_url: string | null
          mostrar_fornecedores: boolean | null
          mostrar_valores: boolean | null
          nome_municipio: string
          nome_sistema: string | null
          permitir_comentarios: boolean | null
          plano: Database["public"]["Enums"]["plano_tenant"] | null
          portal_ativo: boolean | null
          slug: string
          subdominio: string
          telefone: string | null
          uf: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj: string
          cor_destaque?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string | null
          data_contratacao?: string | null
          dominio_customizado?: string | null
          email: string
          endereco?: string | null
          exigir_aprovacao?: boolean | null
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_url?: string | null
          mostrar_fornecedores?: boolean | null
          mostrar_valores?: boolean | null
          nome_municipio: string
          nome_sistema?: string | null
          permitir_comentarios?: boolean | null
          plano?: Database["public"]["Enums"]["plano_tenant"] | null
          portal_ativo?: boolean | null
          slug: string
          subdominio: string
          telefone?: string | null
          uf: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string
          cor_destaque?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string | null
          data_contratacao?: string | null
          dominio_customizado?: string | null
          email?: string
          endereco?: string | null
          exigir_aprovacao?: boolean | null
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_url?: string | null
          mostrar_fornecedores?: boolean | null
          mostrar_valores?: boolean | null
          nome_municipio?: string
          nome_sistema?: string | null
          permitir_comentarios?: boolean | null
          plano?: Database["public"]["Enums"]["plano_tenant"] | null
          portal_ativo?: boolean | null
          slug?: string
          subdominio?: string
          telefone?: string | null
          uf?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: { user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "gestor" | "fiscal" | "fornecedor" | "cidadao"
      plano_tenant: "basico" | "premium" | "enterprise"
      status_esfinge: "pendente" | "processando" | "enviado" | "erro"
      status_medicao: "pendente" | "analise" | "aprovado" | "reprovado"
      status_obra: "planejada" | "andamento" | "concluida" | "paralisada"
      tipo_documento:
        | "contrato"
        | "aditivo"
        | "medicao"
        | "pagamento"
        | "projeto"
        | "foto"
        | "outro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gestor", "fiscal", "fornecedor", "cidadao"],
      plano_tenant: ["basico", "premium", "enterprise"],
      status_esfinge: ["pendente", "processando", "enviado", "erro"],
      status_medicao: ["pendente", "analise", "aprovado", "reprovado"],
      status_obra: ["planejada", "andamento", "concluida", "paralisada"],
      tipo_documento: [
        "contrato",
        "aditivo",
        "medicao",
        "pagamento",
        "projeto",
        "foto",
        "outro",
      ],
    },
  },
} as const
