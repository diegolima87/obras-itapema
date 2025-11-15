import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { statusColors, statusLabels } from "@/lib/mockData";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

// Fix for default marker icon in react-leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: iconShadow,
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

// Separate component for markers to avoid React 18 Context issues
function MapMarkers({ obras }: { obras: MapaObrasProps['obras'] }) {
  return (
    <>
      {obras.map((obra) => (
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
    </>
  );
}

export function MapaObras({ obras }: MapaObrasProps) {
  // Ensure obras is always an array and memoize
  const obrasArray = useMemo(() => Array.isArray(obras) ? obras : [], [obras]);
  
  const obrasComLocalizacao = useMemo(
    () => obrasArray.filter(
      (o) => o && typeof o.latitude === 'number' && typeof o.longitude === 'number'
    ),
    [obrasArray]
  );

  // Memoize center calculation
  const mapCenter = useMemo(() => {
    if (obrasComLocalizacao.length === 0) {
      return null;
    }

    const lat = obrasComLocalizacao.reduce((sum, o) => sum + (o.latitude || 0), 0) / obrasComLocalizacao.length;
    const lng = obrasComLocalizacao.reduce((sum, o) => sum + (o.longitude || 0), 0) / obrasComLocalizacao.length;

    if (!isFinite(lat) || !isFinite(lng)) {
      return null;
    }

    return [lat, lng] as [number, number];
  }, [obrasComLocalizacao]);

  if (!mapCenter || obrasComLocalizacao.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Localização das Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma obra com localização disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localização das Obras</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] w-full rounded-b-lg overflow-hidden">
          <MapContainer
            key={`map-${obrasComLocalizacao.length}-${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={12}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapMarkers obras={obrasComLocalizacao} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
