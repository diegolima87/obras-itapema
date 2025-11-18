import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvolucaoObrasPorObra } from "@/hooks/useEvolucaoObrasPorObra";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layers } from "lucide-react";

export const GraficoAreaPorObra = () => {
  const { data, isLoading } = useEvolucaoObrasPorObra(12, 8);

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.dadosMensais || data.dadosMensais.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Contribuição por Obra
          </CardTitle>
          <CardDescription>Valor executado de cada obra ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <p>Nenhum dado disponível ainda.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
          <p className="font-semibold text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload
              .sort((a: any, b: any) => b.value - a.value)
              .map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact',
                    }).format(item.value)}
                  </span>
                </div>
              ))}
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="flex justify-between">
              <span className="text-xs font-semibold">Total:</span>
              <span className="text-xs font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  notation: 'compact',
                }).format(total)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Contribuição por Obra
        </CardTitle>
        <CardDescription>
          Valor executado das {data.obrasInfo.length} principais obras ao longo dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data.dadosMensais}>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const obra = data.obrasInfo.find(o => o.id === value);
                return obra?.nomeAbreviado || value;
              }}
            />
            {data.obrasInfo.map((obra) => (
              <Area
                key={obra.id}
                type="monotone"
                dataKey={obra.id}
                stackId="1"
                stroke={obra.cor}
                fill={obra.cor}
                fillOpacity={0.6}
                name={obra.id}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.obrasInfo.map((obra) => {
            const valorTotal = data.dadosMensais.reduce(
              (sum, mes) => sum + (Number(mes[obra.id]) || 0),
              0
            );
            return (
              <div 
                key={obra.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: obra.cor }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{obra.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    Total: {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(valorTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
