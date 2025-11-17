import { PortalHeader } from "@/components/portal/PortalHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Calendar, DollarSign, FileText, Image } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { statusColors, statusLabels, medicaoStatusColors, medicaoStatusLabels } from "@/lib/mockData";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTenant } from "@/contexts/TenantContext";

export default function ObraPublica() {
  const { id } = useParams();
  const { tenant, loading: tenantLoading } = useTenant();

  const { data: obra, isLoading } = useQuery({
    queryKey: ["obra-publica", id, tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) {
        console.error('❌ Tentativa de buscar obra sem tenant_id');
        throw new Error('Tenant não identificado');
      }

      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("id", id)
        .eq("publico_portal", true)
        .eq("tenant_id", tenant.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!tenant?.id,
  });

  const { data: contratos } = useQuery({
    queryKey: ["contratos-obra", id, tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          fornecedor:fornecedores(nome, cnpj),
          obra:obras!inner(tenant_id)
        `)
        .eq("obra_id", id)
        .eq("obra.tenant_id", tenant.id);

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!tenant?.id,
  });

  const { data: medicoes } = useQuery({
    queryKey: ["medicoes-obra", id, tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data, error } = await supabase
        .from("medicoes")
        .select(`
          *,
          obra:obras!inner(tenant_id)
        `)
        .eq("obra_id", id)
        .eq("status", "aprovado")
        .eq("obra.tenant_id", tenant.id)
        .order("competencia", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!tenant?.id,
  });

  const { data: documentos } = useQuery({
    queryKey: ["documentos-obra", id, tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];

      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .eq("obra_id", id)
        .eq("tenant_id", tenant.id)
        .in("tipo", ["projeto", "foto"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!tenant?.id,
  });

  const contrato = contratos?.[0];

  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PortalHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!tenant || !obra) {
    return (
      <div className="min-h-screen bg-background">
        <PortalHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Obra não encontrada</h2>
            <p className="text-muted-foreground">
              Esta obra não está disponível no portal de transparência ou não pertence a este município.
            </p>
            <Link to="/portal-publico">
              <Button>Voltar ao Portal</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-foreground">{obra.nome}</h1>
                <Badge className={statusColors[obra.status as keyof typeof statusColors]}>
                  {statusLabels[obra.status as keyof typeof statusLabels]}
                </Badge>
                {obra.tipo_obra && (
                  <Badge variant="outline">{obra.tipo_obra}</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-2">{obra.descricao}</p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-bold text-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(obra.valor_total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Início</p>
                    <p className="text-lg font-bold text-foreground">
                      {obra.data_inicio
                        ? new Date(obra.data_inicio).toLocaleDateString("pt-BR")
                        : "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Previsão de Término</p>
                    <p className="text-lg font-bold text-foreground">
                      {obra.data_fim_prevista
                        ? new Date(obra.data_fim_prevista).toLocaleDateString("pt-BR")
                        : "Não informado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Progresso da Obra</p>
                  <div className="space-y-2">
                    <Progress value={obra.percentual_executado} className="h-3" />
                    <p className="text-lg font-bold text-foreground text-center">
                      {obra.percentual_executado}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="geral" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="localizacao">Localização</TabsTrigger>
              <TabsTrigger value="contrato">Contrato</TabsTrigger>
              <TabsTrigger value="medicoes">Medições</TabsTrigger>
              <TabsTrigger value="fotos">Fotos</TabsTrigger>
            </TabsList>

            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Unidade Gestora</Label>
                      <p className="font-medium text-foreground">{obra.unidade_gestora}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Tipo de Obra</Label>
                      <p className="font-medium text-foreground">{obra.tipo_obra || "Não informado"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Valor Total</Label>
                      <p className="font-medium text-foreground">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(obra.valor_total)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Percentual Executado</Label>
                      <p className="font-medium text-foreground">{obra.percentual_executado}%</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Data de Início</Label>
                      <p className="font-medium text-foreground">
                        {obra.data_inicio
                          ? new Date(obra.data_inicio).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Previsão de Término</Label>
                      <p className="font-medium text-foreground">
                        {obra.data_fim_prevista
                          ? new Date(obra.data_fim_prevista).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="localizacao">
              <Card>
                <CardHeader>
                  <CardTitle>Localização da Obra</CardTitle>
                </CardHeader>
                <CardContent>
                  {obra.endereco ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <Label className="text-muted-foreground">Endereço</Label>
                          <p className="font-medium text-foreground">{obra.endereco}</p>
                        </div>
                      </div>
                      {obra.latitude && obra.longitude && (
                        <p className="text-sm text-muted-foreground">
                          Coordenadas: {obra.latitude}, {obra.longitude}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Localização não informada.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contrato">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Contrato</CardTitle>
                </CardHeader>
                <CardContent>
                  {contrato ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-muted-foreground">Número do Contrato</Label>
                          <p className="font-medium text-foreground">{contrato.numero}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Modalidade</Label>
                          <p className="font-medium text-foreground">{contrato.modalidade}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Fornecedor</Label>
                          <p className="font-medium text-foreground">{contrato.fornecedor?.nome || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Origem do Recurso</Label>
                          <p className="font-medium text-foreground">{contrato.origem_recurso}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Valor Inicial</Label>
                          <p className="font-medium text-foreground">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(contrato.valor_inicial)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Data de Assinatura</Label>
                          <p className="font-medium text-foreground">
                            {new Date(contrato.data_assinatura).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum contrato vinculado a esta obra.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medicoes">
              <Card>
                <CardHeader>
                  <CardTitle>Medições Aprovadas</CardTitle>
                </CardHeader>
                <CardContent>
                  {medicoes && medicoes.length > 0 ? (
                    <div className="space-y-4">
                      {medicoes.map((medicao) => (
                        <Card key={medicao.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{medicao.numero_medicao}</p>
                                  <Badge className={medicaoStatusColors[medicao.status as keyof typeof medicaoStatusColors]}>
                                    {medicaoStatusLabels[medicao.status as keyof typeof medicaoStatusLabels]}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Competência: {medicao.competencia 
                                    ? new Date(medicao.competencia).toLocaleDateString("pt-BR", {
                                        month: "2-digit",
                                        year: "numeric"
                                      })
                                    : "N/A"}
                                </p>
                                {medicao.descricao && (
                                  <p className="text-sm text-muted-foreground">{medicao.descricao}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-foreground">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(medicao.valor_medido || 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Físico: {medicao.percentual_fisico?.toFixed(2) || 0}%
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Financeiro: {medicao.percentual_financeiro?.toFixed(2) || 0}%
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma medição aprovada registrada.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fotos">
              <Card>
                <CardHeader>
                  <CardTitle>Galeria de Fotos</CardTitle>
                </CardHeader>
                <CardContent>
                  {documentos && documentos.filter(d => d.tipo === "foto").length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {documentos
                        .filter(d => d.tipo === "foto")
                        .map((foto) => (
                          <Card key={foto.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              {foto.url && (
                                <img 
                                  src={foto.url} 
                                  alt={foto.nome}
                                  className="w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(foto.url!, "_blank")}
                                />
                              )}
                              <div className="p-3">
                                <p className="text-sm font-medium text-foreground">{foto.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(foto.created_at || "").toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma foto disponível no momento.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              Portal da Transparência - Prefeitura Municipal
            </p>
            <p className="text-xs text-muted-foreground">
              Lei de Acesso à Informação - LAI (Lei nº 12.527/2011)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
