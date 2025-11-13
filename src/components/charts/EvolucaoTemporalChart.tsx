import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { evolucaoTemporalData } from "@/lib/chartData";

export function EvolucaoTemporalChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal das Obras</CardTitle>
        <CardDescription>Histórico mensal de obras por status</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolucaoTemporalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="andamento"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Em Andamento"
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="concluidas"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Concluídas"
              dot={{ fill: "hsl(var(--success))" }}
            />
            <Line
              type="monotone"
              dataKey="planejadas"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              name="Planejadas"
              dot={{ fill: "hsl(var(--muted-foreground))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
