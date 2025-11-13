import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, CheckCircle2, DollarSign } from "lucide-react";

interface EstatisticasPublicasProps {
  obras: Array<{
    status: string;
    valor_total: number;
  }>;
}

export function EstatisticasPublicas({ obras }: EstatisticasPublicasProps) {
  const totalObras = obras.length;
  const obrasAndamento = obras.filter((o) => o.status === "andamento").length;
  const obrasConcluidas = obras.filter((o) => o.status === "concluida").length;
  const valorTotal = obras.reduce((sum, o) => sum + o.valor_total, 0);

  const stats = [
    {
      label: "Total de Obras",
      value: totalObras,
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Em Andamento",
      value: obrasAndamento,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Concluídas",
      value: obrasConcluidas,
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      label: "Valor Total Investido",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(valorTotal),
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
