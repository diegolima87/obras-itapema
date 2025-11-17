# Guia de Multi-Tenancy

## ⚠️ Regras Críticas de Segurança

### NUNCA:
1. ❌ **NUNCA** busque dados sem filtrar por `tenant_id`
2. ❌ **NUNCA** use dados mockados em produção
3. ❌ **NUNCA** confie apenas no RLS - sempre filtre explicitamente
4. ❌ **NUNCA** exponha dados de um tenant para outro

### SEMPRE:
1. ✅ **SEMPRE** use `useCurrentTenant()` ou `useTenant()` nos componentes
2. ✅ **SEMPRE** inclua `tenant_id` ao inserir dados
3. ✅ **SEMPRE** filtre queries por `tenant_id` nos hooks
4. ✅ **SEMPRE** teste com múltiplos tenants antes de deploy
5. ✅ **SEMPRE** valide que o usuário tem acesso ao tenant

---

## 📚 Arquitetura

### Contexto de Tenant
O `TenantContext` (`src/contexts/TenantContext.tsx`) identifica o tenant atual baseado em:
- Hostname (subdomínio ou domínio customizado)
- Fallback para 'itampema' em desenvolvimento

### Hook Centralizado
`useCurrentTenant()` (`src/hooks/useCurrentTenant.ts`) retorna:
```typescript
{
  tenant_id: string | null
}
```

---

## 🔧 Padrão de Implementação

### 1. Criando Hooks de Dados

**Template para hooks de leitura:**
```typescript
export const useMinhaTabela = () => {
  return useQuery({
    queryKey: ["minha-tabela"],
    queryFn: async () => {
      // 1. Buscar usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // 2. Buscar tenant_id do perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.tenant_id) return [];
      
      // 3. Buscar dados filtrando por tenant_id
      const { data, error } = await supabase
        .from("minha_tabela")
        .select("*")
        .eq("tenant_id", profile.tenant_id) // ✅ FILTRO CRÍTICO
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
```

**Template para hooks de escrita:**
```typescript
export const useCriarRegistro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoRegistro: Omit<Registro, "id" | "created_at">) => {
      // ⚠️ IMPORTANTE: A UI deve passar o tenant_id
      const { data, error } = await supabase
        .from("minha_tabela")
        .insert(novoRegistro) // Deve incluir tenant_id
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minha-tabela"] });
      toast.success("Registro criado com sucesso");
    },
  });
};
```

---

### 2. Usando nos Componentes

**Exemplo de formulário de criação:**
```typescript
import { useTenant } from "@/contexts/TenantContext";
import { useCriarObra } from "@/hooks/useObras";

export default function NovaObra() {
  const { tenant } = useTenant();
  const criarObra = useCriarObra();

  const handleSubmit = async (values: FormData) => {
    if (!tenant?.id) {
      toast.error("Erro: Tenant não identificado");
      return;
    }

    await criarObra.mutateAsync({
      ...values,
      tenant_id: tenant.id, // ✅ SEMPRE INCLUIR
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos do formulário */}
    </form>
  );
}
```

**Exemplo de listagem:**
```typescript
import { useObras } from "@/hooks/useObras";

export default function ListaObras() {
  // O hook já filtra por tenant_id automaticamente
  const { data: obras, isLoading } = useObras();

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {obras?.map(obra => (
        <ObraCard key={obra.id} obra={obra} />
      ))}
    </div>
  );
}
```

---

## 🔒 RLS (Row Level Security)

### Políticas Padrão

**Para leitura:**
```sql
CREATE POLICY "Users can view records from their tenant"
ON public.minha_tabela
FOR SELECT
USING (
  tenant_id = (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);
```

**Para inserção:**
```sql
CREATE POLICY "Users can insert records in their tenant"
ON public.minha_tabela
FOR INSERT
WITH CHECK (
  tenant_id = (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);
```

**Para admins:**
```sql
CREATE POLICY "Admins can manage all records in their tenant"
ON public.minha_tabela
FOR ALL
USING (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'gestor'::app_role))
  AND tenant_id = (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);
```

---

## 🧪 Testes de Isolamento

### Checklist de Validação:
1. ✅ Criar dois usuários em tenants diferentes
2. ✅ Cada usuário cria dados (obras, contratos, medições)
3. ✅ Verificar que usuário A NÃO vê dados do usuário B
4. ✅ Verificar Dashboard mostra apenas dados do tenant
5. ✅ Verificar todas as listagens (obras, contratos, medições)
6. ✅ Tentar acessar diretamente um ID de outro tenant via URL (deve falhar)
7. ✅ Verificar que inserções incluem o tenant_id correto

### Script SQL para Validação:
```sql
-- Verificar se há dados sem tenant_id
SELECT 'obras' as tabela, COUNT(*) as registros_sem_tenant
FROM obras WHERE tenant_id IS NULL
UNION ALL
SELECT 'contratos', COUNT(*) FROM contratos WHERE tenant_id IS NULL
UNION ALL
SELECT 'medicoes', COUNT(*) FROM medicoes WHERE tenant_id IS NULL;

-- Listar usuários e seus tenants
SELECT 
  p.id,
  p.nome,
  p.email,
  t.nome_municipio,
  t.id as tenant_id
FROM profiles p
LEFT JOIN tenants t ON t.id = p.tenant_id
ORDER BY t.nome_municipio, p.nome;
```

---

## 🐛 Debugging

### Componente de Debug (DEV ONLY)
Adicione ao Dashboard em desenvolvimento:

```typescript
import { useCurrentTenant } from "@/hooks/useCurrentTenant";
import { useTenant } from "@/contexts/TenantContext";

export function TenantDebugInfo() {
  const { data: currentTenant } = useCurrentTenant();
  const { tenant } = useTenant();
  const { data: obras } = useObras();
  const { data: contratos } = useContratos();

  return (
    <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle>🔒 Multi-Tenancy Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Tenant (Context):</strong> {tenant?.nome_municipio} ({tenant?.id})</p>
        <p><strong>Tenant ID (User Profile):</strong> {currentTenant?.tenant_id}</p>
        <p><strong>Obras visíveis:</strong> {obras?.length || 0}</p>
        <p><strong>Contratos visíveis:</strong> {contratos?.length || 0}</p>
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ Problemas Comuns

### Problema: Usuário não vê seus próprios dados
**Causa:** `tenant_id` não foi atribuído ao perfil do usuário
**Solução:**
```sql
-- Verificar tenant do usuário
SELECT id, nome, email, tenant_id 
FROM profiles 
WHERE email = 'email@exemplo.com';

-- Atribuir tenant se estiver NULL
UPDATE profiles 
SET tenant_id = 'uuid-do-tenant'
WHERE id = 'uuid-do-usuario';
```

### Problema: Dados aparecem duplicados
**Causa:** Hook está buscando dados sem filtrar por tenant_id
**Solução:** Verificar se o hook inclui `.eq("tenant_id", profile.tenant_id)`

### Problema: Erro de RLS ao inserir
**Causa:** `tenant_id` não foi incluído na inserção
**Solução:** Garantir que todos os `.insert()` incluem `tenant_id: tenant.id`

---

## 📋 Checklist de Revisão de Código

Antes de fazer merge, verifique:
- [ ] Hook busca `tenant_id` do usuário autenticado
- [ ] Query filtra por `tenant_id`
- [ ] Inserções incluem `tenant_id`
- [ ] RLS policies estão ativas e corretas
- [ ] Não há uso de dados mockados
- [ ] Testado com múltiplos tenants
- [ ] Logs não expõem dados sensíveis
- [ ] Componente valida `tenant?.id` antes de inserir

---

## 🚀 Próximos Passos

1. Implementar auditoria de acessos entre tenants
2. Criar dashboard de monitoramento de isolamento
3. Adicionar testes automatizados de multi-tenancy
4. Implementar migração de dados entre tenants (se necessário)
5. Documentar processo de onboarding de novos tenants
