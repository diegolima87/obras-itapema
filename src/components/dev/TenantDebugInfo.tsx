/**
 * 🔧 COMPONENTE DE DEBUG - APENAS DESENVOLVIMENTO
 * 
 * Este componente exibe informações sobre o tenant atual e dados visíveis
 * para facilitar a validação do isolamento multi-tenant.
 * 
 * ⚠️ NÃO incluir em produção!
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentTenant } from "@/hooks/useCurrentTenant";
import { useTenant } from "@/contexts/TenantContext";
import { useObras } from "@/hooks/useObras";
import { useContratos } from "@/hooks/useContratos";
import { useMedicoes } from "@/hooks/useMedicoes";
import { useFornecedores } from "@/hooks/useFornecedores";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Building2, FileText, Ruler, Users } from "lucide-react";

export function TenantDebugInfo() {
  const { data: currentTenant } = useCurrentTenant();
  const { tenant } = useTenant();
  const { data: obras } = useObras();
  const { data: contratos } = useContratos();
  const { data: medicoes } = useMedicoes();
  const { data: fornecedores } = useFornecedores();

  return (
    <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-base">🔒 Multi-Tenancy Debug Info</CardTitle>
          <Badge variant="outline" className="ml-auto">DEV ONLY</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-4 w-4" />
            <span>Tenant (Context)</span>
          </div>
          <div className="ml-6 text-muted-foreground">
            <p><strong>Nome:</strong> {tenant?.nome_municipio || "N/A"}</p>
            <p className="font-mono text-xs"><strong>ID:</strong> {tenant?.id || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <Database className="h-4 w-4" />
            <span>Tenant (User Profile)</span>
          </div>
          <div className="ml-6 text-muted-foreground">
            <p className="font-mono text-xs">{currentTenant?.tenant_id || "N/A"}</p>
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <p className="font-semibold text-xs uppercase">Registros Visíveis:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Obras: <strong>{obras?.length || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Contratos: <strong>{contratos?.length || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              <span>Medições: <strong>{medicoes?.length || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Fornecedores: <strong>{fornecedores?.length || 0}</strong></span>
            </div>
          </div>
        </div>

        {tenant?.id !== currentTenant?.tenant_id && (
          <div className="border-t pt-3">
            <Badge variant="destructive" className="w-full justify-center">
              ⚠️ AVISO: IDs de tenant não correspondem!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
