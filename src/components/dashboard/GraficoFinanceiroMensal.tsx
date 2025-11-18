import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEvolucaoObras } from "@/hooks/useEvolucaoObras";
import { useObrasParaFiltro } from "@/hooks/useObrasParaFiltro";
import { useTiposObra } from "@/hooks/useTiposObra";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, X } from "lucide-react";

export const GraficoFinanceiroMensal = () => {
  const [obraIdSelecionada, setObraIdSelecionada] = useState<string | null>(null);
  const [tipoObraSelecionado, setTipoObraSelecionado] = useState<string | null>(null);

  const { data: obras } = useObrasParaFiltro();
  const { data: tiposObra } = useTiposObra();
  const { data: evolucao, isLoading } = useEvolucaoObras(12, obraIdSelecionada, tipoObraSelecionado);

  const limparFiltros = () => {
    setObraIdSelecionada(null);
    setTipoObraSelecionado(null);
  };

  const temFiltrosAtivos = obraIdSelecionada || tipoObraSelecionado;

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!evolucao || evolucao.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Execução Financeira Mensal
          </CardTitle>
          <CardDescription>Valor executado por mês</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>Nenhum dado financeiro disponível ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Execução Financeira Mensal</CardTitle>
          </div>
          {temFiltrosAtivos && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={limparFiltros}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>
        
        <CardDescription>
          Valor executado em obras ao longo dos últimos 12 meses
        </CardDescription>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select 
            value={obraIdSelecionada || "todas"} 
            onValueChange={(value) => setObraIdSelecionada(value === "todas" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Todas as obras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as obras</SelectItem>
              {obras?.map(obra => (
                <SelectItem key={obra.id} value={obra.id}>
                  {obra.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={tipoObraSelecionado || "todos"} 
            onValueChange={(value) => setTipoObraSelecionado(value === "todos" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {tiposObra?.map(tipo => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={evolucao}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="mes" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => 
                new Intl.NumberFormat('pt-BR', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
              label={{ 
                value: 'Valor Executado (R$)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value),
                'Valor Executado'
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={() => 'Valor Executado'}
            />
            <Bar 
              dataKey="valorExecutado" 
              fill="hsl(142.1 76.2% 36.3%)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
