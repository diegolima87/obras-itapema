import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { statusColors, statusLabels } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";

interface ObraCardProps {
  obra: {
    id: string;
    nome: string;
    descricao: string | null;
    status: string;
    endereco?: string | null;
    valor_total: number;
    percentual_executado: number;
    data_inicio?: string | null;
    tipo_obra?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

export function ObraCard({ obra }: ObraCardProps) {
  const temLocalizacao = obra.latitude && obra.longitude;
  
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{obra.nome}</CardTitle>
          <Badge className={statusColors[obra.status as keyof typeof statusColors]}>
            {statusLabels[obra.status as keyof typeof statusLabels]}
          </Badge>
        </div>
        <div className="flex gap-2">
          {obra.tipo_obra && (
            <Badge variant="outline" className="w-fit">
              {obra.tipo_obra}
            </Badge>
          )}
          {!temLocalizacao && (
            <Badge variant="outline" className="w-fit text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Sem localização
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{obra.descricao || 'Sem descrição'}</p>

        <div className="space-y-2">
          {obra.endereco && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{obra.endereco}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(obra.valor_total)}
            </span>
          </div>

          {obra.data_inicio && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Início: {new Date(obra.data_inicio).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">{obra.percentual_executado}%</span>
          </div>
          <Progress value={obra.percentual_executado} className="h-2" />
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/obra/${obra.id}`} className="w-full">
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
