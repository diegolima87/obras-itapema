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
  Cell,
} from "recharts";

interface ProgressoObrasChartProps {
  obras: Array<{
    id: string;
    nome: string;
    percentual_executado: number;
    status: string;
  }>;
}

export function ProgressoObrasChart({ obras }: ProgressoObrasChartProps) {
  const obrasAndamento = obras
    .filter((o) => o.status === "andamento")
    .map((obra) => ({
      nome: obra.nome.length > 30 ? obra.nome.substring(0, 30) + "..." : obra.nome,
      progresso: obra.percentual_executado,
    }));

  const getBarColor = (progresso: number) => {
    if (progresso < 30) return "hsl(var(--destructive))";
    if (progresso < 70) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso das Obras em Andamento</CardTitle>
        <CardDescription>Percentual de execução atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={obrasAndamento} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              type="category"
              dataKey="nome"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={150}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Progresso"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar dataKey="progresso" name="Progresso (%)" radius={[0, 8, 8, 0]}>
              {obrasAndamento.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.progresso)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
