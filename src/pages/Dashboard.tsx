import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, FileText, TrendingUp, DollarSign } from "lucide-react";
import { useObras } from "@/hooks/useObras";
import { useContratos } from "@/hooks/useContratos";
import { useMedicoes } from "@/hooks/useMedicoes";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: obras, isLoading: isLoadingObras } = useObras();
  const { data: contratos, isLoading: isLoadingContratos } = useContratos();
  const { data: medicoes, isLoading: isLoadingMedicoes } = useMedicoes();

  const obrasAndamento = obras?.filter(o => o.status === "andamento").length || 0;
  const contratosAtivos = contratos?.filter(c => c.ativo !== false).length || 0;
  const medicoesPendentes = medicoes?.filter(m => m.status === "pendente").length || 0;
  const valorTotalObras = obras?.reduce((acc, obra) => acc + (obra.valor_total || 0), 0) || 0;

  const isLoading = isLoadingObras || isLoadingContratos || isLoadingMedicoes;

  const stats = [
    {
      title: "Total de Obras",
      value: obras?.length || 0,
      icon: HardHat,
      subtitle: `${obrasAndamento} em andamento`,
      color: "text-primary",
    },
    {
      title: "Contratos Ativos",
      value: contratosAtivos,
      icon: FileText,
      subtitle: "Vigentes",
      color: "text-primary",
    },
    {
      title: "Medições Pendentes",
      value: medicoesPendentes,
      icon: TrendingUp,
      subtitle: "Aguardando aprovação",
      color: "text-warning",
    },
    {
      title: "Valor Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valorTotalObras),
      icon: DollarSign,
      subtitle: "Em obras",
      color: "text-success",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das obras públicas
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.subtitle}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Obras por Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries({
                    planejada: obras?.filter(o => o.status === "planejada").length || 0,
                    andamento: obras?.filter(o => o.status === "andamento").length || 0,
                    concluida: obras?.filter(o => o.status === "concluida").length || 0,
                    paralisada: obras?.filter(o => o.status === "paralisada").length || 0,
                  }).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{status.replace("_", " ")}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obras Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-l-4 border-muted pl-3">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ) : obras && obras.length > 0 ? (
                <div className="space-y-3">
                  {obras.slice(0, 3).map((obra) => (
                    <div key={obra.id} className="border-l-4 border-primary pl-3">
                      <p className="font-medium text-sm">{obra.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {obra.unidade_gestora}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma obra cadastrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}