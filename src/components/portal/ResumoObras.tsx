import { Card, CardContent } from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp, Activity } from "lucide-react";

interface ResumoObrasProps {
  totalObras: number;
  valorTotal: number;
  percentualMedioFisico: number;
  percentualMedioFinanceiro: number;
}

export function ResumoObras({
  totalObras,
  valorTotal,
  percentualMedioFisico,
  percentualMedioFinanceiro,
}: ResumoObrasProps) {
  const cards = [
    {
      title: "Total de Obras",
      value: totalObras.toString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Valor Total Contratado",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valorTotal),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Execução Física Média",
      value: `${percentualMedioFisico.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Execução Financeira Média",
      value: `${percentualMedioFinanceiro.toFixed(1)}%`,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
