import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { comparativoAnualData } from "@/lib/chartData";

export function ComparativoAnualChart() {
  const formatCurrency = (value: number) => {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo Anual</CardTitle>
        <CardDescription>Investimento e obras concluídas por ano</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={comparativoAnualData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="ano" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "Investimento") {
                  return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value);
                }
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="investido"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="Investimento"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="concluidas"
              stroke="hsl(var(--success))"
              strokeWidth={3}
              name="Obras Concluídas"
              dot={{ fill: "hsl(var(--success))", r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
