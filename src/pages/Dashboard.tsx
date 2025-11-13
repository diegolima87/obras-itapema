import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, FileText, TrendingUp, DollarSign } from "lucide-react";
import { mockObras, mockContratos, mockMedicoes } from "@/lib/mockData";

export default function Dashboard() {
  const obrasAndamento = mockObras.filter(o => o.status === "andamento").length;
  const contratosAtivos = mockContratos.length;
  const medicoesPendentes = mockMedicoes.filter(m => m.status === "pendente").length;
  const valorTotalObras = mockObras.reduce((acc, obra) => acc + obra.valor_total, 0);

  const stats = [
    {
      title: "Total de Obras",
      value: mockObras.length,
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
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
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
              <div className="space-y-4">
                {Object.entries({
                  planejada: mockObras.filter(o => o.status === "planejada").length,
                  andamento: mockObras.filter(o => o.status === "andamento").length,
                  concluida: mockObras.filter(o => o.status === "concluida").length,
                  paralisada: mockObras.filter(o => o.status === "paralisada").length,
                }).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize text-sm">{status.replace("_", " ")}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obras Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockObras.slice(0, 3).map((obra) => (
                  <div key={obra.id} className="border-l-4 border-primary pl-3">
                    <p className="font-medium text-sm">{obra.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {obra.unidade_gestora}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}