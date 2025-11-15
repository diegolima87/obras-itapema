import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { EstatisticasPublicas } from "@/components/portal/EstatisticasPublicas";
import { ObraCard } from "@/components/portal/ObraCard";
import { MapaObras } from "@/components/portal/MapaObras";
import { FiltroObras } from "@/components/portal/FiltroObras";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Eye, TrendingUp } from "lucide-react";
import { useObrasPublicas } from "@/hooks/useObras";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const { data: obrasPublicas, isLoading } = useObrasPublicas();

  // Apply filters
  const obrasFiltradas = obrasPublicas?.filter((obra) => {
    const matchSearch =
      obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (obra.descricao?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "todos" || obra.status === statusFilter;
    const matchTipo = tipoFilter === "todos" || obra.tipo_obra === tipoFilter;

    return matchSearch && matchStatus && matchTipo;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="h-12 w-12 text-primary" />
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Portal da Transparência de Obras Públicas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe em tempo real o andamento das obras públicas da nossa cidade. 
              Transparência é compromisso com a sociedade.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EstatisticasPublicas obras={obrasPublicas || []} />
          )}
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-[500px] w-full" />
              </CardContent>
            </Card>
          ) : (
            <MapaObras obras={obrasPublicas || []} />
          )}
        </section>

        {/* Charts Section - Temporarily disabled due to Recharts compatibility issue */}
        {/* <section className="bg-gradient-to-b from-background to-primary/5 border-y">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Análises e Estatísticas</h2>
              </div>
              <p className="text-muted-foreground">
                Acompanhe a evolução e distribuição dos investimentos públicos
              </p>
            </div>
            
            <div className="space-y-6">
              <EvolucaoTemporalChart />
              
              <div className="grid gap-6 md:grid-cols-2">
                <ObrasPorStatusChart obras={obrasPublicas} />
                <InvestimentoPorTipoChart obras={obrasPublicas} />
              </div>
            </div>
          </div>
        </section> */}

        {/* Filter and Obras List Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Obras Públicas</h2>
              <p className="text-muted-foreground">
                Navegue pelas obras em andamento e concluídas
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

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : obrasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma obra encontrada com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {obrasFiltradas.map((obra) => (
                  <ObraCard key={obra.id} obra={obra} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

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
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
