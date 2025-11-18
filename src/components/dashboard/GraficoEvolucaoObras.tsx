import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useEvolucaoObras } from "@/hooks/useEvolucaoObras";
import { useObrasParaFiltro } from "@/hooks/useObrasParaFiltro";
import { useTiposObra } from "@/hooks/useTiposObra";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const GraficoEvolucaoObras = () => {
  const [obraIdSelecionada, setObraIdSelecionada] = useState<string | null>(null);
  const [tipoObraSelecionado, setTipoObraSelecionado] = useState<string | null>(null);
  const [dataInicial, setDataInicial] = useState<Date | undefined>();
  const [dataFinal, setDataFinal] = useState<Date | undefined>();

  const { data: obras } = useObrasParaFiltro();
  const { data: tiposObra } = useTiposObra();
  const { data: evolucao, isLoading } = useEvolucaoObras(
    12, 
    obraIdSelecionada, 
    tipoObraSelecionado,
    dataInicial || null,
    dataFinal || null
  );

  const limparFiltros = () => {
    setObraIdSelecionada(null);
    setTipoObraSelecionado(null);
    setDataInicial(undefined);
    setDataFinal(undefined);
  };

  const temFiltrosAtivos = obraIdSelecionada || tipoObraSelecionado || dataInicial || dataFinal;

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
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução das Obras
          </CardTitle>
          <CardDescription>Progresso físico e financeiro ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>Nenhum dado de evolução disponível ainda.</p>
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
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Evolução das Obras</CardTitle>
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
          Progresso físico e financeiro ao longo dos últimos 12 meses
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

        <div className="flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !dataInicial && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataInicial ? format(dataInicial, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataInicial}
                onSelect={setDataInicial}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !dataFinal && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataFinal ? format(dataFinal, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataFinal}
                onSelect={setDataFinal}
                initialFocus
                locale={ptBR}
                disabled={(date) => dataInicial ? date < dataInicial : false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolucao}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="mes" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ 
                value: 'Percentual (%)', 
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
              formatter={(value: number, name: string) => {
                if (name === 'percentualFisico') return [`${value.toFixed(1)}%`, 'Progresso Físico'];
                if (name === 'percentualFinanceiro') return [`${value.toFixed(1)}%`, 'Progresso Financeiro'];
                return [value, name];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'percentualFisico') return 'Progresso Físico';
                if (value === 'percentualFinanceiro') return 'Progresso Financeiro';
                return value;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="percentualFisico" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="percentualFinanceiro" 
              stroke="hsl(142.1 76.2% 36.3%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(142.1 76.2% 36.3%)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
