import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { statusLabels } from "@/lib/mockData";

interface ObrasPorStatusChartProps {
  obras: Array<{ status: string }>;
}

const STATUS_COLORS = {
  planejada: "hsl(var(--muted-foreground))",
  andamento: "hsl(var(--primary))",
  concluida: "hsl(var(--success))",
  paralisada: "hsl(var(--destructive))",
};

export function ObrasPorStatusChart({ obras }: ObrasPorStatusChartProps) {
  const statusCount = obras.reduce((acc, obra) => {
    acc[obra.status] = (acc[obra.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCount).map(([status, count]) => ({
    name: statusLabels[status as keyof typeof statusLabels],
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Status</CardTitle>
        <CardDescription>Obras agrupadas por situação atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => {
                const percent = (entry.percent * 100).toFixed(0);
                return `${entry.name}: ${percent}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
