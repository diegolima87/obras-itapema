import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function GerenciarFeatures() {
  const queryClient = useQueryClient();

  // Buscar todos os tenants com suas features
  const { data: tenantsFeatures, isLoading } = useQuery({
    queryKey: ['all-tenants-features'],
    queryFn: async () => {
      const { data: tenants, error } = await supabase
        .from('tenants')
        .select(`
          id,
          nome_municipio,
          ativo,
          tenant_features (
            id,
            feature,
            habilitado,
            data_habilitacao
          )
        `)
        .order('nome_municipio');
      
      if (error) throw error;
      return tenants || [];
    },
  });

  // Mutation para alternar feature
  const toggleFeature = useMutation({
    mutationFn: async ({ tenantId, feature, habilitado }: { tenantId: string; feature: string; habilitado: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('tenant_features')
        .upsert([{
          tenant_id: tenantId,
          feature: feature as any,
          habilitado: habilitado,
          data_habilitacao: habilitado ? new Date().toISOString() : null,
          habilitado_por: habilitado ? user?.id : null,
        }], {
          onConflict: 'tenant_id,feature'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tenants-features'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-features'] });
      toast.success('Feature atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar feature:', error);
      toast.error('Erro ao atualizar feature');
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Gerenciar Features</h1>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Features</h1>
            <p className="text-muted-foreground">
              Configure quais módulos estão disponíveis para cada tenant
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {tenantsFeatures?.map((tenant) => {
            const esfingeFeature = tenant.tenant_features?.find(
              (f: any) => f.feature === 'esfinge'
            );
            
            return (
              <Card key={tenant.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{tenant.nome_municipio}</h3>
                      {tenant.ativo ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Inativo
                        </Badge>
                      )}
                    </div>
                    {esfingeFeature?.habilitado && esfingeFeature?.data_habilitacao && (
                      <p className="text-xs text-muted-foreground">
                        Habilitado em: {new Date(esfingeFeature.data_habilitacao).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg">
                      <Zap className={`h-4 w-4 ${esfingeFeature?.habilitado ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">e-Sfinge</span>
                      <Switch
                        checked={esfingeFeature?.habilitado || false}
                        onCheckedChange={(checked) => {
                          toggleFeature.mutate({
                            tenantId: tenant.id,
                            feature: 'esfinge',
                            habilitado: checked,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {tenantsFeatures?.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum tenant encontrado</p>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
