import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestimentoPorTipoChartProps {
  obras: Array<{ tipo_obra?: string; valor_total: number }>;
}

export function InvestimentoPorTipoChart({ obras }: InvestimentoPorTipoChartProps) {
  const investimentoPorTipo = obras.reduce((acc, obra) => {
    const tipo = obra.tipo_obra || "Outros";
    acc[tipo] = (acc[tipo] || 0) + obra.valor_total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(investimentoPorTipo).map(([tipo, valor]) => ({
    tipo,
    valor: valor / 1000000, // Convert to millions for better readability
    valorCompleto: valor,
  }));

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(1)}M`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investimento por Tipo de Obra</CardTitle>
        <CardDescription>Distribuição do orçamento por categoria</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="tipo" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(props.payload.valorCompleto),
                "Investimento",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar
              dataKey="valor"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="Investimento (Milhões)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
