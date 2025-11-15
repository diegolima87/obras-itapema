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
        ]
      }
      documentos: {
        Row: {
          contrato_id: string | null
          created_at: string | null
          id: string
          medicao_id: string | null
          nome: string
          obra_id: string | null
          tamanho: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by: string | null
          url: string
        }
        Insert: {
          contrato_id?: string | null
          created_at?: string | null
          id?: string
          medicao_id?: string | null
          nome: string
          obra_id?: string | null
          tamanho?: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by?: string | null
          url: string
        }
        Update: {
          contrato_id?: string | null
          created_at?: string | null
          id?: string
          medicao_id?: string | null
          nome?: string
          obra_id?: string | null
          tamanho?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento"]
          uploaded_by?: string | null
          url?: string
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
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      medicoes: {
        Row: {
          aprovado_por: string | null
          contrato_id: string
          created_at: string | null
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
          status: Database["public"]["Enums"]["status_medicao"] | null
          updated_at: string | null
          valor_executado: number | null
        }
        Insert: {
          aprovado_por?: string | null
          contrato_id: string
          created_at?: string | null
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
          status?: Database["public"]["Enums"]["status_medicao"] | null
          updated_at?: string | null
          valor_executado?: number | null
        }
        Update: {
          aprovado_por?: string | null
          contrato_id?: string
          created_at?: string | null
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
          status?: Database["public"]["Enums"]["status_medicao"] | null
          updated_at?: string | null
          valor_executado?: number | null
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
        ]
      }
      medicoes_itens: {
        Row: {
          created_at: string | null
          id: string
          item_obra_id: string
          medicao_id: string
          quantidade_executada: number
          valor_executado: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_obra_id: string
          medicao_id: string
          quantidade_executada: number
          valor_executado: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_obra_id?: string
          medicao_id?: string
          quantidade_executada?: number
          valor_executado?: number
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
          tipo_obra: string | null
          unidade_gestora: string
          updated_at: string | null
          valor_executado: number | null
          valor_total: number | null
        }
        Insert: {
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
          tipo_obra?: string | null
          unidade_gestora: string
          updated_at?: string | null
          valor_executado?: number | null
          valor_total?: number | null
        }
        Update: {
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
          tipo_obra?: string | null
          unidade_gestora?: string
          updated_at?: string | null
          valor_executado?: number | null
          valor_total?: number | null
        }
        Relationships: []
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
