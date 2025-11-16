import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FornecedorLayout } from "@/components/fornecedor/FornecedorLayout";
import { useMinhasObras } from "@/hooks/useFornecedorData";
import { Building2, MapPin, Calendar, TrendingUp, Loader2 } from "lucide-react";

const statusLabels: Record<string, string> = {
  planejada: "Planejada",
  andamento: "Em Andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

const statusColors: Record<string, string> = {
  planejada: "bg-blue-500",
  andamento: "bg-yellow-500",
  concluida: "bg-green-500",
  paralisada: "bg-red-500",
};

export default function ObrasFornecedor() {
  const { data: obras, isLoading } = useMinhasObras();

  return (
    <FornecedorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Obras</h1>
            <p className="text-muted-foreground">
              Obras vinculadas aos seus contratos ativos
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {obras?.length || 0} obra(s)
          </Badge>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : obras && obras.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra: any) => (
              <Card key={obra.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {obra.nome}
                      </CardTitle>
                    </div>
                    <Badge className={statusColors[obra.status]}>
                      {statusLabels[obra.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {obra.endereco && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{obra.endereco}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-semibold">{obra.percentual_executado || 0}%</span>
                    </div>
                    <Progress value={obra.percentual_executado || 0} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {obra.data_inicio && (
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Início</span>
                        </div>
                        <p className="font-medium">
                          {new Date(obra.data_inicio).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                    {obra.data_fim_prevista && (
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Previsão</span>
                        </div>
                        <p className="font-medium">
                          {new Date(obra.data_fim_prevista).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                  </div>

                  {obra.valor_total !== null && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Valor Total</span>
                      </div>
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(obra.valor_total)}
                      </p>
                    </div>
                  )}

                  <Link to={`/obras/${obra.id}`} className="block">
                    <Button className="w-full" variant="outline">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma obra encontrada</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Você ainda não possui obras vinculadas aos seus contratos.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </FornecedorLayout>
  );
}
