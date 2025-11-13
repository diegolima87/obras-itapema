import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { statusColors, statusLabels } from "@/lib/mockData";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapaObrasProps {
  obras: Array<{
    id: string;
    nome: string;
    status: string;
    latitude?: number;
    longitude?: number;
    valor_total: number;
    percentual_executado: number;
  }>;
}

export function MapaObras({ obras }: MapaObrasProps) {
  const obrasComLocalizacao = obras.filter((o) => o.latitude && o.longitude);

  if (obrasComLocalizacao.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Localização das Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma obra com localização disponível.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate center based on all markers
  const centerLat =
    obrasComLocalizacao.reduce((sum, o) => sum + (o.latitude || 0), 0) / obrasComLocalizacao.length;
  const centerLng =
    obrasComLocalizacao.reduce((sum, o) => sum + (o.longitude || 0), 0) / obrasComLocalizacao.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localização das Obras</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {obrasComLocalizacao.map((obra) => (
              <Marker key={obra.id} position={[obra.latitude!, obra.longitude!]}>
                <Popup>
                  <div className="space-y-2 p-2">
                    <h3 className="font-semibold text-sm">{obra.nome}</h3>
                    <Badge className={statusColors[obra.status as keyof typeof statusColors]}>
                      {statusLabels[obra.status as keyof typeof statusLabels]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Progresso: {obra.percentual_executado}%
                    </p>
                    <p className="text-xs font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(obra.valor_total)}
                    </p>
                    <Link to={`/obra/${obra.id}`}>
                      <Button size="sm" className="w-full mt-2">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
