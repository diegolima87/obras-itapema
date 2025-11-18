import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, FileText, TrendingUp, DollarSign } from "lucide-react";
import { useObras } from "@/hooks/useObras";
import { useContratos } from "@/hooks/useContratos";
import { useMedicoes } from "@/hooks/useMedicoes";
import { GraficoEvolucaoObras } from "@/components/dashboard/GraficoEvolucaoObras";
import { GraficoFinanceiroMensal } from "@/components/dashboard/GraficoFinanceiroMensal";
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
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
    },
    {
      title: "Contratos Ativos",
      value: contratosAtivos,
      icon: FileText,
      subtitle: "Vigentes",
      color: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900"
    },
    {
      title: "Medições Pendentes",
      value: medicoesPendentes,
      icon: TrendingUp,
      subtitle: "Aguardando aprovação",
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
    },
    {
      title: "Valor Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(valorTotalObras),
      icon: DollarSign,
      subtitle: "Em obras",
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-md overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl md:text-3xl font-bold tracking-tight break-words line-clamp-2">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
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
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Obras por Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                    <div key={status} className="flex items-center justify-between group hover:bg-primary/5 p-2 rounded-lg transition-colors">
                      <span className="capitalize text-sm group-hover:text-primary transition-colors">{status.replace("_", " ")}</span>
                      <span className="font-semibold text-primary">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Obras Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                  {obras.slice(0, 3).map((obra, index) => (
                    <div 
                      key={obra.id} 
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-200 cursor-pointer border-l-4 border-primary"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {obra.nome}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {obra.unidade_gestora}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma obra cadastrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Evolução Temporal */}
        <div className="grid gap-4 lg:grid-cols-2">
          <GraficoEvolucaoObras />
          <GraficoFinanceiroMensal />
        </div>
      </div>
    </MainLayout>
  );
}