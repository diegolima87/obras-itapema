import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { EstatisticasPublicas } from "@/components/portal/EstatisticasPublicas";
import { ObraCard } from "@/components/portal/ObraCard";
import { MapaObras } from "@/components/portal/MapaObras";
import { FiltroObras } from "@/components/portal/FiltroObras";
import { ObrasPorStatusChart } from "@/components/charts/ObrasPorStatusChart";
import { InvestimentoPorTipoChart } from "@/components/charts/InvestimentoPorTipoChart";
import { EvolucaoTemporalChart } from "@/components/charts/EvolucaoTemporalChart";
import { InvestimentoMensalChart } from "@/components/charts/InvestimentoMensalChart";
import { ComparativoAnualChart } from "@/components/charts/ComparativoAnualChart";
import { mockObras } from "@/lib/mockData";
import { Building2, Eye, TrendingUp, BarChart3, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PortalPublico = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  // Filter only public obras
  const obrasPublicas = mockObras.filter((obra) => obra.publico_portal === true);

  // Apply filters
  const obrasFiltradas = obrasPublicas.filter((obra) => {
    const matchSearch =
      obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "todos" || obra.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || obra.tipo_obra === tipoFilter;

    return matchSearch && matchStatus && matchTipo;
  });

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-16 w-16 text-primary animate-pulse" />
              <Eye className="h-16 w-16 text-primary" />
              <Building2 className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Portal da Transparência
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Acompanhe em tempo real o andamento das obras públicas da nossa cidade. 
              Acesso livre e irrestrito às informações sobre investimentos e projetos em execução.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Card className="p-4 bg-card/50 backdrop-blur">
                <CardContent className="p-0 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Acesso Público</p>
                    <p className="text-lg font-semibold">100% Transparente</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur">
                <CardContent className="p-0 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Atualização</p>
                    <p className="text-lg font-semibold">Tempo Real</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Visão Geral</h2>
            <p className="text-muted-foreground">Números atualizados das obras públicas</p>
          </div>
          <EstatisticasPublicas obras={obrasPublicas} />
        </section>

        {/* Charts and Analytics Section */}
        <section className="bg-gradient-to-b from-background to-primary/5 border-y">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Análises e Estatísticas</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Acompanhe a evolução temporal, distribuição de investimentos e comparativos entre diferentes períodos
              </p>
            </div>
            
            <div className="space-y-6">
              <EvolucaoTemporalChart />
              
              <div className="grid gap-6 md:grid-cols-2">
                <ObrasPorStatusChart obras={obrasPublicas} />
                <InvestimentoPorTipoChart obras={obrasPublicas} />
              </div>

              <InvestimentoMensalChart />
              <ComparativoAnualChart />
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Mapa de Obras</h2>
            <p className="text-muted-foreground">Localização geográfica de todas as obras públicas</p>
          </div>
          <MapaObras obras={obrasPublicas} />
        </section>

        {/* Filter and Obras List Section */}
        <section className="bg-gradient-to-b from-background to-muted/20 border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">Obras Públicas</h2>
                <p className="text-muted-foreground">
                  Encontradas {obrasFiltradas.length} obra(s) pública(s)
                </p>
              </div>

              <FiltroObras
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                tipoFilter={tipoFilter}
                onTipoChange={setTipoFilter}
              />

              {obrasFiltradas.length === 0 ? (
                <Card className="p-12 text-center">
                  <CardContent>
                    <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Nenhuma obra encontrada</h3>
                    <p className="text-muted-foreground">
                      Tente ajustar os filtros para ver mais resultados
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {obrasFiltradas.map((obra) => (
                    <ObraCard key={obra.id} obra={obra} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-card border-t mt-12">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Portal da Transparência</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Informações públicas sobre obras e investimentos da nossa cidade.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground">
                      Lei de Acesso à Informação
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground">
                      Portal da Transparência
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground">
                      Ouvidoria
                    </Button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Informações</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Secretaria de Obras Públicas
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Atualizado em: {new Date().toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Dados públicos e acessíveis
                </p>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Prefeitura Municipal. Todos os direitos reservados.</p>
              <p className="mt-2">Sistema de Gestão de Obras Públicas com Transparência</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PortalPublico;
